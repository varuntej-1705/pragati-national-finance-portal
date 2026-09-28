from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import PhoneOtpRequest, PhoneOtpVerify, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/otp/request")
async def request_otp(body: PhoneOtpRequest):
    return await AuthService.request_otp(body.phone)

@router.post("/otp/verify", response_model=TokenResponse)
async def verify_otp(body: PhoneOtpVerify):
    return await AuthService.verify_otp_and_login(body.phone, body.otp)

@router.post("/guest", response_model=TokenResponse)
async def create_guest_session():
    return AuthService.create_guest_session()
