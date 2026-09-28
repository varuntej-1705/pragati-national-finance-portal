import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    ministry = Column(String(255), nullable=False)
    implementing_agency = Column(String(255), nullable=False)
    scheme_type = Column(String(50), nullable=False)  # MICRO_FINANCE, TERM_LOAN, etc.
    max_loan_amount = Column(Float, nullable=False)
    max_coverage_percent = Column(Float, default=90.0)
    interest_rate_min = Column(Float, nullable=False)
    interest_rate_max = Column(Float, nullable=False)
    women_rebate_percent = Column(Float, default=0.5)
    moratorium_months_min = Column(Integer, default=3)
    moratorium_months_max = Column(Integer, default=12)
    max_repayment_years = Column(Integer, default=5)
    income_ceiling = Column(Float, default=500000.0)
    target_audience = Column(Text, nullable=True)
    brief_description = Column(Text, nullable=False)
    detailed_benefits = Column(JSON, default=list)
    required_documents = Column(JSON, default=list)
    application_procedure = Column(JSON, default=list)
    official_portal_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    last_synced_at = Column(DateTime, default=datetime.utcnow)

    rules = relationship("EligibilityRule", back_populates="scheme", cascade="all, delete-orphan")
