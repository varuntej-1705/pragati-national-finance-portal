from typing import List, Dict, Any

class RankingEngine:
    """
    Ranks eligible schemes according to user fit, coverage percentage, and financial benefit.
    """

    @staticmethod
    def rank_matches(matches: List[Dict[str, Any]], estimated_cost: float = 0.0) -> List[Dict[str, Any]]:
        def score_match(item: Dict[str, Any]) -> float:
            score = item.get("match_score", 0.0)
            scheme = item.get("scheme")
            
            # Confidence bonus
            confidence = item.get("confidence", "LOW")
            if confidence == "HIGH":
                score += 50.0
            elif confidence == "MEDIUM":
                score += 20.0

            # Coverage & interest rate bonus
            max_loan = getattr(scheme, "max_loan_amount", scheme.get("max_loan_amount", 0) if isinstance(scheme, dict) else 0)
            interest_min = getattr(scheme, "interest_rate_min", scheme.get("interest_rate_min", 10) if isinstance(scheme, dict) else 10)
            
            # Lower interest is more favorable
            score += max(0, 15.0 - interest_min)

            # Cap alignment
            if estimated_cost > 0:
                if estimated_cost <= max_loan:
                    score += 15.0

            return score

        return sorted(matches, key=score_match, reverse=True)
