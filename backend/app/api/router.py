from fastapi import APIRouter
from app.api.v1 import (
    auth,
    citizens,
    schemes,
    matching,
    calculator,
    partners,
    applications,
    documents,
    chat,
    admin
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(citizens.router)
api_router.include_router(schemes.router)
api_router.include_router(matching.router)
api_router.include_router(calculator.router)
api_router.include_router(partners.router)
api_router.include_router(applications.router)
api_router.include_router(documents.router)
api_router.include_router(chat.router)
api_router.include_router(admin.router)
