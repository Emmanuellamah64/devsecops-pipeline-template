from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint — used by Docker HEALTHCHECK and pipeline DAST."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat(),
    )
