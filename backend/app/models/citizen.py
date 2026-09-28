import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime
from app.db.database import Base

class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(20), unique=True, index=True, nullable=False)
    role = Column(String(20), default="citizen", nullable=False)
    full_name = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    category = Column(String(50), default="SC", nullable=True)
    annual_family_income = Column(Float, nullable=False, default=0.0)
    education_status = Column(String(100), nullable=True)
    occupation = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=True)
    disability_status = Column(Boolean, default=False)
    language_pref = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
