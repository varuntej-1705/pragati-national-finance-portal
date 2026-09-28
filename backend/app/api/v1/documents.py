from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.document import Document
from app.core.dependencies import require_authenticated_user

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/my")
async def get_my_documents(
    user_payload: dict = Depends(require_authenticated_user),
    db: AsyncSession = Depends(get_db)
):
    citizen_id = user_payload.get("sub")
    query = select(Document).where(Document.citizen_id == citizen_id)
    res = await db.execute(query)
    docs = res.scalars().all()
    return docs or [
        {"doc_type": "Aadhaar Card", "status": "VERIFIED"},
        {"doc_type": "Income Certificate", "status": "VERIFIED"},
        {"doc_type": "Caste Certificate (SC)", "status": "VERIFIED"},
        {"doc_type": "Project Cost Quotation", "status": "PENDING"}
    ]
