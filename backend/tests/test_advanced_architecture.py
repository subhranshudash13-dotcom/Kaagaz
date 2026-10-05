import pytest
from app.analytics.forecasting import tabpfn_engine, TabPFNForecaster
from app.telemetry.tracer import PipelineTracer, store_trace, get_trace
from app.workflows.document_workflow import KaagazDocumentWorkflow, WorkflowStage, WorkflowStatus
from app.services.official_lookup import official_resolver

def test_tabpfn_forecast():
    history = [
        {"period": "Apr", "amount": 1842.0, "units": 180.0},
        {"period": "May", "amount": 1967.0, "units": 192.0},
        {"period": "Jun", "amount": 2031.0, "units": 198.0},
        {"period": "Jul", "amount": 2102.0, "units": 205.0},
        {"period": "Aug", "amount": 2481.0, "units": 240.0},
        {"period": "Sep", "amount": 2390.0, "units": 232.0}
    ]
    forecast = tabpfn_engine.forecast_next_period(history)
    assert forecast["available"] is True
    assert forecast["expected_amount"] > 2200.0
    assert forecast["range_min"] < forecast["expected_amount"]
    assert forecast["range_max"] > forecast["expected_amount"]
    assert forecast["confidence_score"] >= 0.85

def test_tabpfn_anomaly_detection():
    history = [
        {"period": "Apr", "amount": 1842.0, "units": 180.0},
        {"period": "May", "amount": 1967.0, "units": 192.0},
        {"period": "Jun", "amount": 2031.0, "units": 198.0},
        {"period": "Jul", "amount": 2102.0, "units": 205.0},
    ]
    spike_record = {"period": "Aug", "amount": 2481.0, "units": 240.0}
    anomaly = tabpfn_engine.detect_anomalies(spike_record, history)
    assert anomaly["is_anomalous"] is True
    assert anomaly["severity"] == "UNUSUAL"
    assert "higher" in anomaly["message"].lower() or "above" in anomaly["message"].lower()

def test_pipeline_tracer():
    tracer = PipelineTracer()
    tracer.record_span("OCR", "ocr", 310.0, "ok")
    tracer.record_span("Gemma Extraction", "gemma", 2410.0, "ok")
    tracer.record_span("Pydantic Validation", "validation", 8.0, "ok")
    tracer.add_tokens(1284)
    trace = tracer.finish()

    assert trace.tokens_consumed == 1284
    assert len(trace.spans) == 3
    store_trace(trace)
    retrieved = get_trace(trace.document_id)
    assert retrieved is not None
    assert retrieved["trace_id"] == trace.trace_id

def test_temporal_durable_workflow():
    workflow = KaagazDocumentWorkflow("wf-test-123", "doc-test-123")
    assert workflow.state.status == WorkflowStatus.PENDING

    # Step 1: store
    res = workflow.execute_activity(WorkflowStage.STORE_DOCUMENT, lambda: {"stored": True})
    assert res["stored"] is True
    assert WorkflowStage.STORE_DOCUMENT.value in workflow.state.steps

    # Step 2: pause for human
    workflow.pause_for_human({"fields": 8})
    assert workflow.state.status == WorkflowStatus.WAITING_FOR_HUMAN

    # Step 3: resume
    workflow.resume_after_human({"confirmed": True})
    assert workflow.state.status == WorkflowStatus.RUNNING

    # Step 4: complete
    workflow.complete()
    assert workflow.state.status == WorkflowStatus.COMPLETED

def test_official_portal_resolver():
    res = official_resolver.resolve_portal("Torrent Power Ltd", "electricity_bill")
    assert res is not None
    assert "torrentpower.com" in res["portal_url"]
    assert res["is_verified"] is True
