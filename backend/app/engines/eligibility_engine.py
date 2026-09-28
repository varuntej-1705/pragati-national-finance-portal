from typing import Dict, Any, List, Tuple

class EligibilityEngine:
    """
    Deterministic rule-based eligibility evaluation engine.
    Ensures that eligibility verdicts are mathematically and legally sound,
    independent of any LLM.
    """

    @staticmethod
    def evaluate_rule(field_name: str, operator: str, rule_value: Any, profile_data: Dict[str, Any]) -> Tuple[bool, bool, str]:
        """
        Returns: (passed: bool, is_evaluated: bool, message: str)
        If field is missing from profile_data, is_evaluated is False.
        """
        # Map camelCase to snake_case if necessary
        key_variations = [
            field_name,
            "".join(["_" + c.lower() if c.isupper() else c for c in field_name]).lstrip("_")
        ]
        
        actual_value = None
        found = False
        for k in key_variations:
            if k in profile_data and profile_data[k] is not None:
                actual_value = profile_data[k]
                found = True
                break

        if not found:
            return (False, False, f"Criterion '{field_name}' not provided in profile.")

        try:
            if operator == "<=":
                passed = float(actual_value) <= float(rule_value)
                msg = f"{field_name} (₹{actual_value:,.0f}) is within required limit (₹{rule_value:,.0f})" if passed else f"{field_name} (₹{actual_value:,.0f}) exceeds limit of ₹{rule_value:,.0f}"
                return (passed, True, msg)

            elif operator == ">=":
                passed = float(actual_value) >= float(rule_value)
                msg = f"{field_name} meets minimum requirement" if passed else f"{field_name} is below required threshold"
                return (passed, True, msg)

            elif operator == "==":
                passed = str(actual_value).strip().upper() == str(rule_value).strip().upper()
                msg = f"{field_name} matches requirement ({actual_value})" if passed else f"{field_name} ({actual_value}) does not match required ({rule_value})"
                return (passed, True, msg)

            elif operator == "!=":
                passed = str(actual_value).strip().upper() != str(rule_value).strip().upper()
                return (passed, True, "Criterion satisfied")

            elif operator == "IN":
                if isinstance(rule_value, list):
                    values = [str(v).strip().lower() for v in rule_value]
                    passed = str(actual_value).strip().lower() in values
                else:
                    passed = str(actual_value).strip().lower() == str(rule_value).strip().lower()
                msg = f"{field_name} aligns with eligible categories" if passed else f"{field_name} is not in eligible group"
                return (passed, True, msg)

            elif operator == "CONTAINS":
                passed = str(rule_value).lower() in str(actual_value).lower()
                return (passed, True, "Criterion satisfied" if passed else "Criterion not satisfied")

            return (False, False, f"Unsupported operator: {operator}")
        except Exception as e:
            return (False, False, f"Evaluation error: {str(e)}")

    @classmethod
    def evaluate_scheme(cls, scheme: Any, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates all rules for a scheme against the citizen profile.
        """
        passed_rules = []
        unverified_rules = []
        failed_rules = []

        # 1. Base check: Annual Family Income must be <= ₹5,00,000 for NSFDC
        income = profile_data.get("annual_family_income") or profile_data.get("annualFamilyIncome") or 0.0
        income_ceiling = getattr(scheme, "income_ceiling", 500000.0)
        if income > income_ceiling:
            failed_rules.append({
                "rule_field": "annual_family_income",
                "passed": False,
                "expected_value": income_ceiling,
                "actual_value": income,
                "message": f"Annual family income (₹{income:,.0f}) exceeds the statutory limit of ₹{income_ceiling:,.0f}."
            })

        # 2. Base check: Social category must be SC
        category = profile_data.get("category", "").upper()
        if category and category != "SC":
            failed_rules.append({
                "rule_field": "category",
                "passed": False,
                "expected_value": "SC",
                "actual_value": category,
                "message": "Scheme is specifically earmarked for Scheduled Caste (SC) beneficiaries."
            })
        elif not category:
            unverified_rules.append({
                "rule_field": "category",
                "passed": False,
                "expected_value": "SC",
                "actual_value": None,
                "message": "Category not verified. Requires proof of Scheduled Caste status."
            })
        else:
            passed_rules.append({
                "rule_field": "category",
                "passed": True,
                "expected_value": "SC",
                "actual_value": category,
                "message": "Eligible Scheduled Caste (SC) category confirmed."
            })

        # 3. Dynamic rules from database / scheme model
        rules = getattr(scheme, "rules", []) or []
        for r in rules:
            field_name = getattr(r, "field_name", r.get("field_name") if isinstance(r, dict) else "")
            operator = getattr(r, "operator", r.get("operator") if isinstance(r, dict) else "")
            rule_value = getattr(r, "rule_value", r.get("rule_value") if isinstance(r, dict) else "")
            is_mandatory = getattr(r, "is_mandatory", r.get("is_mandatory", True) if isinstance(r, dict) else True)

            # Skip duplicate category / income checks already done above
            if field_name in ["category", "annualFamilyIncome", "annual_family_income"]:
                continue

            passed, evaluated, msg = cls.evaluate_rule(field_name, operator, rule_value, profile_data)
            rule_item = {
                "rule_field": field_name,
                "passed": passed,
                "expected_value": rule_value,
                "actual_value": profile_data.get(field_name),
                "message": msg
            }

            if not evaluated:
                if is_mandatory:
                    unverified_rules.append(rule_item)
                else:
                    passed_rules.append(rule_item)
            elif passed:
                passed_rules.append(rule_item)
            else:
                if is_mandatory:
                    failed_rules.append(rule_item)
                else:
                    unverified_rules.append(rule_item)

        is_structurally_eligible = len(failed_rules) == 0

        return {
            "is_eligible": is_structurally_eligible,
            "passed_rules": passed_rules,
            "unverified_rules": unverified_rules,
            "failed_rules": failed_rules
        }
