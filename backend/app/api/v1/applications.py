from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.application import ApplicationStatus
from app.schemas.application import ApplicationStatusCreate, ApplicationStatusUpdate, ApplicationStatusResponse
from app.core.dependencies import require_authenticated_user

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("/my", response_model=List[ApplicationStatusResponse])
async def get_my_applications(
    user_payload: dict = Depends(require_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    citizen_id = user_payload.get("sub")
    query = select(ApplicationStatus).where(ApplicationStatus.citizen_id == citizen_id)
    res = await db.execute(query)
    return res.scalars().all()

@router.post("/", response_model=ApplicationStatusResponse)
async def create_application(
    body: ApplicationStatusCreate,
    db: AsyncSession = Depends(get_db)
):
    app = ApplicationStatus(**body.model_dump())
    db.add(app)
    await db.commit()
    await db.refresh(app)
    return app
