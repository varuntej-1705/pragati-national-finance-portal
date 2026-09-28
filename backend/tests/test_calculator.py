import pytest
from app.services.calculator_service import CalculatorService
from app.schemas.calculator import CalculatorRequest

def test_calculator_micro_finance():
    req = CalculatorRequest(
        scheme_type="MICRO_FINANCE",
        loan_amount=100000.0,
        tenure_years=3,
        moratorium_months=3,
        is_woman_beneficiary=False
    )
    res = CalculatorService.calculate_emi(req)
    assert res.loan_amount == 100000.0
    assert res.applied_interest_rate == 5.5
    assert res.monthly_emi_during_repayment > 0
    assert res.interest_saved_compared_to_commercial > 0
    assert len(res.yearly_schedule) == 3

def test_calculator_women_rebate():
    req_general = CalculatorRequest(
        scheme_type="TERM_LOAN",
        loan_amount=500000.0,
        tenure_years=5,
        moratorium_months=6,
        is_woman_beneficiary=False
    )
    res_general = CalculatorService.calculate_emi(req_general)

    req_woman = CalculatorRequest(
        scheme_type="TERM_LOAN",
        loan_amount=500000.0,
        tenure_years=5,
        moratorium_months=6,
        is_woman_beneficiary=True
    )
    res_woman = CalculatorService.calculate_emi(req_woman)

    assert res_woman.applied_interest_rate < res_general.applied_interest_rate
    assert res_woman.monthly_emi_during_repayment < res_general.monthly_emi_during_repayment

def test_calculator_cap_enforcement():
    # Micro finance cap is 1,40,000
    req = CalculatorRequest(
        scheme_type="MICRO_FINANCE",
        loan_amount=250000.0,
        tenure_years=3,
        moratorium_months=3
    )
    res = CalculatorService.calculate_emi(req)
    assert res.loan_amount == 140000.0  # Capped at scheme max limit
