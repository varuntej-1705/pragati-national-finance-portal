from typing import Dict, Any, List

class ConfidenceEngine:
    """
    Computes match confidence score and status:
    - HIGH: "Likely eligible" (Green) - all criteria passed, no unverified mandatory rules
    - MEDIUM: "Maybe eligible - verify criteria X" (Amber) - basic criteria met, some unverified fields
    - LOW: Ineligible (Red) - mandatory criteria failed
    """

    @staticmethod
    def calculate_confidence(evaluation: Dict[str, Any]) -> Dict[str, Any]:
        passed_rules: List[dict] = evaluation.get("passed_rules", [])
        unverified_rules: List[dict] = evaluation.get("unverified_rules", [])
        failed_rules: List[dict] = evaluation.get("failed_rules", [])

        if failed_rules:
            return {
                "confidence": "LOW",
                "label": "Ineligible",
                "match_score": 0.0,
                "needs_verification": False
            }

        total_rules = len(passed_rules) + len(unverified_rules)
        if total_rules == 0:
            score = 100.0
        else:
            score = round((len(passed_rules) / total_rules) * 100.0, 1)

        if len(unverified_rules) == 0 and score >= 90.0:
            return {
                "confidence": "HIGH",
                "label": "Likely eligible",
                "match_score": score,
                "needs_verification": False
            }
        else:
            return {
                "confidence": "MEDIUM",
                "label": "Maybe eligible",
                "match_score": score,
                "needs_verification": True
            }
