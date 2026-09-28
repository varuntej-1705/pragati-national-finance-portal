from fastapi import APIRouter
from app.schemas.calculator import CalculatorRequest, CalculatorResponse
from app.services.calculator_service import CalculatorService

router = APIRouter(prefix="/calculator", tags=["Financial Calculator"])

@router.post("/calculate", response_model=CalculatorResponse)
async def calculate_emi(body: CalculatorRequest):
    return CalculatorService.calculate_emi(body)
