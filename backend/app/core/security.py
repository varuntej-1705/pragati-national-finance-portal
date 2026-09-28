from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

def create_access_token(
    subject: Union[str, Any],
    role: str = "citizen",
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "iss": "scheme-matcher-auth"
    }
    encoded_jwt = jwt.encode(to_encode, settings.SUPABASE_JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None
