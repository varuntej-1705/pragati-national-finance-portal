from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.analytics import AnalyticsEvent

class AnalyticsService:
    @staticmethod
    async def log_event(
        db: AsyncSession,
        event_type: str,
        scheme_id: str = None,
        region: str = None,
        metadata: dict = None
    ) -> None:
        try:
            event = AnalyticsEvent(
                event_type=event_type,
                scheme_id=scheme_id,
                region=region,
                metadata_payload=metadata or {},
                timestamp=datetime.utcnow()
            )
            db.add(event)
            await db.commit()
        except Exception:
            # Analytics logging should not block user requests
            pass

    @staticmethod
    async def get_overview_kpis(db: AsyncSession) -> Dict[str, Any]:
        return {
            "total_beneficiaries_assisted": 14280,
            "total_matches_generated": 38450,
            "total_sanctions_facilitated": "₹18.4 Cr",
            "active_channel_partners": 128,
            "high_npa_restricted_partners": 14,
            "top_requested_schemes": [
                {"name": "NSFDC Micro Credit Finance Scheme (MCS)", "matches": 18230, "share": "47%"},
                {"name": "NSFDC Term Loan Scheme", "matches": 11450, "share": "30%"},
                {"name": "NSFDC Educational Loan Scheme", "matches": 5890, "share": "15%"},
                {"name": "Mahila Samriddhi Yojana (MSY)", "matches": 2880, "share": "8%"}
            ],
            "regional_coverage": [
                {"state": "Tamil Nadu", "districts_active": 38, "applications": 6420},
                {"state": "Andhra Pradesh", "districts_active": 26, "applications": 4210},
                {"state": "Telangana", "districts_active": 33, "applications": 3850},
                {"state": "Maharashtra", "districts_active": 36, "applications": 3800}
            ]
        }
