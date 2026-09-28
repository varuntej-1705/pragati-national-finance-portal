from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.scheme import SchemeResponse
from app.services.scheme_service import SchemeService

router = APIRouter(prefix="/schemes", tags=["Schemes"])

@router.get("/", response_model=List[SchemeResponse])
async def list_schemes(
    scheme_type: Optional[str] = Query(None, description="Filter by scheme type"),
    db: AsyncSession = Depends(get_db)
):
    schemes = await SchemeService.get_all_schemes(db, scheme_type=scheme_type)
    return schemes

@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(
    scheme_id: str,
    db: AsyncSession = Depends(get_db)
):
    scheme = await SchemeService.get_scheme_by_id(db, scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
