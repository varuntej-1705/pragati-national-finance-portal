import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_id = Column(String(50), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    field_name = Column(String(100), nullable=False)   # e.g. annualFamilyIncome, category, gender
    operator = Column(String(20), nullable=False)     # e.g. <=, >=, ==, IN
    rule_value = Column(JSON, nullable=False)         # 500000, "SC", ["female"]
    is_mandatory = Column(Boolean, default=True)
    description = Column(String(255), nullable=True)

    scheme = relationship("Scheme", back_populates="rules")
