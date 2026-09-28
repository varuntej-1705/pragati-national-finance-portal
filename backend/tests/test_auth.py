import pytest
from app.core.security import create_access_token, decode_token
from app.services.auth_service import AuthService

def test_jwt_generation_and_decoding():
    token = create_access_token(subject="user-123", role="citizen")
    payload = decode_token(token)
    assert payload is not None
    assert payload.get("sub") == "user-123"
    assert payload.get("role") == "citizen"

@pytest.mark.asyncio
async def test_auth_service_guest():
    session = AuthService.create_guest_session()
    assert session.is_guest is True
    assert session.role == "guest"
    payload = decode_token(session.access_token)
    assert payload.get("role") == "guest"
