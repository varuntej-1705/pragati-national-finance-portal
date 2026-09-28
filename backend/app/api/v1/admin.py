from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core.dependencies import require_roles
from app.core.permissions import Role
from app.services.analytics_service import AnalyticsService
from app.services.scheme_service import SchemeService
from app.services.partner_service import PartnerService

router = APIRouter(prefix="/admin", tags=["Admin & Analytics"])

@router.get("/overview")
async def get_overview_kpis(db: AsyncSession = Depends(get_db)):
    return await AnalyticsService.get_overview_kpis(db)

@router.get("/partners")
async def get_all_partners_admin(db: AsyncSession = Depends(get_db)):
    return await PartnerService.get_all_partners(db)

@router.get("/schemes")
async def get_all_schemes_admin(db: AsyncSession = Depends(get_db)):
    return await SchemeService.get_all_schemes(db)
