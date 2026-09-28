from typing import Dict, Any, List

class ExplanationGenerator:
    """
    Generates plain-language 'Why You Qualify' explanations.
    Strictly grounded in evaluated rules to ensure zero hallucination.
    """

    @classmethod
    def generate_explanation(
        cls,
        scheme_name: str,
        confidence: str,
        passed_rules: List[Dict[str, Any]],
        unverified_rules: List[Dict[str, Any]],
        estimated_cost: float,
        concessional_rate: float,
        moratorium_months: int,
        language: str = "en"
    ) -> str:
        passed_msgs = [r["message"] for r in passed_rules if r.get("message")]
        unverified_msgs = [r["message"] for r in unverified_rules if r.get("message")]

        if language == "hi":
            # Hindi explanation template
            if confidence == "HIGH":
                exp = f"आप {scheme_name} के लिए पात्र हैं। "
                if passed_msgs:
                    exp += "सत्यापित मानदंड: " + "; ".join(passed_msgs[:3]) + "। "
                exp += f"इस योजना में {concessional_rate}% की रियायती ब्याज दर और {moratorium_months} महीने की अधिस्थगन (मोराटोरियम) अवधि शामिल है।"
                return exp
            else:
                exp = f"आप {scheme_name} के लिए संभावित रूप से पात्र हो सकते हैं। "
                if unverified_msgs:
                    exp += "सत्यापन की आवश्यकता: " + "; ".join(unverified_msgs[:2]) + "।"
                return exp

        # English (Default)
        if confidence == "HIGH":
            exp = f"You are strongly matched for {scheme_name}. "
            if passed_msgs:
                exp += "Key verified criteria: " + "; ".join(passed_msgs[:3]) + ". "
            exp += f"This scheme offers a concessional interest rate of {concessional_rate}% p.a. with a {moratorium_months}-month initial moratorium on repayments."
            return exp
        elif confidence == "MEDIUM":
            exp = f"You may be eligible for {scheme_name}, but some documents require verification. "
            if unverified_msgs:
                exp += "Action needed: " + "; ".join(unverified_msgs[:2]) + ". "
            if passed_msgs:
                exp += "Criteria already met: " + "; ".join(passed_msgs[:2]) + "."
            return exp
        else:
            return f"You currently do not meet the core statutory criteria for {scheme_name}."
