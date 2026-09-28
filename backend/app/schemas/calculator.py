from typing import Optional, List
from pydantic import BaseModel, Field

class CalculatorRequest(BaseModel):
    scheme_type: str = Field(..., description="MICRO_FINANCE, TERM_LOAN, EDUCATIONAL_LOAN, SPECIAL_WOMEN_SHG")
    loan_amount: float = Field(..., gt=0, description="Principal loan amount in INR")
    tenure_years: int = Field(3, ge=1, le=15, description="Repayment duration in years")
    moratorium_months: int = Field(3, ge=0, le=24, description="Moratorium period in months")
    is_woman_beneficiary: bool = False
    custom_interest_rate: Optional[float] = None

class YearlyScheduleBreakdown(BaseModel):
    year: int
    principal_paid: float
    interest_paid: float
    ending_balance: float

class CalculatorResponse(BaseModel):
    loan_amount: float
    applied_interest_rate: float
    tenure_years: int
    moratorium_months: int
    monthly_emi_during_repayment: float
    interest_during_moratorium: float
    total_interest_paid: float
    total_repayment_amount: float
    yearly_schedule: List[YearlyScheduleBreakdown] = []
    max_limit_allowed: float
    interest_saved_compared_to_commercial: float
