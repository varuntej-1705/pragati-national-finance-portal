from typing import Optional, List
from pydantic import BaseModel, Field

class ChannelPartnerBase(BaseModel):
    name: str
    partner_type: str  # SCA, PSB, RRB, NBFC_MFI
    branch_name: Optional[str] = None
    address: str
    district: str
    state: str
    pincode: str
    latitude: float
    longitude: float
    phone: str
    email: Optional[str] = None
    eligible_scheme_types: List[str] = []
    npa_status: str = "ELIGIBLE"
    npa_ratio_percent: float = 0.0
    fund_utilisation_score: float = 100.0
    is_active: bool = True

class ChannelPartnerCreate(ChannelPartnerBase):
    pass

class ChannelPartnerResponse(ChannelPartnerBase):
    id: str
    distance_km: Optional[float] = None

    class Config:
        from_attributes = True

class PartnerLocatorQuery(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    scheme_type: Optional[str] = None
    max_distance_km: float = Field(100.0, description="Search radius in kilometers")
    exclude_high_npa: bool = Field(True, description="Strictly hide or flag non-eligible / high-NPA partners")
