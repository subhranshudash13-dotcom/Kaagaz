import re
from typing import Dict, Any, List

def validate_extraction(doc_type: str, data: Dict[str, Any]) -> List[str]:
    """
    Validates extracted fields according to document type contracts.
    Does NOT hallucinate or auto-fix missing/uncertain fields.
    Returns a list of warning messages / validation flags.
    """
    issues = []

    if doc_type == "electricity_bill":
        if not data.get("provider"):
            issues.append("Missing provider name.")
        if not data.get("due_date"):
            issues.append("Missing due date on electricity bill.")
        if data.get("amount_due") is None:
            issues.append("Missing total amount due.")
        elif isinstance(data.get("amount_due"), (int, float)) and data["amount_due"] < 0:
            issues.append("Amount due is negative, which may indicate a credit or parsing error.")

    elif doc_type == "warranty":
        if not data.get("product"):
            issues.append("Missing product name.")
        if not data.get("purchase_date") and not data.get("expiry_date"):
            issues.append("Missing both purchase date and expiry date for warranty.")

    elif doc_type == "notice":
        if not data.get("issuer"):
            issues.append("Missing issuer organization.")
        if not data.get("subject"):
            issues.append("Missing notice subject.")

    # Generic date sanity validation across all extracted string fields
    date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")
    for key, val in data.items():
        if "date" in key or key == "deadline":
            if val and isinstance(val, str):
                if not date_pattern.match(val):
                    issues.append(f"Field '{key}' has raw date format '{val}'. Needs ISO normalization.")

    return issues
