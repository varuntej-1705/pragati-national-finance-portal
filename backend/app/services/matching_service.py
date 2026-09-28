from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.matching import MatchCriteriaRequest, MatchResponse, SchemeMatchItem, RuleEvaluationItem
from app.schemas.scheme import SchemeResponse
from app.services.scheme_service import SchemeService
from app.engines.eligibility_engine import EligibilityEngine
from app.engines.confidence_engine import ConfidenceEngine
from app.engines.ranking_engine import RankingEngine
from app.ai.explanation import ExplanationGenerator

class MatchingService:
    @classmethod
    async def match_schemes(cls, criteria: MatchCriteriaRequest, db: AsyncSession) -> MatchResponse:
        profile_dict = criteria.model_dump()
        all_schemes = await SchemeService.get_all_schemes(db)
        
        matches = []
        for s in all_schemes:
            # Deterministic rule evaluation
            eval_res = EligibilityEngine.evaluate_scheme(s, profile_dict)
            if not eval_res["is_eligible"]:
                continue

            conf_res = ConfidenceEngine.calculate_confidence(eval_res)
            
            # Map scheme object/dict
            scheme_id = getattr(s, "id", s.get("id") if isinstance(s, dict) else "")
            name = getattr(s, "name", s.get("name") if isinstance(s, dict) else "")
            code = getattr(s, "code", s.get("code") if isinstance(s, dict) else "")
            ministry = getattr(s, "ministry", s.get("ministry") if isinstance(s, dict) else "")
            agency = getattr(s, "implementing_agency", s.get("implementingAgency", s.get("implementing_agency")) if isinstance(s, dict) else "")
            stype = getattr(s, "scheme_type", s.get("schemeType", s.get("scheme_type")) if isinstance(s, dict) else "")
            max_loan = getattr(s, "max_loan_amount", s.get("maxLoanAmount", s.get("max_loan_amount")) if isinstance(s, dict) else 0.0)
            cov_pct = getattr(s, "max_coverage_percent", s.get("maxCoveragePercent", s.get("max_coverage_percent", 90.0)) if isinstance(s, dict) else 90.0)
            rate_min = getattr(s, "interest_rate_min", s.get("interestRateMin", s.get("interest_rate_min")) if isinstance(s, dict) else 5.0)
            rate_max = getattr(s, "interest_rate_max", s.get("interestRateMax", s.get("interest_rate_max")) if isinstance(s, dict) else 6.0)
            rebate = getattr(s, "women_rebate_percent", s.get("womenRebatePercent", 0.5) if isinstance(s, dict) else 0.5)
            mor_min = getattr(s, "moratorium_months_min", s.get("moratoriumMonthsMin", 3) if isinstance(s, dict) else 3)
            mor_max = getattr(s, "moratorium_months_max", s.get("moratoriumMonthsMax", 6) if isinstance(s, dict) else 6)
            repay_yrs = getattr(s, "max_repayment_years", s.get("maxRepaymentYears", 5) if isinstance(s, dict) else 5)
            ceiling = getattr(s, "income_ceiling", s.get("incomeCeiling", 500000.0) if isinstance(s, dict) else 500000.0)
            target = getattr(s, "target_audience", s.get("targetAudience") if isinstance(s, dict) else None)
            brief = getattr(s, "brief_description", s.get("briefDescription", "") if isinstance(s, dict) else "")
            benefits = getattr(s, "detailed_benefits", s.get("detailedBenefits", []) if isinstance(s, dict) else [])
            docs = getattr(s, "required_documents", s.get("requiredDocuments", []) if isinstance(s, dict) else [])
            proc = getattr(s, "application_procedure", s.get("applicationProcedure", []) if isinstance(s, dict) else [])
            portal_url = getattr(s, "official_portal_url", s.get("officialPortalUrl") if isinstance(s, dict) else None)
            active = getattr(s, "is_active", s.get("isActive", True) if isinstance(s, dict) else True)

            # Calculate concessional rate based on gender
            applied_rate = rate_min
            if criteria.gender and criteria.gender.lower() == "female":
                applied_rate = max(3.5, rate_min - rebate)

            max_eligible_loan = min(criteria.estimated_cost * (cov_pct / 100.0), max_loan)

            explanation = ExplanationGenerator.generate_explanation(
                scheme_name=name,
                confidence=conf_res["confidence"],
                passed_rules=eval_res["passed_rules"],
                unverified_rules=eval_res["unverified_rules"],
                estimated_cost=criteria.estimated_cost,
                concessional_rate=applied_rate,
                moratorium_months=mor_min
            )

            scheme_resp = SchemeResponse(
                id=scheme_id,
                code=code,
                name=name,
                ministry=ministry,
                implementing_agency=agency,
                scheme_type=stype,
                max_loan_amount=max_loan,
                max_coverage_percent=cov_pct,
                interest_rate_min=rate_min,
                interest_rate_max=rate_max,
                women_rebate_percent=rebate,
                moratorium_months_min=mor_min,
                moratorium_months_max=mor_max,
                max_repayment_years=repay_yrs,
                income_ceiling=ceiling,
                target_audience=target,
                brief_description=brief,
                detailed_benefits=benefits,
                required_documents=docs,
                application_procedure=proc,
                official_portal_url=portal_url,
                is_active=active,
                rules=[]
            )

            matches.append({
                "scheme": scheme_resp,
                "confidence": conf_res["confidence"],
                "match_score": conf_res["match_score"],
                "passed_rules": [RuleEvaluationItem(**r) for r in eval_res["passed_rules"]],
                "unverified_rules": [RuleEvaluationItem(**r) for r in eval_res["unverified_rules"]],
                "failed_rules": [RuleEvaluationItem(**r) for r in eval_res["failed_rules"]],
                "plain_language_explanation": explanation,
                "max_eligible_loan_amount": round(max_eligible_loan, 2),
                "concessional_interest_rate": applied_rate,
                "estimated_moratorium_months": mor_min
            })

        # Rank matches using RankingEngine
        ranked_matches = RankingEngine.rank_matches(matches, criteria.estimated_cost)
        top_items = [SchemeMatchItem(**m) for m in ranked_matches]

        return MatchResponse(
            total_matches=len(top_items),
            top_matches=top_items,
            profile_summary={
                "income_covered": criteria.annual_family_income <= 500000,
                "category_eligible": criteria.category.upper() == "SC",
                "estimated_cost": criteria.estimated_cost,
                "applicant_state": criteria.state
            }
        )
