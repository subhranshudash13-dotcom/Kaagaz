import pytest
from app.ai.ollama_gemma import OllamaGemmaProvider

@pytest.mark.asyncio
async def test_ai_provider_classification_and_extraction():
    provider = OllamaGemmaProvider()
    
    # Check health
    health = await provider.check_health()
    assert "online" in health

    sample_bill_text = """State Electricity Board
    Consumer No: 109283
    Due Date: 2026-10-15
    Amount Due: ₹2481.00
    """
    
    # Classification test
    res = await provider.classify_document(sample_bill_text)
    assert res["doc_type"] == "electricity_bill"
    assert res["confidence"] > 0.0

    # Extraction test
    ext_res = await provider.extract_document(sample_bill_text, "electricity_bill")
    assert ext_res.get("amount_due") == 2481.00 or ext_res.get("due_date") == "2026-10-15"
