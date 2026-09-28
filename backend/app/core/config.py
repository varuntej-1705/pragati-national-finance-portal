import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Driven Scheme Matcher (SIH 2026 PS 26092)"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:19006",
        "*"
    ]

    # Database: Async Postgres (Supabase or local) with fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./scheme_matcher.db"
    )
    DIRECT_DATABASE_URL: str = os.getenv(
        "DIRECT_DATABASE_URL",
        "sqlite:///./scheme_matcher.db"
    )

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Supabase Auth & Config
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "sih2026-super-secret-jwt-key-replace-in-prod")

    # AI / LLM
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Maps
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")

    # Business Constraints (NSFDC specific)
    NSFDC_INCOME_CEILING: float = 500000.0  # ₹5 Lakhs annual family income
    DEFAULT_COMMERCIAL_RATE: float = 12.5   # Comparative market loan interest rate

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()
