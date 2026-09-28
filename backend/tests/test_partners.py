import pytest
from app.engines.partner_routing_engine import PartnerRoutingEngine

def test_haversine_distance():
    # Chennai to Vijayawada is approx 380 - 450 km
    chennai_lat, chennai_lon = 13.0827, 80.2707
    vijayawada_lat, vijayawada_lon = 16.5062, 80.6480
    dist = PartnerRoutingEngine.haversine_distance(chennai_lat, chennai_lon, vijayawada_lat, vijayawada_lon)
    assert 350 < dist < 450

def test_partner_npa_filter():
    partners = [
        {
            "id": "p1",
            "name": "Good Bank",
            "npa_status": "ELIGIBLE",
            "fund_utilisation_score": 95,
            "npa_ratio_percent": 2.5,
            "is_active": True,
            "latitude": 13.0,
            "longitude": 80.0
        },
        {
            "id": "p2",
            "name": "Bad Bank",
            "npa_status": "HIGH_NPA_BLOCKED",
            "fund_utilisation_score": 20,
            "npa_ratio_percent": 19.5,
            "is_active": False,
            "latitude": 13.0,
            "longitude": 80.0
        }
    ]

    filtered = PartnerRoutingEngine.filter_and_rank_partners(
        partners=partners,
        user_lat=13.0,
        user_lon=80.0,
        exclude_high_npa=True
    )
    assert len(filtered) == 1
    assert filtered[0]["partner"]["id"] == "p1"
