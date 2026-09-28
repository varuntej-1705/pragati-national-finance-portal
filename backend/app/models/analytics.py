import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON
from app.db.database import Base

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_type = Column(String(100), nullable=False, index=True)  # MATCH_GENERATED, SCHEME_VIEWED, CALCULATOR_USED, PARTNER_CONTACTED
    scheme_id = Column(String(50), nullable=True, index=True)
    region = Column(String(100), nullable=True, index=True)  # State or district
    metadata_payload = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
