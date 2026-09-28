from typing import Optional, AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import decode_token
from app.core.permissions import Role, require_role
from app.db.session import get_db

security_scheme = HTTPBearer(auto_error=False)

async def get_current_user_payload(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Optional[dict]:
    if not credentials:
        return None
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )
    return payload

async def require_authenticated_user(
    payload: Optional[dict] = Depends(get_current_user_payload)
) -> dict:
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return payload

def require_roles(allowed_roles: list[Role]):
    def role_checker(payload: dict = Depends(require_authenticated_user)):
        user_role = payload.get("role", "citizen")
        require_role(user_role, allowed_roles)
        return payload
    return role_checker
