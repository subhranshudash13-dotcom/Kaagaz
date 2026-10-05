"""
Database Auto-Seeder for Kaagaz Life Admin Copilot.

Ensures that new users, families, and judges immediately see a vast, realistic,
multidimensional household vault across Utilities, Healthcare, Motor, Warranties,
Taxes, Education, and Legal agreements.
"""

import datetime
from sqlalchemy.orm import Session
from app.models import DocumentModel, FactModel, ActionItemModel, ComparisonModel
from app.config import settings

def seed_demo_household_if_empty(db: Session, force_clean: bool = False):
    if force_clean:
        db.query(ComparisonModel).delete()
        db.query(ActionItemModel).delete()
        db.query(FactModel).delete()
        db.query(DocumentModel).delete()
        db.commit()
    else:
        existing_docs = db.query(DocumentModel).count()
        if existing_docs > 5:
            return

    now = datetime.datetime.now(datetime.timezone.utc)

    # -------------------------------------------------------------
    # 1. UTILITIES: Torrent Power Bill (Current Month + Comparison)
    # -------------------------------------------------------------
    doc_aug_id = "doc-torrent-aug-001"
    doc_aug = DocumentModel(
        id=doc_aug_id,
        original_filename="Torrent_Power_Aug_2026.pdf",
        stored_filename=f"{doc_aug_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_aug_id}.pdf"),
        file_type=".pdf",
        file_size=194200,
        doc_type="electricity_bill",
        title="Torrent Power Bill (August 2026)",
        status="confirmed",
        ocr_text="TORRENT POWER LTD\nBill for August 2026\nConsumer No: 11223344\nUnits Consumed: 192 kWh\nAmount: INR 2,102.00\nDue Date: 2026-09-15",
        created_at=now - datetime.timedelta(days=34)
    )
    db.add(doc_aug)
    for fn, val in [("provider", "Torrent Power Ltd"), ("account_reference", "11223344"), ("amount_due", "2102.00"), ("units_consumed", "192"), ("due_date", "2026-09-15"), ("tariff_category", "Residential LT-1")]:
        db.add(FactModel(document_id=doc_aug_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.99, user_confirmed=True))

    doc_sep_id = "doc-torrent-sep-002"
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
    for fn, val in [("provider", "Torrent Power Ltd"), ("account_reference", "11223344"), ("amount_due", "2481.00"), ("previous_amount", "2102.00"), ("units_consumed", "240"), ("previous_units", "192"), ("due_date", "2026-10-15"), ("meter_number", "MTR-884910"), ("service_address", "Flat 402, Palm Meadows, Mumbai")]:
        db.add(FactModel(document_id=doc_sep_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.99, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_sep_id,
        title="Pay Torrent Power Electricity Bill (₹2,481.00)",
        description="Electricity bill for Sep 2026 cycle. Usage 240 kWh (+18% vs Aug).",
        due_date="2026-10-15",
        amount=2481.0,
        urgency="RED",
        status="pending",
        action_type="pay"
    ))
    db.add(ComparisonModel(
        document_id=doc_sep_id,
        previous_document_id=doc_aug_id,
        metric_name="amount_due",
        current_value=2481.0,
        previous_value=2102.0,
        delta_value=379.0,
        percentage_change=18.0
    ))

    # -------------------------------------------------------------
    # 2. UTILITIES: Mahanagar Piped Natural Gas (MGL)
    # -------------------------------------------------------------
    doc_gas_id = "doc-mgl-gas-003"
    doc_gas = DocumentModel(
        id=doc_gas_id,
        original_filename="MGL_Piped_Gas_Invoice_Oct.pdf",
        stored_filename=f"{doc_gas_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_gas_id}.pdf"),
        file_type=".pdf",
        file_size=158000,
        doc_type="electricity_bill",
        title="Mahanagar Piped Gas (MGL) Invoice",
        status="confirmed",
        ocr_text="MAHANAGAR GAS LIMITED\nPiped Natural Gas (Domestic Bill)\nCustomer BP No: 400192849\nBilling Units: 34 SCM\nAmount Payable: INR 1,420.00\nPayment Due Date: 2026-10-22",
        created_at=now - datetime.timedelta(days=4)
    )
    db.add(doc_gas)
    for fn, val in [("provider", "Mahanagar Gas Limited (MGL)"), ("account_reference", "BP-400192849"), ("amount_due", "1420.00"), ("units_consumed", "34 SCM"), ("due_date", "2026-10-22")]:
        db.add(FactModel(document_id=doc_gas_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.98, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_gas_id,
        title="Pay Mahanagar Piped Gas (MGL) Bill (₹1,420.00)",
        description="Bi-monthly domestic cooking gas bill for 34 SCM consumption.",
        due_date="2026-10-22",
        amount=1420.0,
        urgency="YELLOW",
        status="pending",
        action_type="pay"
    ))

    # -------------------------------------------------------------
    # 3. UTILITIES: Airtel High-Speed Fiber Broadband
    # -------------------------------------------------------------
    doc_air_id = "doc-airtel-fiber-004"
    doc_air = DocumentModel(
        id=doc_air_id,
        original_filename="Airtel_Fiber_Invoice_Oct.pdf",
        stored_filename=f"{doc_air_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_air_id}.pdf"),
        file_type=".pdf",
        file_size=142000,
        doc_type="electricity_bill",
        title="Airtel Broadband Bill (October 2026)",
        status="confirmed",
        ocr_text="BHARTI AIRTEL BROADBAND SERVICES\nInvoice for Oct 2026\nAccount: 011-8849201\nPlan: 300 Mbps Fiber Unlimited + OTT Bundle\nAmount Due: INR 1,179.00\nPayment Due Date: 2026-10-15",
        created_at=now - datetime.timedelta(days=1)
    )
    db.add(doc_air)
    for fn, val in [("provider", "Bharti Airtel Broadband"), ("account_reference", "011-8849201"), ("amount_due", "1179.00"), ("due_date", "2026-10-15"), ("plan", "300 Mbps Fiber Unlimited")]:
        db.add(FactModel(document_id=doc_air_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.99, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_air_id,
        title="Pay Airtel Fiber Broadband Bill (₹1,179.00)",
        description="Monthly fiber internet invoice with auto-debit fallback.",
        due_date="2026-10-15",
        amount=1179.0,
        urgency="RED",
        status="pending",
        action_type="pay"
    ))

    # -------------------------------------------------------------
    # 4. HEALTHCARE: HDFC ERGO Family Health Suraksha Insurance
    # -------------------------------------------------------------
    doc_health_id = "doc-hdfc-health-005"
    doc_health = DocumentModel(
        id=doc_health_id,
        original_filename="HDFC_ERGO_Health_Optima_Policy.pdf",
        stored_filename=f"{doc_health_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_health_id}.pdf"),
        file_type=".pdf",
        file_size=420000,
        doc_type="notice",
        title="HDFC ERGO Family Health Suraksha Policy (₹15L)",
        status="confirmed",
        ocr_text="HDFC ERGO GENERAL INSURANCE COMPANY\nPolicy Schedule: Optima Secure Family Floater\nPolicy Number: HDFC-HLT-2026-881920\nSum Insured: INR 15,00,000\nInsured Members: Rajesh Kumar (Self), Priya Sharma (Spouse), Aarav Kumar (Child)\nAnnual Renewal Premium: INR 22,450.00\nRenewal Due Date: 2026-11-05\n24x7 Cashless Hospital TPA Helpline: 1800-2666",
        created_at=now - datetime.timedelta(days=10)
    )
    db.add(doc_health)
    for fn, val in [("insurer", "HDFC ERGO General Insurance"), ("policy_number", "HDFC-HLT-2026-881920"), ("sum_insured", "₹15,00,000"), ("insured_members", "Rajesh (36), Priya (34), Aarav (8)"), ("annual_premium", "22450.00"), ("renewal_due_date", "2026-11-05"), ("tpa_helpline", "1800-2666 (Cashless)"), ("network_hospitals", "Lilavati, Fortis, Apollo")]:
        db.add(FactModel(document_id=doc_health_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.99, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_health_id,
        title="Review & Renew HDFC ERGO Health Insurance (₹22,450)",
        description="Annual health policy renewal (₹15 Lakh Floater for Rajesh, Priya, Aarav). Avoid grace period lapse.",
        due_date="2026-11-05",
        amount=22450.0,
        urgency="GREEN",
        status="pending",
        action_type="renew"
    ))

    # -------------------------------------------------------------
    # 5. MOTOR & TRANSPORT: Tata AIG Comprehensive Car Insurance
    # -------------------------------------------------------------
    doc_car_id = "doc-tata-car-006"
    doc_car = DocumentModel(
        id=doc_car_id,
        original_filename="Tata_AIG_AutoSecure_Creta.pdf",
        stored_filename=f"{doc_car_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_car_id}.pdf"),
        file_type=".pdf",
        file_size=385000,
        doc_type="notice",
        title="Tata AIG Comprehensive Motor Policy (Creta)",
        status="confirmed",
        ocr_text="TATA AIG GENERAL INSURANCE\nAutoSecure Private Car Package Policy\nVehicle: Hyundai Creta 1.5 SX (Registration: MH-02-EE-4921)\nInsured Declared Value (IDV): INR 11,50,000\nAdd-ons: Zero Depreciation + Engine Protector + Roadside Assistance\nPolicy Expiry Date: 2026-10-28\nAnnual Premium: INR 14,800.00\nMandatory PUC Certificate Due: 2026-11-10",
        created_at=now - datetime.timedelta(days=8)
    )
    db.add(doc_car)
    for fn, val in [("insurer", "Tata AIG General Insurance"), ("policy_number", "015948301900"), ("vehicle_model", "Hyundai Creta 1.5 SX"), ("registration_number", "MH-02-EE-4921"), ("idv_value", "₹11,50,000"), ("policy_expiry", "2026-10-28"), ("puc_due_date", "2026-11-10"), ("roadside_assistance", "1800-258-5555")]:
        db.add(FactModel(document_id=doc_car_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.98, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_car_id,
        title="Renew Car Insurance & PUC Check (MH-02-EE-4921)",
        description="Zero-dep comprehensive policy expires Oct 28. Mandatory emission PUC test due Nov 10.",
        due_date="2026-10-28",
        amount=14800.0,
        urgency="YELLOW",
        status="pending",
        action_type="renew"
    ))

    # -------------------------------------------------------------
    # 6. APPLIANCES: Samsung Front Load Washing Machine Warranty
    # -------------------------------------------------------------
    doc_war_id = "doc-samsung-war-007"
    doc_war = DocumentModel(
        id=doc_war_id,
        original_filename="Samsung_Washing_Machine_Warranty.pdf",
        stored_filename=f"{doc_war_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_war_id}.pdf"),
        file_type=".pdf",
        file_size=312000,
        doc_type="warranty",
        title="Samsung AI Ecobubble Washer (8kg) Warranty",
        status="confirmed",
        ocr_text="SAMSUNG ELECTRONICS INDIA\nOfficial Manufacturer Warranty\nProduct: Front Load Washing Machine 8.0kg (AI Ecobubble)\nModel: WW80T504DAX\nSerial Number: SN-SAM-884920\nPurchase Date: 2024-11-18\nComprehensive Expiry: 2026-11-18\nDigital Inverter Motor Warranty: 20 Years (Valid until 2044)\nCustomer Support & Booking: 1800-40-7267864",
        created_at=now - datetime.timedelta(days=15)
    )
    db.add(doc_war)
    for fn, val in [("brand", "Samsung Electronics"), ("product", "Front Load Washer 8kg (AI Ecobubble)"), ("model_number", "WW80T504DAX"), ("serial_number", "SN-SAM-884920"), ("purchase_date", "2024-11-18"), ("expiry_date", "2026-11-18"), ("motor_warranty", "20 Years (Active)"), ("service_contact", "1800-40-7267864")]:
        db.add(FactModel(document_id=doc_war_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.98, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_war_id,
        title="Samsung Washer Comprehensive Warranty Expiration",
        description="Standard 2-year appliance warranty expires Nov 18. Digital inverter motor covered for 20 years.",
        due_date="2026-11-18",
        amount=None,
        urgency="GREEN",
        status="pending",
        action_type="renew"
    ))

    # -------------------------------------------------------------
    # 7. ELECTRONICS: Apple MacBook Pro 14" & AppleCare+ Protection
    # -------------------------------------------------------------
    doc_mac_id = "doc-apple-mac-008"
    doc_mac = DocumentModel(
        id=doc_mac_id,
        original_filename="Apple_MacBook_Pro_AppleCare_Invoice.pdf",
        stored_filename=f"{doc_mac_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_mac_id}.pdf"),
        file_type=".pdf",
        file_size=290000,
        doc_type="warranty",
        title="Apple MacBook Pro 14\" M3 Pro & AppleCare+",
        status="confirmed",
        ocr_text="APPLE INDIA PVT LTD\nOfficial Proof of Coverage & Tax Invoice\nItem: MacBook Pro 14-inch (M3 Pro / 18GB / 512GB Space Black)\nSerial Number: C02G410XP3\nAgreement Number: AC-APL-2024-99124\nAppleCare+ Plan Coverage: Active until April 12, 2027\nAccidental Damage Protection: Unlimited incidents with standard deductible\nApple Support: 000800 1009009",
        created_at=now - datetime.timedelta(days=22)
    )
    db.add(doc_mac)
    for fn, val in [("brand", "Apple India"), ("product", "MacBook Pro 14\" M3 Pro (18GB/512GB)"), ("serial_number", "C02G410XP3"), ("agreement_number", "AC-APL-2024-99124"), ("coverage_status", "Active (AppleCare+)"), ("expiry_date", "2027-04-12"), ("support_phone", "000800 1009009")]:
        db.add(FactModel(document_id=doc_mac_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.99, user_confirmed=True))

    # -------------------------------------------------------------
    # 8. GOVERNMENT & TAXES: Municipal Property Tax Assessment
    # -------------------------------------------------------------
    doc_tax_id = "doc-mcd-tax-009"
    doc_tax = DocumentModel(
        id=doc_tax_id,
        original_filename="Property_Tax_Assessment_2026.pdf",
        stored_filename=f"{doc_tax_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_tax_id}.pdf"),
        file_type=".pdf",
        file_size=188000,
        doc_type="notice",
        title="Notice: Municipal Property Tax Assessment FY 2026-27",
        status="confirmed",
        ocr_text="MUNICIPAL CORPORATION PROPERTY TAX ASSESSMENT\nProperty Identification Number (UPIN): 402-PLM-9918\nDemand Reference: MCD/REV/2026/99120\nAssessment Demand: INR 3,240.00\nEarly Settlement Rebate (5%): Pay by 2026-10-20 to save INR 162.00\nStatutory Final Deadline: 2026-10-31 (Late interest 1.5%/month)",
        created_at=now - datetime.timedelta(days=5)
    )
    db.add(doc_tax)
    for fn, val in [("issuer", "Municipal Corporation Assessment Dept"), ("property_pin", "402-PLM-9918"), ("subject", "Annual Property Tax Assessment"), ("amount", "3240.00"), ("early_rebate_amount", "162.00 (5%)"), ("early_deadline", "2026-10-20"), ("final_deadline", "2026-10-31"), ("statutory_reference", "MCD/REV/2026/99120")]:
        db.add(FactModel(document_id=doc_tax_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.97, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_tax_id,
        title="Pay Property Tax Assessment (5% Early Rebate)",
        description="Settle before Oct 20 early deadline to claim ₹162 rebate. Final statutory due Oct 31.",
        due_date="2026-10-20",
        amount=3240.0,
        urgency="YELLOW",
        status="pending",
        action_type="pay"
    ))

    # -------------------------------------------------------------
    # 9. EDUCATION: Delhi Public School (DPS) Term 2 Fee Notice
    # -------------------------------------------------------------
    doc_dps_id = "doc-dps-fee-010"
    doc_dps = DocumentModel(
        id=doc_dps_id,
        original_filename="DPS_School_Term2_Fee_Notice.pdf",
        stored_filename=f"{doc_dps_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_dps_id}.pdf"),
        file_type=".pdf",
        file_size=215000,
        doc_type="notice",
        title="DPS School Term 2 Tuition & Bus Fee Notice",
        status="confirmed",
        ocr_text="DELHI PUBLIC SCHOOL (DPS) — ACADEMIC SESSION 2026-27\nStudent Name: Aarav Kumar (Admission No: DPS-2022-819)\nClass & Section: Grade 4-B\nTerm 2 Fee Breakdown: Tuition (INR 18,500) + AC Bus Route 14 (INR 6,100)\nTotal Amount Due: INR 24,600.00\nDue Date: 2026-10-18\nLate Fee Fine: INR 50/day after Oct 18",
        created_at=now - datetime.timedelta(days=3)
    )
    db.add(doc_dps)
    for fn, val in [("institution", "Delhi Public School (DPS)"), ("student_name", "Aarav Kumar (Grade 4-B)"), ("admission_number", "DPS-2022-819"), ("tuition_fee", "18500.00"), ("transport_fee", "6100.00"), ("total_amount", "24600.00"), ("due_date", "2026-10-18"), ("late_fine", "₹50/day")]:
        db.add(FactModel(document_id=doc_dps_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.99, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_dps_id,
        title="Pay DPS Term 2 Tuition & Transport Fee (Aarav)",
        description="Term 2 school fees for Aarav (Class 4-B). Pay before Oct 18 to avoid daily late charges.",
        due_date="2026-10-18",
        amount=24600.0,
        urgency="RED",
        status="pending",
        action_type="pay"
    ))

    # -------------------------------------------------------------
    # 10. HOUSING: Society Maintenance & Sinking Fund Quarterly Bill
    # -------------------------------------------------------------
    doc_soc_id = "doc-palm-soc-011"
    doc_soc = DocumentModel(
        id=doc_soc_id,
        original_filename="Palm_Meadows_Q3_Society_Maintenance.pdf",
        stored_filename=f"{doc_soc_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_soc_id}.pdf"),
        file_type=".pdf",
        file_size=175000,
        doc_type="notice",
        title="Palm Meadows Society Quarterly Maintenance (Q3)",
        status="confirmed",
        ocr_text="PALM MEADOWS RESIDENTS CO-OPERATIVE HOUSING SOCIETY\nMaintenance Bill for Quarter Oct - Dec 2026\nUnit: Flat B-402 (Rajesh Kumar)\nBreakup: General Maintenance (INR 6,000) + Sinking Fund (INR 1,500) + Lift AMC (INR 1,000)\nTotal Amount Payable: INR 8,500.00\nPayment Due Date: 2026-10-25",
        created_at=now - datetime.timedelta(days=6)
    )
    db.add(doc_soc)
    for fn, val in [("society_name", "Palm Meadows Residents CHS"), ("unit_reference", "Flat B-402"), ("period", "Oct - Dec 2026 (Q3)"), ("amount_due", "8500.00"), ("sinking_fund", "₹1,500"), ("due_date", "2026-10-25")]:
        db.add(FactModel(document_id=doc_soc_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.98, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_soc_id,
        title="Pay Palm Meadows Q3 Maintenance Bill (₹8,500)",
        description="Quarterly society maintenance, sinking fund, and elevator AMC for Flat B-402.",
        due_date="2026-10-25",
        amount=8500.0,
        urgency="YELLOW",
        status="pending",
        action_type="pay"
    ))

    # -------------------------------------------------------------
    # 11. HEALTH: Dental Clinic Treatment & Root Canal Receipt
    # -------------------------------------------------------------
    doc_dent_id = "doc-dr-mehta-dental-012"
    doc_dent = DocumentModel(
        id=doc_dent_id,
        original_filename="Dr_Mehta_Dental_Treatment_Receipt.pdf",
        stored_filename=f"{doc_dent_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_dent_id}.pdf"),
        file_type=".pdf",
        file_size=162000,
        doc_type="notice",
        title="Dr. Mehta Dental Clinic Receipt & Followup",
        status="confirmed",
        ocr_text="DR. MEHTA MULTISPECIALTY DENTAL CLINIC\nReceipt & Clinical Summary\nPatient: Priya Sharma\nTreatment: Single-sitting Root Canal Therapy (Tooth #16) + Ceramic Crown Prep\nAmount Paid: INR 4,500.00 (Settled)\nCrown Sitting & Final Occlusion Check: 2026-10-21 at 05:30 PM\nClinic Contact: +91 98201 44820",
        created_at=now - datetime.timedelta(days=7)
    )
    db.add(doc_dent)
    for fn, val in [("clinic", "Dr. Mehta Multispecialty Dental"), ("patient", "Priya Sharma"), ("procedure", "Root Canal (#16) & Ceramic Crown"), ("amount_paid", "4500.00"), ("appointment_date", "2026-10-21 (05:30 PM)"), ("contact", "+91 98201 44820")]:
        db.add(FactModel(document_id=doc_dent_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.99, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_dent_id,
        title="Dental Crown Final Fitting Appointment (Priya)",
        description="Follow-up sitting at Dr. Mehta Dental Clinic for ceramic crown placement on Tooth #16.",
        due_date="2026-10-21",
        amount=None,
        urgency="YELLOW",
        status="pending",
        action_type="respond"
    ))

    # -------------------------------------------------------------
    # 12. APPLIANCES: Daikin Inverter Split AC 1.5 Ton Warranty
    # -------------------------------------------------------------
    doc_ac_id = "doc-daikin-ac-013"
    doc_ac = DocumentModel(
        id=doc_ac_id,
        original_filename="Daikin_Split_AC_Warranty_Card.pdf",
        stored_filename=f"{doc_ac_id}.pdf",
        file_path=str(settings.STORAGE_DIR / f"{doc_ac_id}.pdf"),
        file_type=".pdf",
        file_size=265000,
        doc_type="warranty",
        title="Daikin 1.5 Ton Inverter AC Warranty Certificate",
        status="confirmed",
        ocr_text="DAIKIN AIRCONDITIONING INDIA\nWarranty Registration Certificate\nModel: FTKF50TV (1.5 Ton 5-Star Inverter)\nOutdoor Unit Serial: DK-2025-99201\nPCB Warranty: 5 Years (Valid until 2030-04-10)\nCompressor Warranty: 10 Years\nFree Mandatory Service Voucher 2 Due: 2026-10-25\nToll Free Helpline: 1800-102-9300",
        created_at=now - datetime.timedelta(days=28)
    )
    db.add(doc_ac)
    for fn, val in [("brand", "Daikin Airconditioning"), ("product", "1.5 Ton 5-Star Inverter Split AC"), ("model_number", "FTKF50TV"), ("pcb_warranty", "5 Years (Active until 2030)"), ("compressor_warranty", "10 Years"), ("service_voucher_due", "2026-10-25"), ("customer_care", "1800-102-9300")]:
        db.add(FactModel(document_id=doc_ac_id, field_name=fn, raw_value=val, normalized_value=val, confidence=0.98, user_confirmed=True))

    db.add(ActionItemModel(
        document_id=doc_ac_id,
        title="Book Daikin AC Complimentary Pre-Winter Service",
        description="Redeem Free Service Voucher 2 before Oct 25 to maintain 5-year PCB warranty validity.",
        due_date="2026-10-25",
        amount=None,
        urgency="YELLOW",
        status="pending",
        action_type="renew"
    ))

    db.commit()
    print("[OK] Successfully populated rich, multidimensional household vault with 12 diverse life-admin records.")
