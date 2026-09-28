from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel

class EligibilityRuleSchema(BaseModel):
    id: Optional[str] = None
    field_name: str
    operator: str
    rule_value: Any
    is_mandatory: bool = True
    description: Optional[str] = None

    class Config:
        from_attributes = True

class SchemeBase(BaseModel):
    code: str
    name: str
    ministry: str
    implementing_agency: str
    scheme_type: str
    max_loan_amount: float
    max_coverage_percent: float = 90.0
    interest_rate_min: float
    interest_rate_max: float
    women_rebate_percent: float = 0.5
    moratorium_months_min: int = 3
    moratorium_months_max: int = 12
    max_repayment_years: int = 5
    income_ceiling: float = 500000.0
    target_audience: Optional[str] = None
    brief_description: str
    detailed_benefits: List[str] = []
    required_documents: List[str] = []
    application_procedure: List[str] = []
    official_portal_url: Optional[str] = None
    is_active: bool = True

class SchemeCreate(SchemeBase):
    rules: List[EligibilityRuleSchema] = []

class SchemeResponse(SchemeBase):
    id: str
    last_synced_at: Optional[datetime] = None
    rules: List[EligibilityRuleSchema] = []

    class Config:
        from_attributes = True
