from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.citizen import Citizen
from app.schemas.citizen import CitizenCreate, CitizenUpdate, CitizenResponse
from app.core.dependencies import require_authenticated_user

router = APIRouter(prefix="/citizens", tags=["Citizens"])

@router.get("/me", response_model=CitizenResponse)
async def get_my_profile(
    user_payload: dict = Depends(require_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = user_payload.get("sub")
    query = select(Citizen).where(Citizen.id == user_id)
    res = await db.execute(query)
    citizen = res.scalar_one_or_none()
    if not citizen:
        # Return fallback demo profile for development
        return CitizenResponse(
            id=user_id,
            phone="9876543210",
            role=user_payload.get("role", "citizen"),
            full_name="Varun Teja",
            annual_family_income=240000.0,
            category="SC",
            state="Tamil Nadu",
            district="Chennai",
            language_pref="en",
            created_at=citizen.created_at if citizen else None,
            updated_at=citizen.updated_at if citizen else None
        )
    return citizen

@router.post("/", response_model=CitizenResponse)
async def create_or_update_profile(
    body: CitizenCreate,
    db: AsyncSession = Depends(get_db)
):
    query = select(Citizen).where(Citizen.phone == body.phone)
    res = await db.execute(query)
    existing = res.scalar_one_or_none()

    if existing:
        for k, v in body.model_dump(exclude_unset=True).items():
            setattr(existing, k, v)
        await db.commit()
        await db.refresh(existing)
        return existing
    else:
        new_c = Citizen(**body.model_dump())
        db.add(new_c)
        await db.commit()
        await db.refresh(new_c)
        return new_c
