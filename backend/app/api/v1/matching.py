from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.matching import MatchCriteriaRequest, MatchResponse
from app.services.matching_service import MatchingService
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/match", tags=["Smart Scheme Recommender"])

@router.post("/", response_model=MatchResponse)
async def match_schemes(
    body: MatchCriteriaRequest,
    db: AsyncSession = Depends(get_db)
):
    response = await MatchingService.match_schemes(body, db)
    await AnalyticsService.log_event(
        db=db,
        event_type="MATCH_GENERATED",
        region=body.state or body.district,
        metadata={"total_matches": response.total_matches, "estimated_cost": body.estimated_cost}
    )
    return response
