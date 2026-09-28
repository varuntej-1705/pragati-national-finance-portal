import math
from typing import Dict, Any, List
from app.schemas.calculator import CalculatorRequest, CalculatorResponse, YearlyScheduleBreakdown

# NSFDC Default Parameters by Scheme Type
SCHEME_DEFAULTS = {
    "MICRO_FINANCE": {
        "max_limit": 140000.0,
        "base_rate": 5.5,
        "min_rate": 5.0,
        "max_rate": 6.0,
        "women_rebate": 0.5,
        "max_years": 3,
        "default_moratorium": 3
    },
    "TERM_LOAN": {
        "max_limit": 5000000.0,
        "base_rate": 7.5,
        "min_rate": 6.0,
        "max_rate": 9.5,
        "women_rebate": 0.5,
        "max_years": 10,
        "default_moratorium": 6
    },
    "EDUCATIONAL_LOAN": {
        "max_limit": 2000000.0,
        "base_rate": 4.5,
        "min_rate": 4.0,
        "max_rate": 6.5,
        "women_rebate": 0.5,
        "max_years": 10,
        "default_moratorium": 12
    },
    "SPECIAL_WOMEN_SHG": {
        "max_limit": 140000.0,
        "base_rate": 4.0,
        "min_rate": 4.0,
        "max_rate": 5.0,
        "women_rebate": 1.0,
        "max_years": 4,
        "default_moratorium": 3
    }
}

class CalculatorService:
    @staticmethod
    def calculate_emi(req: CalculatorRequest) -> CalculatorResponse:
        scheme_info = SCHEME_DEFAULTS.get(req.scheme_type, SCHEME_DEFAULTS["MICRO_FINANCE"])
        
        # Enforce or cap to scheme limit
        max_allowed = scheme_info["max_limit"]
        loan_amount = min(req.loan_amount, max_allowed)

        # Determine interest rate
        if req.custom_interest_rate is not None:
            interest_rate = req.custom_interest_rate
        else:
            interest_rate = scheme_info["base_rate"]
            if req.is_woman_beneficiary:
                interest_rate = max(scheme_info["min_rate"], interest_rate - scheme_info["women_rebate"])

        tenure_years = max(1, min(req.tenure_years, scheme_info["max_years"]))
        moratorium_months = max(0, min(req.moratorium_months, 24))

        # Monthly interest rate
        monthly_rate = (interest_rate / 100.0) / 12.0

        # Total repayment tenure in months
        repayment_months = tenure_years * 12

        # Moratorium interest calculation (Simple interest during gestation)
        moratorium_interest = round(loan_amount * (interest_rate / 100.0) * (moratorium_months / 12.0), 2)

        # Standard EMI amortization formula: P * r * (1+r)^n / ((1+r)^n - 1)
        if monthly_rate > 0 and repayment_months > 0:
            factor = math.pow(1.0 + monthly_rate, repayment_months)
            monthly_emi = round(loan_amount * monthly_rate * factor / (factor - 1.0), 2)
        else:
            monthly_emi = round(loan_amount / repayment_months, 2) if repayment_months > 0 else 0.0

        total_repayment = round((monthly_emi * repayment_months) + moratorium_interest, 2)
        total_interest = round(total_repayment - loan_amount, 2)

        # Yearly amortization schedule
        yearly_schedule: List[YearlyScheduleBreakdown] = []
        balance = loan_amount

        for year in range(1, tenure_years + 1):
            annual_principal = 0.0
            annual_interest = 0.0
            for _ in range(12):
                if balance <= 0:
                    break
                interest_month = balance * monthly_rate
                principal_month = min(balance, monthly_emi - interest_month)
                balance -= principal_month
                annual_principal += principal_month
                annual_interest += interest_month

            yearly_schedule.append(YearlyScheduleBreakdown(
                year=year,
                principal_paid=round(annual_principal, 2),
                interest_paid=round(annual_interest, 2),
                ending_balance=max(0.0, round(balance, 2))
            ))

        # Commercial loan comparison (Assuming 12.5% market rate)
        commercial_rate = 12.5
        commercial_monthly_rate = (commercial_rate / 100.0) / 12.0
        com_factor = math.pow(1.0 + commercial_monthly_rate, repayment_months)
        com_emi = (loan_amount * commercial_monthly_rate * com_factor) / (com_factor - 1.0)
        com_total_interest = (com_emi * repayment_months) - loan_amount
        interest_saved = max(0.0, round(com_total_interest - total_interest, 2))

        return CalculatorResponse(
            loan_amount=loan_amount,
            applied_interest_rate=interest_rate,
            tenure_years=tenure_years,
            moratorium_months=moratorium_months,
            monthly_emi_during_repayment=monthly_emi,
            interest_during_moratorium=moratorium_interest,
            total_interest_paid=total_interest,
            total_repayment_amount=total_repayment,
            yearly_schedule=yearly_schedule,
            max_limit_allowed=max_allowed,
            interest_saved_compared_to_commercial=interest_saved
        )
