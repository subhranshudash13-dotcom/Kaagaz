import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_document_lifecycle_and_features():
    # 1. Upload sample bill 1 (Previous month)
    bill1_content = b"""Torrent Power Bill
Consumer No: 112233
Billing Period: 01/08/2026 to 31/08/2026
Due Date: 2026-09-10
Amount Due: 2000.00
"""
    res1 = client.post(
        "/api/documents/upload",
        files={"file": ("aug_bill.pdf", bill1_content, "application/pdf")}
    )
    assert res1.status_code == 200
    doc1_id = res1.json()["document_id"]

    # Confirm bill 1
    confirm1 = client.post(
        f"/api/documents/{doc1_id}/confirm",
        json={
            "fields": {
                "provider": "Torrent Power",
                "due_date": "2026-09-10",
                "amount_due": 2000.00
            },
            "doc_type": "electricity_bill"
        }
    )
    assert confirm1.status_code == 200

    # 2. Upload sample bill 2 (Current month - higher amount)
    bill2_content = b"""Torrent Power Bill
Consumer No: 112233
Billing Period: 01/09/2026 to 30/09/2026
Due Date: 2026-10-10
Amount Due: 2500.00
"""
    res2 = client.post(
        "/api/documents/upload",
        files={"file": ("sep_bill.pdf", bill2_content, "application/pdf")}
    )
    assert res2.status_code == 200
    doc2_id = res2.json()["document_id"]

    # Confirm bill 2
    confirm2 = client.post(
        f"/api/documents/{doc2_id}/confirm",
        json={
            "fields": {
                "provider": "Torrent Power",
                "due_date": "2026-10-10",
                "amount_due": 2500.00
            },
            "doc_type": "electricity_bill"
        }
    )
    assert confirm2.status_code == 200
    data2 = confirm2.json()
    assert data2["comparison"] is not None
    assert data2["comparison"]["delta_amount"] == 500.00
    assert data2["comparison"]["percentage_change"] == 25.0

    # 3. Test Dashboard Summary
    dash_res = client.get("/api/dashboard")
    assert dash_res.status_code == 200
    dash = dash_res.json()
    assert dash["stats"]["total_documents"] >= 2
    assert len(dash["timeline"]) >= 2
    assert len(dash["recent_changes"]) >= 1

    # 4. Test Categorized Todos
    todo_res = client.get("/api/todo")
    assert todo_res.status_code == 200
    todos = todo_res.json()
    assert "do_now" in todos
    assert "coming_up" in todos
    assert "monitored" in todos
    assert "completed" in todos

    # Test toggling action completion
    all_actions = todos["do_now"] + todos["coming_up"] + todos["monitored"]
    if all_actions:
        action_id = all_actions[0]["id"]
        toggle_res = client.patch(f"/api/todo/{action_id}/toggle")
        assert toggle_res.status_code == 200
        assert toggle_res.json()["new_status"] == "completed"

    # 5. Test AI Assistant QA Endpoint over confirmed structured data
    ask_res = client.post(
        "/api/assistant/ask",
        json={"question": "What is my latest Torrent Power bill amount?"}
    )
    assert ask_res.status_code == 200
    ask_data = ask_res.json()
    assert "answer" in ask_data
    assert len(ask_data["sources"]) >= 1

    # 6. Test Document Detail & Document List
    doc_detail = client.get(f"/api/documents/{doc2_id}")
    assert doc_detail.status_code == 200
    assert doc_detail.json()["id"] == doc2_id
    assert len(doc_detail.json()["facts"]) >= 1

    doc_list = client.get("/api/documents")
    assert doc_list.status_code == 200
    assert len(doc_list.json()) >= 2
