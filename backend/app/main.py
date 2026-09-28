from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router
from app.db.database import Base
from app.db.session import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize tables on startup if using SQLite / direct DB
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Database init warning (can use Supabase or external Postgres): {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AI-Driven Scheme Matching for Marginalized Entrepreneurs (SIH 2026 PS 26092)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to AI-Driven Scheme Matcher API (SIH 2026 PS 26092)",
        "docs": "/docs",
        "health": "/health"
    }
