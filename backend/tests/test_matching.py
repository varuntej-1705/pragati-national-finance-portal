import pytest
from app.engines.eligibility_engine import EligibilityEngine
from app.engines.confidence_engine import ConfidenceEngine

def test_eligibility_engine_sc_pass():
    profile = {
        "annual_family_income": 250000.0,
        "category": "SC",
        "estimatedCost": 120000.0
    }
    scheme = {
        "income_ceiling": 500000.0,
        "rules": [
            {"field_name": "category", "operator": "==", "rule_value": "SC", "is_mandatory": True},
            {"field_name": "annualFamilyIncome", "operator": "<=", "rule_value": 500000, "is_mandatory": True}
        ]
    }
    result = EligibilityEngine.evaluate_scheme(scheme, profile)
    assert result["is_eligible"] is True
    assert len(result["failed_rules"]) == 0

def test_eligibility_engine_income_fail():
    profile = {
        "annual_family_income": 650000.0,  # Exceeds 5 Lakh ceiling
        "category": "SC"
    }
    scheme = {
        "income_ceiling": 500000.0,
        "rules": []
    }
    result = EligibilityEngine.evaluate_scheme(scheme, profile)
    assert result["is_eligible"] is False
    assert len(result["failed_rules"]) > 0

def test_confidence_engine():
    eval_high = {
        "passed_rules": [{"message": "Category match"}, {"message": "Income match"}],
        "unverified_rules": [],
        "failed_rules": []
    }
    conf_high = ConfidenceEngine.calculate_confidence(eval_high)
    assert conf_high["confidence"] == "HIGH"
    assert conf_high["label"] == "Likely eligible"

    eval_medium = {
        "passed_rules": [{"message": "Income match"}],
        "unverified_rules": [{"message": "Missing caste cert"}],
        "failed_rules": []
    }
    conf_med = ConfidenceEngine.calculate_confidence(eval_medium)
    assert conf_med["confidence"] == "MEDIUM"
    assert conf_med["label"] == "Maybe eligible"
