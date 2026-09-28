from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class CitizenBase(BaseModel):
    phone: str
    role: str = "citizen"
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    category: Optional[str] = "SC"
    annual_family_income: float = Field(..., ge=0)
    education_status: Optional[str] = None
    occupation: Optional[str] = None
    state: str
    district: str
    pincode: Optional[str] = None
    disability_status: Optional[bool] = False
    language_pref: Optional[str] = "en"

class CitizenCreate(CitizenBase):
    pass

class CitizenUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    category: Optional[str] = None
    annual_family_income: Optional[float] = None
    education_status: Optional[str] = None
    occupation: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    disability_status: Optional[bool] = None
    language_pref: Optional[str] = None

class CitizenResponse(CitizenBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
