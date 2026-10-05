import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app.ai.smart_assistant import SmartVaultAssistant
from app.ai.ollama_gemma import OllamaGemmaProvider

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/assistant", tags=["assistant"])

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str
    sources: list[dict]

@router.post("/ask", response_model=AskResponse)
async def ask_assistant(req: AskRequest, db: Session = Depends(get_db)):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    assistant_engine = SmartVaultAssistant(db)

    # 1. Try local Ollama / Cloud Gemini LLM if active
    provider = OllamaGemmaProvider()
    health = await provider.check_health()
    if health.get("online"):
        try:
            # Build clean context for real LLM if running
            vault_info = assistant_engine.get_vault_summary()
            context_lines = []
            for d in vault_info["documents"]:
                context_lines.append(f"Document: {d['title']} ({d['doc_type']})")
                for k, v in d["facts"].items():
                    context_lines.append(f"  • {k}: {v}")
                for a in d["actions"]:
                    context_lines.append(f"  • Action: {a['title']} (Due: {a['due_date']}, Status: {a['status']})")
            context = "\n".join(context_lines)

            llm_ans = await provider.answer_question(context, question)
            if llm_ans and not llm_ans.startswith("Here is the verified data"):
                # Collect relevant document sources
                _, sources = assistant_engine.generate_response(question)
                return AskResponse(
                    answer=llm_ans,
                    sources=sources
                )
        except Exception as e:
            logger.warning(f"LLM call fallback: {e}")

    # 2. Smart local reasoning engine (Natural, conversational, deterministic fact-checking)
    answer, sources = assistant_engine.generate_response(question)

    return AskResponse(
        answer=answer,
        sources=sources
    )
