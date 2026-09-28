import asyncio
import json
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parents[1] / "backend"
sys.path.insert(0, str(backend_dir))

from sqlalchemy.future import select
from app.db.session import AsyncSessionLocal, engine
from app.db.database import Base
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.channel_partner import ChannelPartner
from app.models.citizen import Citizen

async def seed_data():
    print("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    root_dir = Path(__file__).resolve().parents[1]
    schemes_file = root_dir / "data" / "schemes" / "nsfdc_schemes.json"
    partners_file = root_dir / "data" / "partners" / "channel_partners.json"

    async with AsyncSessionLocal() as session:
        # Check if schemes exist
        res = await session.execute(select(Scheme))
        existing_schemes = res.scalars().all()
        if not existing_schemes and schemes_file.exists():
            print(f"Loading schemes from {schemes_file}...")
            with open(schemes_file, "r", encoding="utf-8") as f:
                schemes_data = json.load(f)

            for s in schemes_data:
                rules_data = s.pop("rules", [])
                scheme = Scheme(
                    id=s["id"],
                    code=s["code"],
                    name=s["name"],
                    ministry=s["ministry"],
                    implementing_agency=s["implementingAgency"],
                    scheme_type=s["schemeType"],
                    max_loan_amount=s["maxLoanAmount"],
                    max_coverage_percent=s.get("maxCoveragePercent", 90.0),
                    interest_rate_min=s["interestRateMin"],
                    interest_rate_max=s["interestRateMax"],
                    women_rebate_percent=s.get("womenRebatePercent", 0.5),
                    moratorium_months_min=s.get("moratoriumMonthsMin", 3),
                    moratorium_months_max=s.get("moratoriumMonthsMax", 6),
                    max_repayment_years=s.get("maxRepaymentYears", 5),
                    income_ceiling=s.get("incomeCeiling", 500000.0),
                    target_audience=s.get("targetAudience"),
                    brief_description=s["briefDescription"],
                    detailed_benefits=s.get("detailedBenefits", []),
                    required_documents=s.get("requiredDocuments", []),
                    application_procedure=s.get("applicationProcedure", []),
                    official_portal_url=s.get("officialPortalUrl"),
                    is_active=s.get("isActive", True)
                )
                session.add(scheme)

                for r in rules_data:
                    rule = EligibilityRule(
                        scheme_id=s["id"],
                        field_name=r["fieldName"],
                        operator=r["operator"],
                        rule_value=r["ruleValue"],
                        is_mandatory=r.get("isMandatory", True),
                        description=r.get("description")
                    )
                    session.add(rule)

            print(f"Seeded {len(schemes_data)} NSFDC schemes.")

        # Check partners
        res = await session.execute(select(ChannelPartner))
        existing_partners = res.scalars().all()
        if not existing_partners and partners_file.exists():
            print(f"Loading channel partners from {partners_file}...")
            with open(partners_file, "r", encoding="utf-8") as f:
                partners_data = json.load(f)

            for p in partners_data:
                partner = ChannelPartner(
                    id=p["id"],
                    name=p["name"],
                    partner_type=p["partnerType"],
                    branch_name=p.get("branchName"),
                    address=p["address"],
                    district=p["district"],
                    state=p["state"],
                    pincode=p["pincode"],
                    latitude=p["latitude"],
                    longitude=p["longitude"],
                    phone=p["phone"],
                    email=p.get("email"),
                    eligible_scheme_types=p.get("eligibleSchemeTypes", []),
                    npa_status=p.get("npaStatus", "ELIGIBLE"),
                    npa_ratio_percent=p.get("npaRatioPercent", 0.0),
                    fund_utilisation_score=p.get("fundUtilisationScore", 100.0),
                    is_active=p.get("isActive", True)
                )
                session.add(partner)

            print(f"Seeded {len(partners_data)} Channel Partners.")

        # Seed sample demo accounts
        res = await session.execute(select(Citizen).where(Citizen.phone == "9876543210"))
        if not res.scalar_one_or_none():
            demo_citizen = Citizen(
                id="citizen-varun-01",
                phone="9876543210",
                role="citizen",
                full_name="Varun (Arigonda Varun Teja)",
                age=22,
                gender="male",
                category="SC",
                annual_family_income=240000.0,
                education_status="Graduate (B.Tech)",
                occupation="Aspiring Tech Entrepreneur",
                state="Tamil Nadu",
                district="Chennai",
                pincode="600018",
                language_pref="en"
            )
            session.add(demo_citizen)
            print("Seeded demo citizen profile.")

        await session.commit()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_data())
