import asyncio
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.extraction.ocr_engine import ocr_engine
from app.extraction.extractor import DocumentExtractor

async def run_ocr_test():
    print("=" * 60)
    print("KAAGAZ HIGH-FIDELITY OCR & EXTRACTION ENGINE TEST")
    print("=" * 60)

    # 1. Create a synthetic realistic Torrent Power electricity bill image
    width, height = 1000, 1200
    img = Image.new("RGB", (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Header border
    draw.rectangle([(40, 40), (960, 1160)], outline=(30, 41, 59), width=3)
    draw.rectangle([(40, 40), (960, 140)], fill=(241, 245, 249), outline=(30, 41, 59), width=2)

    # Text lines
    lines = [
        (60, 60, "TORRENT POWER LIMITED - ELECTRICITY CONSUMPTION BILL"),
        (60, 100, "Tax Invoice & Statutory Notice | ISO 9001:2015 Certified"),
        (60, 170, "Consumer Number: CN-8822019"),
        (60, 210, "Consumer Name: Rajesh Kumar"),
        (60, 250, "Service Address: 42 Palm Avenue, Ground Floor, Mumbai"),
        (60, 290, "Meter Number: MTR-9821-X"),
        (60, 350, "Billing Period: 01/09/2026 to 30/09/2026"),
        (60, 390, "Issue Date: 2026-10-01"),
        (60, 430, "Due Date: 2026-10-18"),
        (60, 500, "Units Consumed: 340 kWh"),
        (60, 540, "Tariff Category: Residential Single Phase (LT-1)"),
        (60, 610, "Energy Charges: Rs 1950.00"),
        (60, 650, "Fixed Charges: Rs 250.00"),
        (60, 690, "Electricity Duty & Fuel Surcharge: Rs 281.00"),
        (60, 750, "Previous Bill Amount: Rs 2100.00"),
        (60, 810, "Total Net Amount Payable: Rs 2481.00"),
        (60, 890, "IMPORTANT NOTICE:"),
        (60, 930, "Please pay on or before 2026-10-18 to avoid 2% late payment surcharge."),
        (60, 970, "Official Portal: https://connect.torrentpower.com"),
        (60, 1010, "24x7 Customer Helpline: 19122 / 079-22551912"),
    ]

    for x, y, text in lines:
        draw.text((x, y), text, fill=(15, 23, 42))

    sample_dir = BASE_DIR.parent / "samples" / "electricity_bill"
    sample_dir.mkdir(parents=True, exist_ok=True)
    sample_bill_path = sample_dir / "torrent_power_bill_test.png"
    img.save(sample_bill_path)
    print(f"Generated realistic test bill at: {sample_bill_path}")

    # 2. Test OCREngine process_file directly
    print("\n--- Running Multi-Pass OCR on Image ---")
    ocr_res = await ocr_engine.process_file(sample_bill_path, ".png")
    print(f"OCR Status: {ocr_res['status']}")
    print(f"OCR Confidence: {ocr_res['confidence']}")
    print(f"Processing Time: {ocr_res['processing_time_ms']} ms")
    print(f"Extracted Character Count: {len(ocr_res['text'])}")
    print("\nOCR Raw Output Snippet:")
    print("-" * 40)
    print(ocr_res['text'][:600])
    print("-" * 40)

    # 3. Test Full DocumentExtractor Pipeline
    print("\n--- Running Full End-to-End Extraction Pipeline ---")
    extractor = DocumentExtractor()
    doc_type, conf, reason, data, facts, issues, raw_text, ocr_full = await extractor.process_document(sample_bill_path, ".png")
    print(f"Classified Doc Type: {doc_type} (Confidence: {conf})")
    print(f"OCR Engine Used: {ocr_full.get('engine_used')}")

    print(f"Reason: {reason}")
    print("\nExtracted Structured Fields:")
    for k, v in data.items():
        print(f"  • {k}: {v}")
    print(f"\nFacts count: {len(facts)}")
    print(f"Validation Issues: {issues}")

if __name__ == "__main__":
    asyncio.run(run_ocr_test())
