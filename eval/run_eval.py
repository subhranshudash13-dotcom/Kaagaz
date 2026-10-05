import os
import json
import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.ai.ollama_gemma import OllamaGemmaProvider

async def run_evaluation():
    eval_dir = Path(__file__).resolve().parent
    docs_dir = eval_dir / "documents"
    expected_dir = eval_dir / "expected"

    provider = OllamaGemmaProvider()

    test_cases = [
        ("electricity_bill_01.txt", "electricity_bill_01.json", "electricity_bill"),
        ("warranty_01.txt", "warranty_01.json", "warranty"),
        ("notice_01.txt", "notice_01.json", "notice")
    ]

    print("==================================================")
    print("KAAGAZ MODEL EXTRACTION BENCHMARK & EVALUATION")
    print("==================================================")

    total_fields_tested = 0
    passed_fields = 0

    for doc_file, exp_file, doc_type in test_cases:
        doc_path = docs_dir / doc_file
        exp_path = expected_dir / exp_file

        with open(doc_path, "r", encoding="utf-8") as f:
            raw_text = f.read()

        with open(exp_path, "r", encoding="utf-8") as f:
            expected_data = json.load(f)

        extracted = await provider.extract_document(raw_text, doc_type)
        print(f"\n[Test Document]: {doc_file} (Type: {doc_type})")

        for key, exp_val in expected_data.items():
            total_fields_tested += 1
            act_val = extracted.get(key)

            # Type-tolerant comparison
            match = False
            if act_val is not None:
                if str(act_val).strip().lower() == str(exp_val).strip().lower():
                    match = True
                elif isinstance(exp_val, (int, float)):
                    try:
                        if float(act_val) == float(exp_val):
                            match = True
                    except (ValueError, TypeError):
                        pass

            if match:
                passed_fields += 1
                print(f"  [PASS] {key}: Expected '{exp_val}' | Got '{act_val}'")
            else:
                print(f"  [FLAG] {key}: Expected '{exp_val}' | Got '{act_val}'")

    accuracy = (passed_fields / total_fields_tested) * 100 if total_fields_tested > 0 else 0
    print("\n--------------------------------------------------")
    print(f"EVALUATION SUMMARY: {passed_fields}/{total_fields_tested} fields matched ({accuracy:.1f}% accuracy)")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_evaluation())
