"""
Database Auto-Seeder for Kaagaz Life Admin Copilot.

Ensures that new users and judges immediately see a fully functioning, realistic
household environment with confirmed documents, action items, historical comparisons,
and TabPFN-ready billing streams if the database is newly initialized.
"""

import datetime
from sqlalchemy.orm import Session
from app.models import DocumentModel, FactModel, ActionItemModel, ComparisonModel
from app.config import settings

def seed_demo_household_if_empty(db: Session):
    existing_docs = db.query(DocumentModel).count()
    if existing_docs > 0:
        return

    now = datetime.datetime.now(datetime.timezone.utc)
    
    # 1. August Torrent Power Bill (Historical baseline)
    doc_aug_id = "doc-aug-torrent-001"
    doc_aug = DocumentModel(
        id=doc_aug_id,
        original_filename="Torrent_Power_August_2026.pdf",
        stored_filename=f"{doc_aug_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_aug_id}.pdf"),
        file_type=".pdf",
        file_size=194200,
        doc_type="electricity_bill",
        title="Torrent Power Bill (August 2026)",
        status="confirmed",
        ocr_text="TORRENT POWER LTD\nBill for August 2026\nConsumer No: 11223344\nUnits Consumed: 192 kWh\nAmount: INR 2,102.00\nDue Date: 2026-09-15",
        created_at=now - datetime.timedelta(days=32)
    )
    db.add(doc_aug)

    facts_aug = [
        ("provider", "Torrent Power Ltd"),
        ("account_reference", "11223344"),
        ("amount_due", "2102.00"),
        ("units_consumed", "192"),
        ("due_date", "2026-09-15"),
        ("tariff_category", "Residential LT-1")
    ]
    for fn, val in facts_aug:
        db.add(FactModel(
            document_id=doc_aug_id,
            field_name=fn,
            raw_value=val,
            normalized_value=val,
            confidence=0.99,
            user_confirmed=True
        ))

    # 2. September Torrent Power Bill (Current cycle with spike & comparison)
    doc_sep_id = "doc-sep-torrent-002"
    doc_sep = DocumentModel(
        id=doc_sep_id,
        original_filename="Torrent_Power_Sep_2026.pdf",
        stored_filename=f"{doc_sep_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_sep_id}.pdf"),
        file_type=".pdf",
        file_size=248000,
        doc_type="electricity_bill",
        title="Torrent Power Bill (September 2026)",
        status="confirmed",
        ocr_text="TORRENT POWER LTD\nTax Invoice & Bill for September 2026\nConsumer No: 11223344\nUnits Consumed: 240 kWh (Peak)\nTotal Current Amount Due: INR 2,481.00\nPayment Due Date: 2026-10-15\nPrevious Bill: INR 2,102.00 (192 kWh)",
        created_at=now - datetime.timedelta(days=2)
    )
    db.add(doc_sep)

    facts_sep = [
        ("provider", "Torrent Power Ltd"),
        ("account_reference", "11223344"),
        ("amount_due", "2481.00"),
        ("previous_amount", "2102.00"),
        ("units_consumed", "240"),
        ("previous_units", "192"),
        ("due_date", "2026-10-15"),
        ("tariff_category", "Residential LT-1")
    ]
    for fn, val in facts_sep:
        db.add(FactModel(
            document_id=doc_sep_id,
            field_name=fn,
            raw_value=val,
            normalized_value=val,
            confidence=0.99,
            user_confirmed=True
        ))

    # Action item for Torrent Power
    db.add(ActionItemModel(
        document_id=doc_sep_id,
        title="Pay Torrent Power Electricity Bill",
        description="Electricity bill for Sep 2026 cycle. Usage was 240 kWh.",
        due_date="2026-10-15",
        amount=2481.0,
        urgency="RED",
        status="pending",
        action_type="pay"
    ))

    # Historical comparison record
    db.add(ComparisonModel(
        document_id=doc_sep_id,
        previous_document_id=doc_aug_id,
        metric_name="amount_due",
        current_value=2481.0,
        previous_value=2102.0,
        delta_value=379.0,
        percentage_change=18.0
    ))

    # 3. Samsung Washing Machine Warranty
    doc_war_id = "doc-samsung-war-003"
    doc_war = DocumentModel(
        id=doc_war_id,
        original_filename="Samsung_Washing_Machine_Warranty.pdf",
        stored_filename=f"{doc_war_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_war_id}.pdf"),
        file_type=".pdf",
        file_size=312000,
        doc_type="warranty",
        title="Samsung Front Load Washing Machine Warranty",
        status="confirmed",
        ocr_text="SAMSUNG ELECTRONICS INDIA\nOfficial Manufacturer Warranty\nProduct: Front Load Washing Machine 8.0kg (EcoBubble)\nSerial Number: SN-SAM-884920\nPurchase Date: 2024-11-18\nWarranty Expiry: 2026-11-18\nCustomer Support: 1800-40-7267864",
        created_at=now - datetime.timedelta(days=15)
    )
    db.add(doc_war)

    facts_war = [
        ("brand", "Samsung Electronics"),
        ("product", "Front Load Washing Machine 8kg"),
        ("serial_number", "SN-SAM-884920"),
        ("expiry_date", "2026-11-18"),
        ("service_contact", "1800-40-7267864")
    ]
    for fn, val in facts_war:
        db.add(FactModel(
            document_id=doc_war_id,
            field_name=fn,
            raw_value=val,
            normalized_value=val,
            confidence=0.98,
            user_confirmed=True
        ))

    db.add(ActionItemModel(
        document_id=doc_war_id,
        title="Samsung Washer Warranty Expiration Check",
        description="Official manufacturer warranty expires soon. Book complimentary maintenance inspection.",
        due_date="2026-11-18",
        amount=None,
        urgency="GREEN",
        status="pending",
        action_type="renew"
    ))

    # 4. Municipal Property Tax Notice (with 5% early rebate)
    doc_tax_id = "doc-mcd-tax-004"
    doc_tax = DocumentModel(
        id=doc_tax_id,
        original_filename="Property_Tax_Assessment_2026.pdf",
        stored_filename=f"{doc_tax_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_tax_id}.pdf"),
        file_type=".pdf",
        file_size=188000,
        doc_type="notice",
        title="Notice: Property Tax Assessment FY 2026-27",
        status="confirmed",
        ocr_text="MUNICIPAL CORPORATION PROPERTY TAX ASSESSMENT\nDemand Reference: MCD/REV/2026/99120\nAssessment Demand: INR 3,240.00\nEarly Settlement Rebate (5%): Pay by 2026-10-20 to save INR 162.00\nStatutory Final Deadline: 2026-10-31",
        created_at=now - datetime.timedelta(days=5)
    )
    db.add(doc_tax)

    facts_tax = [
        ("issuer", "Municipal Corporation Assessment Dept"),
        ("subject", "Annual Property Tax Assessment"),
        ("amount", "3240.00"),
        ("deadline", "2026-10-20"),
        ("statutory_reference", "MCD/REV/2026/99120")
    ]
    for fn, val in facts_tax:
        db.add(FactModel(
            document_id=doc_tax_id,
            field_name=fn,
            raw_value=val,
            normalized_value=val,
            confidence=0.97,
            user_confirmed=True
        ))

    db.add(ActionItemModel(
        document_id=doc_tax_id,
        title="Pay Property Tax Assessment (5% Early Rebate)",
        description="Settle before Oct 20 early deadline to claim 5% municipal rebate.",
        due_date="2026-10-20",
        amount=3240.0,
        urgency="YELLOW",
        status="pending",
        action_type="pay"
    ))

    # 5. Airtel Fiber Broadband Bill
    doc_air_id = "doc-airtel-fiber-005"
    doc_air = DocumentModel(
        id=doc_air_id,
        original_filename="Airtel_Broadband_Invoice_Oct.pdf",
        stored_filename=f"{doc_air_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_air_id}.pdf"),
        file_type=".pdf",
        file_size=142000,
        doc_type="electricity_bill",
        title="Airtel Broadband Bill (October 2026)",
        status="confirmed",
        ocr_text="BHARTI AIRTEL BROADBAND SERVICES\nInvoice for Oct 2026\nAccount: 011-8849201\nPlan: 300 Mbps Fiber Unlimited\nAmount Due: INR 1,179.00\nPayment Due Date: 2026-10-15",
        created_at=now - datetime.timedelta(days=1)
    )
    db.add(doc_air)

    facts_air = [
        ("provider", "Bharti Airtel Broadband"),
        ("account_reference", "011-8849201"),
        ("amount_due", "1179.00"),
        ("due_date", "2026-10-15"),
        ("plan", "300 Mbps Fiber")
    ]
    for fn, val in facts_air:
        db.add(FactModel(
            document_id=doc_air_id,
            field_name=fn,
            raw_value=val,
            normalized_value=val,
            confidence=0.99,
            user_confirmed=True
        ))

    db.add(ActionItemModel(
        document_id=doc_air_id,
        title="Pay Airtel Fiber Broadband Bill",
        description="Monthly fiber internet invoice (₹1,179.00).",
        due_date="2026-10-15",
        amount=1179.0,
        urgency="RED",
        status="pending",
        action_type="pay"
    ))

    db.commit()
    print("✓ Successfully seeded demo household data into local SQLite database.")
