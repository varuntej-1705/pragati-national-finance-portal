import json
from pathlib import Path
from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.channel_partner import ChannelPartner
from app.schemas.partner import PartnerLocatorQuery, ChannelPartnerResponse
from app.engines.partner_routing_engine import PartnerRoutingEngine

class PartnerService:
    @staticmethod
    def get_seed_partners() -> List[dict]:
        seed_path = Path(__file__).resolve().parents[3] / "data" / "partners" / "channel_partners.json"
        if seed_path.exists():
            with open(seed_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    @classmethod
    async def get_all_partners(cls, db: AsyncSession) -> List[Any]:
        query = select(ChannelPartner).where(ChannelPartner.is_active == True)
        result = await db.execute(query)
        partners = result.scalars().all()
        
        if not partners:
            return cls.get_seed_partners()
        return partners

    @classmethod
    async def find_nearest_partners(
        cls,
        query_params: PartnerLocatorQuery,
        db: AsyncSession
    ) -> List[ChannelPartnerResponse]:
        all_partners = await cls.get_all_partners(db)

        ranked = PartnerRoutingEngine.filter_and_rank_partners(
            partners=all_partners,
            user_lat=query_params.latitude,
            user_lon=query_params.longitude,
            scheme_type=query_params.scheme_type,
            district=query_params.district,
            state=query_params.state,
            max_distance_km=query_params.max_distance_km,
            exclude_high_npa=query_params.exclude_high_npa
        )

        response_list: List[ChannelPartnerResponse] = []
        for item in ranked:
            p = item["partner"]
            resp = ChannelPartnerResponse(
                id=getattr(p, "id", p.get("id") if isinstance(p, dict) else ""),
                name=getattr(p, "name", p.get("name") if isinstance(p, dict) else ""),
                partner_type=getattr(p, "partner_type", p.get("partnerType", p.get("partner_type")) if isinstance(p, dict) else "SCA"),
                branch_name=getattr(p, "branch_name", p.get("branchName", p.get("branch_name")) if isinstance(p, dict) else None),
                address=getattr(p, "address", p.get("address") if isinstance(p, dict) else ""),
                district=getattr(p, "district", p.get("district") if isinstance(p, dict) else ""),
                state=getattr(p, "state", p.get("state") if isinstance(p, dict) else ""),
                pincode=getattr(p, "pincode", p.get("pincode") if isinstance(p, dict) else ""),
                latitude=getattr(p, "latitude", p.get("latitude") if isinstance(p, dict) else 0.0),
                longitude=getattr(p, "longitude", p.get("longitude") if isinstance(p, dict) else 0.0),
                phone=getattr(p, "phone", p.get("phone") if isinstance(p, dict) else ""),
                email=getattr(p, "email", p.get("email") if isinstance(p, dict) else None),
                eligible_scheme_types=getattr(p, "eligible_scheme_types", p.get("eligibleSchemeTypes", p.get("eligible_scheme_types")) if isinstance(p, dict) else []),
                npa_status=getattr(p, "npa_status", p.get("npaStatus", p.get("npa_status")) if isinstance(p, dict) else "ELIGIBLE"),
                npa_ratio_percent=getattr(p, "npa_ratio_percent", p.get("npaRatioPercent", p.get("npa_ratio_percent")) if isinstance(p, dict) else 0.0),
                fund_utilisation_score=getattr(p, "fund_utilisation_score", p.get("fundUtilisationScore", p.get("fund_utilisation_score")) if isinstance(p, dict) else 100.0),
                is_active=getattr(p, "is_active", p.get("isActive", p.get("is_active")) if isinstance(p, dict) else True),
                distance_km=item.get("distance_km")
            )
            response_list.append(resp)

        return response_list
