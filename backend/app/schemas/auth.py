from typing import Optional
from pydantic import BaseModel, Field

class PhoneOtpRequest(BaseModel):
    phone: str = Field(..., description="10-digit mobile number, e.g. 9876543210")

class PhoneOtpVerify(BaseModel):
    phone: str
    otp: str = Field(..., min_length=4, max_length=6)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    is_guest: bool = False
