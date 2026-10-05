from typing import Dict, Any
from app.ai.ollama_gemma import OllamaGemmaProvider

class DocumentClassifier:
    def __init__(self, ai_provider: OllamaGemmaProvider = None):
        self.ai_provider = ai_provider or OllamaGemmaProvider()

    async def classify(self, text: str) -> Dict[str, Any]:
        """Classifies text into electricity_bill, warranty, notice, or unknown."""
        return await self.ai_provider.classify_document(text)
