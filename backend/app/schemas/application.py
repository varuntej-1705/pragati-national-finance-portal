from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class ApplicationStatusBase(BaseModel):
    citizen_id: str
    scheme_id: str
    channel_partner_id: Optional[str] = None
    status: str = "NOT_STARTED"
    notes: Optional[str] = None

class ApplicationStatusCreate(ApplicationStatusBase):
    pass

class ApplicationStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    channel_partner_id: Optional[str] = None

class ApplicationStatusResponse(ApplicationStatusBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
