import uuid
from sqlalchemy import Column, String, Float, Boolean, JSON
from app.db.database import Base

class ChannelPartner(Base):
    __tablename__ = "channel_partners"

    id = Column(String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    partner_type = Column(String(50), nullable=False)  # SCA, PSB, RRB, NBFC_MFI
    branch_name = Column(String(255), nullable=True)
    address = Column(String(500), nullable=False)
    district = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    pincode = Column(String(10), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(100), nullable=True)
    eligible_scheme_types = Column(JSON, default=list)
    npa_status = Column(String(50), default="ELIGIBLE")  # ELIGIBLE, OVERDUE_RESTRICTED, HIGH_NPA_BLOCKED
    npa_ratio_percent = Column(Float, default=0.0)
    fund_utilisation_score = Column(Float, default=100.0)
    is_active = Column(Boolean, default=True)
