import os
import io
import logging
from pathlib import Path
from typing import Dict, Any, Tuple, List
from app.ai.ollama_gemma import OllamaGemmaProvider
from app.extraction.validator import validate_extraction
from app.extraction.ocr_engine import ocr_engine
from app.schemas import FactSchema

logger = logging.getLogger(__name__)

class DocumentExtractor:
    def __init__(self, ai_provider: OllamaGemmaProvider = None):
        self.ai_provider = ai_provider or OllamaGemmaProvider()
        self.ocr_engine = ocr_engine

    async def extract_raw_text(self, file_path: Path, file_type: str) -> Dict[str, Any]:
        """Runs multi-pass OCR and direct extraction pipeline."""
        return await self.ocr_engine.process_file(file_path, file_type)

    async def process_document(self, file_path: Path, file_type: str) -> Tuple[str, float, str, Dict[str, Any], List[FactSchema], List[str], str, Dict[str, Any]]:
        """
        Executes full extraction pipeline:
        1. Multi-pass OCR / text extraction with provenance & layout bounding boxes
        2. Classify document via Gemma / local heuristics
        3. Extract structured JSON via AI provider
        4. Validate extracted fields against Pydantic rules
        5. Map to facts with provenance metadata
        """
        ocr_result = await self.extract_raw_text(file_path, file_type)
        raw_text = ocr_result.get("text", "").strip()
        ocr_confidence = ocr_result.get("confidence", 0.90)

        if not raw_text:
            raw_text = f"Unreadable document content in {file_path.name}"

        # Classify
        classification = await self.ai_provider.classify_document(raw_text)
        doc_type = classification.get("doc_type", "unknown")
        cls_confidence = classification.get("confidence", 0.5)
        reason = classification.get("reason", "Automatic classification")

        # Blend OCR and classification confidence
        overall_confidence = round((ocr_confidence * 0.4) + (cls_confidence * 0.6), 3)

        # Extract structured JSON
        extracted_data = await self.ai_provider.extract_document(raw_text, doc_type)

        # Validate
        validation_issues = validate_extraction(doc_type, extracted_data)

        # Construct facts with provenance
        facts = []
        for field_name, value in extracted_data.items():
            if value is not None:
                facts.append(FactSchema(
                    field_name=field_name,
                    raw_value=str(value),
                    normalized_value=str(value),
                    confidence=overall_confidence,
                    user_confirmed=False,
                    source_page=1
                ))

        return doc_type, overall_confidence, reason, extracted_data, facts, validation_issues, raw_text, ocr_result

