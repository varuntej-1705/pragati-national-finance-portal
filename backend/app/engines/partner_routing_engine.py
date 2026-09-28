import math
from typing import List, Dict, Any, Optional

class PartnerRoutingEngine:
    """
    Geo-spatial partner discovery and intelligent routing engine.
    Filters by:
    1. Distance (Haversine formula)
    2. Eligible scheme categories
    3. Fund-utilisation & NPA standing (strictly preventing routing to blocked or bad debt partners)
    """

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates great-circle distance between two points on the Earth in kilometers.
        """
        R = 6371.0  # Earth's radius in kilometers

        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2.0) ** 2 + \
            math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2

        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        distance = R * c
        return round(distance, 2)

    @classmethod
    def filter_and_rank_partners(
        cls,
        partners: List[Any],
        user_lat: Optional[float] = None,
        user_lon: Optional[float] = None,
        scheme_type: Optional[str] = None,
        district: Optional[str] = None,
        state: Optional[str] = None,
        max_distance_km: float = 150.0,
        exclude_high_npa: bool = True
    ) -> List[Dict[str, Any]]:
        results = []

        for p in partners:
            # Check NPA status
            npa_status = getattr(p, "npa_status", p.get("npa_status") if isinstance(p, dict) else "ELIGIBLE")
            is_active = getattr(p, "is_active", p.get("is_active", True) if isinstance(p, dict) else True)

            if exclude_high_npa and (npa_status == "HIGH_NPA_BLOCKED" or not is_active):
                continue

            # Check scheme type capability
            eligible_types = getattr(p, "eligible_scheme_types", p.get("eligible_scheme_types", []) if isinstance(p, dict) else [])
            if scheme_type and scheme_type not in eligible_types:
                continue

            # Calculate distance if coords are present
            p_lat = getattr(p, "latitude", p.get("latitude") if isinstance(p, dict) else None)
            p_lon = getattr(p, "longitude", p.get("longitude") if isinstance(p, dict) else None)
            
            distance = None
            if user_lat is not None and user_lon is not None and p_lat is not None and p_lon is not None:
                distance = cls.haversine_distance(user_lat, user_lon, p_lat, p_lon)
                if distance > max_distance_km and not (district and district.lower() in str(getattr(p, "district", "")).lower()):
                    continue

            # Location match score
            partner_district = str(getattr(p, "district", p.get("district", "") if isinstance(p, dict) else "")).lower()
            partner_state = str(getattr(p, "state", p.get("state", "") if isinstance(p, dict) else "")).lower()

            is_district_match = bool(district and district.lower() == partner_district)
            is_state_match = bool(state and state.lower() == partner_state)

            fund_score = getattr(p, "fund_utilisation_score", p.get("fund_utilisation_score", 80) if isinstance(p, dict) else 80)
            npa_ratio = getattr(p, "npa_ratio_percent", p.get("npa_ratio_percent", 5.0) if isinstance(p, dict) else 5.0)

            results.append({
                "partner": p,
                "distance_km": distance,
                "is_district_match": is_district_match,
                "is_state_match": is_state_match,
                "fund_utilisation_score": fund_score,
                "npa_ratio_percent": npa_ratio,
                "npa_status": npa_status
            })

        # Sort priority:
        # 1. District match / Distance
        # 2. Fund utilisation score (higher is better)
        # 3. NPA ratio (lower is better)
        def sort_key(item):
            d = item["distance_km"] if item["distance_km"] is not None else (0 if item["is_district_match"] else 9999)
            return (
                0 if item["is_district_match"] else 1,
                d,
                -item["fund_utilisation_score"],
                item["npa_ratio_percent"]
            )

        ranked = sorted(results, key=sort_key)
        return ranked
