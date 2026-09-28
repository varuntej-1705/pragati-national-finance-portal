from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.partner import PartnerLocatorQuery, ChannelPartnerResponse
from app.services.partner_service import PartnerService
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/partners", tags=["Geo-Spatial Partner Locator"])

@router.get("/", response_model=List[ChannelPartnerResponse])
async def list_channel_partners(
    district: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = PartnerLocatorQuery(district=district, state=state)
    return await PartnerService.find_nearest_partners(query, db)

@router.post("/locate", response_model=List[ChannelPartnerResponse])
async def locate_nearest_partners(
    body: PartnerLocatorQuery,
    db: AsyncSession = Depends(get_db)
):
    results = await PartnerService.find_nearest_partners(body, db)
    await AnalyticsService.log_event(
        db=db,
        event_type="PARTNER_LOCATED",
        region=body.district or body.state,
        metadata={"found_count": len(results), "exclude_high_npa": body.exclude_high_npa}
    )
    return results
