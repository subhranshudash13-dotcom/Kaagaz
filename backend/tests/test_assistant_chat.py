import asyncio
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.db import SessionLocal
from app.ai.smart_assistant import SmartVaultAssistant

def test_chat():
    db = SessionLocal()
    assistant = SmartVaultAssistant(db)

    test_queries = [
        "how are u doing",
        "why did my electricity bill increase?",
        "when does my washing machine warranty expire?",
        "what bills are due this month?",
        "what is my meter number?",
        "who are you and how do you protect my data?",
        "thank you so much!"
    ]

    print("=" * 60)
    print("TESTING SMART VAULT ASSISTANT CONVERSATION ENGINE")
    print("=" * 60)

    for q in test_queries:
        print(f"\n[USER]: {q}")
        ans, sources = assistant.generate_response(q)
        print(f"[ASSISTANT]:\n{ans.encode('ascii', 'backslashreplace').decode('ascii')}")
        print(f"[SOURCES]: {[s['document_title'] for s in sources]}")
        print("-" * 60)


    db.close()

if __name__ == "__main__":
    test_chat()
