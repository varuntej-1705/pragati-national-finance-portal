from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.ai.chat import ChatAssistant

router = APIRouter(prefix="/chat", tags=["AI Assistant"])

class ChatRequest(BaseModel):
    query: str
    language: str = "en"

@router.post("/")
async def chat_query(
    body: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    return await ChatAssistant.process_query(body.query, body.language, db)
