import pytest
from app.extraction.schemas import ElectricityBillSchema, WarrantySchema, NoticeSchema
from app.extraction.validator import validate_extraction
from app.rules.urgency import calculate_urgency
from app.rules.dates import days_until
from datetime import date, timedelta

def test_pydantic_schemas_support_none():
    bill = ElectricityBillSchema(provider="Tata Power", amount_due=1500.50)
    assert bill.provider == "Tata Power"
    assert bill.account_reference is None
    assert bill.due_date is None

    warranty = WarrantySchema(product="Laptop")
    assert warranty.product == "Laptop"
    assert warranty.serial_number is None

def test_validation_layer():
    # Test missing fields warning
    issues = validate_extraction("electricity_bill", {"provider": None, "amount_due": None})
    assert any("Missing provider name" in i for i in issues)
    assert any("Missing due date" in i for i in issues)

    # Test clean validation
    clean_issues = validate_extraction("electricity_bill", {
        "provider": "Adani Electricity",
        "due_date": "2026-10-15",
        "amount_due": 1250.0
    })
    assert len(clean_issues) == 0

def test_deterministic_urgency_rules():
    today = date.today()
    
    # Overdue
    yesterday = (today - timedelta(days=2)).strftime("%Y-%m-%d")
    assert calculate_urgency(yesterday) == "OVERDUE"

    # Urgent (RED) <= 3 days
    in_2_days = (today + timedelta(days=2)).strftime("%Y-%m-%d")
    assert calculate_urgency(in_2_days) == "RED"

    # Warning (YELLOW) 4-14 days
    in_7_days = (today + timedelta(days=7)).strftime("%Y-%m-%d")
    assert calculate_urgency(in_7_days) == "YELLOW"

    # Future (GREEN) > 14 days
    in_30_days = (today + timedelta(days=30)).strftime("%Y-%m-%d")
    assert calculate_urgency(in_30_days) == "GREEN"
