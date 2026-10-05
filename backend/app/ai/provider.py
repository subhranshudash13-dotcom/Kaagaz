from abc import ABC, abstractmethod
from typing import Dict, Any

class AIProvider(ABC):

    @abstractmethod
    async def check_health(self) -> Dict[str, Any]:
        """Check if local LLM service is active and accessible."""
        pass

    @abstractmethod
    async def classify_document(self, text: str) -> Dict[str, Any]:
        """Classify document type from text content."""
        pass

    @abstractmethod
    async def extract_document(self, text: str, doc_type: str) -> Dict[str, Any]:
        """Extract structured JSON fields according to doc_type."""
        pass

    @abstractmethod
    async def answer_question(self, context: str, question: str) -> str:
        """Answer questions strictly over confirmed document context."""
        pass
