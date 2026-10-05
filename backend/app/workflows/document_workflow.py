"""
Temporal-inspired Durable Document Workflow Engine for Kaagaz.

Handles resilient state transitions, isolated stage retries, idempotent step execution,
and human-in-the-loop review pauses without losing extracted state or requiring re-upload.
"""

import time
import json
from enum import Enum
from typing import Dict, Any, Optional, List, Callable
from dataclasses import dataclass, field, asdict

class WorkflowStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    WAITING_FOR_HUMAN = "WAITING_FOR_HUMAN"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class WorkflowStage(str, Enum):
    STORE_DOCUMENT = "STORE_DOCUMENT"
    EXTRACT_TEXT = "EXTRACT_TEXT"
    CLASSIFY_DOCUMENT = "CLASSIFY_DOCUMENT"
    GEMMA_EXTRACTION = "GEMMA_EXTRACTION"
    VALIDATE_SCHEMA = "VALIDATE_SCHEMA"
    HUMAN_CONFIRMATION = "HUMAN_CONFIRMATION"
    PERSIST_FACTS = "PERSIST_FACTS"
    GENERATE_ACTIONS = "GENERATE_ACTIONS"
    GENERATE_CALENDAR = "GENERATE_CALENDAR"
    UPDATE_INSIGHTS = "UPDATE_INSIGHTS"

@dataclass
class WorkflowStepResult:
    stage: str
    status: str
    duration_ms: float
    output: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    retries: int = 0

@dataclass
class WorkflowExecutionState:
    workflow_id: str
    document_id: str
    current_stage: str
    status: WorkflowStatus
    created_at: float
    updated_at: float
    steps: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

# In-memory durable state store (simulating Temporal activity history)
WORKFLOW_REGISTRY: Dict[str, WorkflowExecutionState] = {}

class KaagazDocumentWorkflow:
    """
    Orchestrates the lifecycle of a document ingestion pipeline with durable checkpoints.
    """

    def __init__(self, workflow_id: str, document_id: str):
        self.workflow_id = workflow_id
        self.document_id = document_id
        
        if workflow_id in WORKFLOW_REGISTRY:
            self.state = WORKFLOW_REGISTRY[workflow_id]
        else:
            self.state = WorkflowExecutionState(
                workflow_id=workflow_id,
                document_id=document_id,
                current_stage=WorkflowStage.STORE_DOCUMENT.value,
                status=WorkflowStatus.PENDING,
                created_at=time.time(),
                updated_at=time.time()
            )
            WORKFLOW_REGISTRY[workflow_id] = self.state

    def execute_activity(
        self,
        stage: WorkflowStage,
        activity_fn: Callable[[], Any],
        max_retries: int = 3
    ) -> Any:
        """
        Executes a workflow activity idempotently. If already completed, returns cached result.
        """
        stage_key = stage.value
        if stage_key in self.state.steps and self.state.steps[stage_key].get("status") == "COMPLETED":
            return self.state.steps[stage_key]["output"]

        self.state.current_stage = stage_key
        self.state.status = WorkflowStatus.RUNNING
        self.state.updated_at = time.time()

        start = time.time()
        attempt = 0
        last_err = None

        while attempt < max_retries:
            attempt += 1
            try:
                res = activity_fn()
                duration = (time.time() - start) * 1000
                step_res = WorkflowStepResult(
                    stage=stage_key,
                    status="COMPLETED",
                    duration_ms=round(duration, 2),
                    output=res if isinstance(res, dict) else {"result": res},
                    retries=attempt - 1
                )
                self.state.steps[stage_key] = asdict(step_res)
                self.state.updated_at = time.time()
                return res
            except Exception as e:
                last_err = str(e)
                if attempt >= max_retries:
                    duration = (time.time() - start) * 1000
                    step_res = WorkflowStepResult(
                        stage=stage_key,
                        status="FAILED",
                        duration_ms=round(duration, 2),
                        error=last_err,
                        retries=attempt
                    )
                    self.state.steps[stage_key] = asdict(step_res)
                    self.state.status = WorkflowStatus.FAILED
                    raise e

    def pause_for_human(self, provisional_data: Dict[str, Any]):
        """Sets workflow state to WAITING_FOR_HUMAN review."""
        self.state.current_stage = WorkflowStage.HUMAN_CONFIRMATION.value
        self.state.status = WorkflowStatus.WAITING_FOR_HUMAN
        self.state.metadata["provisional_data"] = provisional_data
        self.state.updated_at = time.time()

    def resume_after_human(self, confirmed_data: Dict[str, Any]):
        """Resumes workflow once user confirms the structured facts."""
        self.state.current_stage = WorkflowStage.PERSIST_FACTS.value
        self.state.status = WorkflowStatus.RUNNING
        self.state.metadata["confirmed_data"] = confirmed_data
        self.state.updated_at = time.time()

    def complete(self):
        self.state.status = WorkflowStatus.COMPLETED
        self.state.updated_at = time.time()

    def get_state(self) -> Dict[str, Any]:
        return {
            "workflow_id": self.state.workflow_id,
            "document_id": self.state.document_id,
            "current_stage": self.state.current_stage,
            "status": self.state.status.value,
            "created_at": self.state.created_at,
            "updated_at": self.state.updated_at,
            "steps": self.state.steps,
            "metadata": self.state.metadata
        }
