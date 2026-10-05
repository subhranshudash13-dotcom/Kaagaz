from fastapi import APIRouter
from app.schemas import HealthResponse
from app.ai.ollama_gemma import OllamaGemmaProvider

router = APIRouter(prefix="/api", tags=["health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    provider = OllamaGemmaProvider()
    ai_health = await provider.check_health()
    
    return HealthResponse(
        status="ok",
        service="kaagaz-backend",
        ollama_status="online" if ai_health.get("online") else "offline",
        ollama_model=ai_health.get("configured_model")
    )
