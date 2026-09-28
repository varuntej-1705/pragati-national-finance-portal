from typing import Dict, Any, List
from app.ai.retrieval import SchemeRetrieval
from app.services.scheme_service import SchemeService
from sqlalchemy.ext.asyncio import AsyncSession

class ChatAssistant:
    """
    Multilingual conversational assistant grounded strictly in verified NSFDC database schemes.
    """

    @classmethod
    async def process_query(cls, query: str, language: str, db: AsyncSession) -> Dict[str, Any]:
        all_schemes = await SchemeService.get_all_schemes(db)
        retrieved_schemes = SchemeRetrieval.search_schemes(query, all_schemes, top_k=2)

        if not retrieved_schemes:
            if language == "hi":
                answer = "कृपया अपने प्रश्न के बारे में और विवरण दें (जैसे व्यापार ऋण, शिक्षा ऋण, या महिला स्वयं सहायता समूह योजना)।"
            else:
                answer = "Could you please specify your requirement (such as micro business loan, term loan for machinery, or educational assistance)?"
            return {
                "answer": answer,
                "referenced_schemes": []
            }

        primary = retrieved_schemes[0]
        name = getattr(primary, "name", primary.get("name") if isinstance(primary, dict) else "")
        max_loan = getattr(primary, "max_loan_amount", primary.get("maxLoanAmount", primary.get("max_loan_amount")) if isinstance(primary, dict) else 0)
        min_rate = getattr(primary, "interest_rate_min", primary.get("interestRateMin", primary.get("interest_rate_min")) if isinstance(primary, dict) else 5.0)

        if language == "hi":
            answer = f"आपकी आवश्यकता के लिए '{name}' उपयुक्त विकल्प है। इसमें ₹{max_loan:,.0f} तक की वित्तीय सहायता {min_rate}% प्रति वर्ष की रियायती ब्याज दर पर उपलब्ध है।"
        else:
            answer = f"Based on verified NSFDC guidelines, '{name}' is suitable for your query. It offers concessional funding up to ₹{max_loan:,.0f} at an interest rate starting from {min_rate}% p.a."

        return {
            "answer": answer,
            "referenced_schemes": [
                {
                    "id": getattr(s, "id", s.get("id") if isinstance(s, dict) else ""),
                    "name": getattr(s, "name", s.get("name") if isinstance(s, dict) else "")
                } for s in retrieved_schemes
            ]
        }
