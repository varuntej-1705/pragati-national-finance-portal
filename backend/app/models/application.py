import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from app.db.database import Base

class ApplicationStatus(Base):
    __tablename__ = "application_statuses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    citizen_id = Column(String(36), ForeignKey("citizens.id", ondelete="CASCADE"), nullable=False, index=True)
    scheme_id = Column(String(50), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    channel_partner_id = Column(String(50), ForeignKey("channel_partners.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="NOT_STARTED", nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
