from enum import Enum
from fastapi import HTTPException, status

class Role(str, Enum):
    CITIZEN = "citizen"
    FACILITATOR = "facilitator"
    ADMIN = "admin"
    GUEST = "guest"

def require_role(user_role: str, allowed_roles: list[Role]):
    if user_role not in [r.value for r in allowed_roles]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Required role in {[r.value for r in allowed_roles]}, current role: {user_role}"
        )
