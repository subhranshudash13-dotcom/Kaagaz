"""
Synthetic Document & Ground Truth Dataset Generator for Tinker LoRA Fine-Tuning.

Generates 1,500+ realistic ground-truth household documents:
- Electricity & utility bills
- Appliance warranty cards & purchase receipts
- Municipal property tax & government notices
- Broadband & subscription invoices
"""

import json
import random
from pathlib import Path
from typing import List, Dict, Any

DOCUMENT_TYPES = [
    "electricity_bill",
    "warranty",
    "notice",
    "receipt",
    "insurance",
    "subscription"
]

PROVIDERS = [
    "Torrent Power Ltd", "BSES Rajdhani", "Tata Power DDL", 
    "Adani Electricity Mumbai", "Maharashtra State Electricity",
    "Bangalore Electricity BESCOM", "CESC Kolkata"
]

BRANDS = ["Samsung Electronics", "LG Electronics", "Daikin India", "Sony India", "Whirlpool", "Bosch"]
PRODUCTS = ["Split Air Conditioner 1.5T", "Front Load Washing Machine 8kg", "OLED Smart TV 55 inch", "Frost Free Refrigerator 340L", "Microwave Oven 28L"]

ISSUERS = ["Municipal Corporation Assessment Dept", "State Tax Authority", "Traffic Police Department", "Urban Development Authority"]

def generate_synthetic_record(idx: int) -> Dict[str, Any]:
    doc_type = random.choice(DOCUMENT_TYPES)
    
    if doc_type == "electricity_bill":
        provider = random.choice(PROVIDERS)
        amount = round(random.uniform(1200.0, 4800.0), 2)
        units = random.randint(140, 450)
        due_month = random.randint(1, 12)
        due_day = random.randint(5, 28)
        due_date = f"2026-{due_month:02d}-{due_day:02d}"
        account_no = f"{random.randint(10000000, 99999999)}"
        
        raw_text = f"""
        ==================================================
        {provider.upper()}
        TAX INVOICE & ELECTRICITY CONSUMPTION BILL
        ==================================================
        Consumer No: {account_no}
        Billing Period: Sep 01 - Sep 30, 2026
        Units Consumed: {units} kWh
        Total Current Amount Due: INR {amount:,.2f}
        Payment Due Date: {due_date}
        Late Payment Surcharge: INR 150.00
        Official Portal: www.torrentpower.com/quickpay
        ==================================================
        """
        ground_truth = {
            "document_type": "electricity_bill",
            "provider": provider,
            "amount": amount,
            "due_date": due_date,
            "units": units,
            "account_number": account_no
        }

    elif doc_type == "warranty":
        brand = random.choice(BRANDS)
        product = random.choice(PRODUCTS)
        serial = f"SN-{brand[:3].upper()}-{random.randint(100000, 999999)}"
        exp_year = random.choice([2027, 2028, 2029])
        exp_month = random.randint(1, 12)
        exp_day = random.randint(1, 28)
        expiry_date = f"{exp_year}-{exp_month:02d}-{exp_day:02d}"
        
        raw_text = f"""
        ==================================================
        OFFICIAL MANUFACTURER WARRANTY CERTIFICATE
        {brand}
        ==================================================
        Product: {product}
        Serial Number: {serial}
        Purchase Date: 2025-06-15
        Coverage Expiration Date: {expiry_date}
        Support Toll-Free: 1800-40-7267864
        ==================================================
        """
        ground_truth = {
            "document_type": "warranty",
            "brand": brand,
            "product": product,
            "serial_number": serial,
            "expiry_date": expiry_date
        }

    elif doc_type == "notice":
        issuer = random.choice(ISSUERS)
        amount = round(random.uniform(500.0, 15000.0), 2)
        due_month = random.randint(1, 12)
        due_day = random.randint(5, 28)
        deadline = f"2026-{due_month:02d}-{due_day:02d}"
        
        raw_text = f"""
        ==================================================
        {issuer.upper()}
        OFFICIAL STATUTORY NOTICE / ASSESSMENT DEMAND
        ==================================================
        Subject: Annual Property Tax Assessment FY 2026-27
        Demand Reference: MCD/REV/2026/88392
        Assessment Payable: INR {amount:,.2f}
        Compliance Deadline: {deadline}
        Notice is hereby served to settle before the due date to avoid penalty.
        ==================================================
        """
        ground_truth = {
            "document_type": "notice",
            "issuer": issuer,
            "subject": "Property Tax Assessment",
            "amount": amount,
            "deadline": deadline
        }
    else:
        # Generic receipt / subscription
        amount = round(random.uniform(299.0, 3999.0), 2)
        due_date = f"2026-11-{random.randint(10, 25):02d}"
        raw_text = f"Service invoice: Broadband 300Mbps Plan. Amount: INR {amount}. Renewal: {due_date}"
        ground_truth = {
            "document_type": doc_type,
            "amount": amount,
            "due_date": due_date
        }

    return {
        "id": f"doc_{idx:04d}",
        "raw_text": raw_text.strip(),
        "ground_truth": ground_truth
    }

def generate_dataset(num_samples: int = 1500, output_path: str = "eval/synthetic_dataset.json") -> List[Dict[str, Any]]:
    dataset = [generate_synthetic_record(i + 1) for i in range(num_samples)]
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)
    print(f"Generated {len(dataset)} synthetic benchmark documents at {output_path}")
    return dataset

if __name__ == "__main__":
    generate_dataset(1500)
