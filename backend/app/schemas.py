from pydantic import BaseModel
from typing import Optional, List, Any, Dict

class HealthResponse(BaseModel):
    status: str
    service: str
    ollama_status: Optional[str] = None
    ollama_model: Optional[str] = None

class FactSchema(BaseModel):
    field_name: str
    raw_value: Optional[str] = None
    normalized_value: Optional[str] = None
    confidence: float = 1.0
    user_confirmed: bool = False
    source_page: int = 1

class ProvisionalExtractionResponse(BaseModel):
    document_id: str
    workflow_id: Optional[str] = None
    original_filename: str
    title: Optional[str] = None
    doc_type: str
    confidence: float
    reason: str
    status: str  # provisional
    extracted_data: Dict[str, Any]
    facts: List[FactSchema]
    validation_issues: List[str]
    raw_text: Optional[str] = None
    trace: Optional[Dict[str, Any]] = None
    workflow_state: Optional[Dict[str, Any]] = None
    official_portal: Optional[Dict[str, Any]] = None
