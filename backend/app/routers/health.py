from fastapi import APIRouter
from app.schemas.schemas import APIResponse

router = APIRouter()

@router.get("/health", response_model=APIResponse)
async def health_check():
    return APIResponse(
        success=True,
        message="GenAI Stack API is healthy",
        data={"status": "ok", "version": "1.0.0"}
    )