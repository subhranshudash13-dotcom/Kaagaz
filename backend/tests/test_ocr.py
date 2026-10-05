import pytest
import asyncio
from pathlib import Path
from PIL import Image, ImageDraw
from app.extraction.ocr_engine import ocr_engine
from app.extraction.extractor import DocumentExtractor

@pytest.mark.asyncio
async def test_ocr_engine_on_synthetic_image(tmp_path):
    # 1. Create a synthetic bill image
    img_path = tmp_path / "test_bill.png"
    img = Image.new("RGB", (700, 300), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.text((20, 20), "Torrent Power Limited\nConsumer No: 112233\nAmount Due: 2500.00\nDue Date: 2026-10-10", fill=(0, 0, 0))
    img.save(str(img_path))

    # 2. Process with OCR engine
    result = await ocr_engine.process_file(img_path, ".png")
    assert result["status"] in ["OCR_SUCCESS", "OCR_LOW_CONFIDENCE"]
    assert len(result["text"]) > 0
    assert result["source_type"] == "image"
    assert "torrent" in result["text"].lower() or "power" in result["text"].lower() or "112233" in result["text"]

@pytest.mark.asyncio
async def test_ocr_engine_on_text_file(tmp_path):
    txt_path = tmp_path / "test_notice.txt"
    txt_path.write_text("Municipal Corporation Property Tax Notice\nAmount: 4500.00\nDeadline: 2026-10-20", encoding="utf-8")

    result = await ocr_engine.process_file(txt_path, ".txt")
    assert result["status"] == "OCR_SUCCESS"
    assert "4500" in result["text"]
    assert result["source_type"] == "text_file"

@pytest.mark.asyncio
async def test_document_extractor_integration(tmp_path):
    txt_path = tmp_path / "warranty.txt"
    txt_path.write_text("Samsung Electronics Smart Washing Machine\nModel: Inverter Front Load\nSerial: WM-2026-991823\nPurchase Date: 2026-05-10\nWarranty: 24 Months", encoding="utf-8")

    extractor = DocumentExtractor()
    doc_type, conf, reason, extracted, facts, issues, raw_text = await extractor.process_document(txt_path, ".txt")
    assert doc_type == "warranty"
    assert len(facts) >= 3
    assert conf > 0.6
