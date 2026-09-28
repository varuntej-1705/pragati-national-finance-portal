import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from app.db.database import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    citizen_id = Column(String(36), ForeignKey("citizens.id", ondelete="SET NULL"), nullable=True, index=True)
    scheme_id = Column(String(50), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    confidence = Column(String(20), nullable=False)  # HIGH, MEDIUM, LOW
    match_score = Column(Float, default=100.0)
    match_reasons = Column(JSON, default=list)
    explanation_text = Column(String(1000), nullable=True)
    matched_at = Column(DateTime, default=datetime.utcnow)
