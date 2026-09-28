import json
from pathlib import Path
from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule

class SchemeService:
    @staticmethod
    def get_seed_schemes() -> List[dict]:
        seed_path = Path(__file__).resolve().parents[3] / "data" / "schemes" / "nsfdc_schemes.json"
        if seed_path.exists():
            with open(seed_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    @classmethod
    async def get_all_schemes(cls, db: AsyncSession, scheme_type: Optional[str] = None) -> List[Any]:
        query = select(Scheme).options(selectinload(Scheme.rules)).where(Scheme.is_active == True)
        if scheme_type:
            query = query.where(Scheme.scheme_type == scheme_type)
        
        result = await db.execute(query)
        schemes = result.scalars().all()
        
        if not schemes:
            # Fallback to seed dataset in memory if DB has not been populated yet
            seed_data = cls.get_seed_schemes()
            if scheme_type:
                seed_data = [s for s in seed_data if s.get("schemeType") == scheme_type or s.get("scheme_type") == scheme_type]
            return seed_data

        return schemes

    @classmethod
    async def get_scheme_by_id(cls, db: AsyncSession, scheme_id: str) -> Optional[Any]:
        query = select(Scheme).options(selectinload(Scheme.rules)).where(Scheme.id == scheme_id)
        result = await db.execute(query)
        scheme = result.scalar_one_or_none()
        
        if not scheme:
            # Check seed
            seed_data = cls.get_seed_schemes()
            for s in seed_data:
                if s.get("id") == scheme_id:
                    return s
        return scheme
