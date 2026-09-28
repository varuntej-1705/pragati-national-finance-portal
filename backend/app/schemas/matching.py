from typing import Optional, List, Any
from pydantic import BaseModel, Field
from app.schemas.scheme import SchemeResponse

class MatchCriteriaRequest(BaseModel):
    project_type: str = Field("business", description="e.g. business, education, agriculture, micro_enterprise")
    estimated_cost: float = Field(..., ge=1000, description="Estimated total cost of project or course in INR")
    annual_family_income: float = Field(..., ge=0, description="Annual family income in INR")
    category: str = Field("SC", description="Social category: SC, ST, OBC, General")
    education_status: Optional[str] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    age: Optional[int] = None
    citizen_id: Optional[str] = None

class RuleEvaluationItem(BaseModel):
    rule_field: str
    passed: bool
    expected_value: Any
    actual_value: Any
    message: str

class SchemeMatchItem(BaseModel):
    scheme: SchemeResponse
    confidence: str  # HIGH, MEDIUM, LOW
    match_score: float
    passed_rules: List[RuleEvaluationItem] = []
    unverified_rules: List[RuleEvaluationItem] = []
    failed_rules: List[RuleEvaluationItem] = []
    plain_language_explanation: str
    max_eligible_loan_amount: float
    concessional_interest_rate: float
    estimated_moratorium_months: int

class MatchResponse(BaseModel):
    total_matches: int
    top_matches: List[SchemeMatchItem]
    profile_summary: dict
