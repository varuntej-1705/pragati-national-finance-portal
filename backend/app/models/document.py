import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from app.db.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    citizen_id = Column(String(36), ForeignKey("citizens.id", ondelete="CASCADE"), nullable=False, index=True)
    doc_type = Column(String(100), nullable=False)  # Aadhaar, Caste Certificate, Income Certificate, etc.
    file_ref = Column(String(500), nullable=True)
    status = Column(String(50), default="UPLOADED")  # UPLOADED, VERIFIED, REJECTED
    uploaded_at = Column(DateTime, default=datetime.utcnow)
