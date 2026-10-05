import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_end_to_end_upload_pipeline():
    sample_content = b"""State Electricity Board
Consumer No: 9918231
Billing Period: 01/09/2026 to 30/09/2026
Due Date: 2026-10-15
Amount Due: 2481.00
"""
    # 1. Upload document
    response = client.post(
        "/api/documents/upload",
        files={"file": ("sample_bill.png", sample_content, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == "provisional"
    assert data["doc_type"] in ["electricity_bill", "unknown"]
    assert "document_id" in data
    doc_id = data["document_id"]

    # 2. Confirm fields
    confirm_response = client.post(
        f"/api/documents/{doc_id}/confirm",
        json={
            "provider": "State Electricity Board",
            "due_date": "2026-10-15",
            "amount_due": "2481.00"
        }
    )
    assert confirm_response.status_code == 200
    confirm_data = confirm_response.json()
    assert confirm_data["status"] == "success"
    assert confirm_data["actions_created"] >= 1

    # 3. Check Todo list
    todo_res = client.get("/api/todo")
    assert todo_res.status_code == 200
    todos = todo_res.json()
    all_actions = todos["do_now"] + todos["coming_up"] + todos["monitored"] + todos["completed"]
    assert len(all_actions) >= 1
    assert any("State Electricity Board" in t["title"] for t in all_actions)

def test_invalid_file_type():
    response = client.post(
        "/api/documents/upload",
        files={"file": ("malicious.exe", b"binary content", "application/octet-stream")}
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]
