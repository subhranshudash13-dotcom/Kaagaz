from typing import Dict, Any, List
from app.rules.urgency import calculate_urgency

def build_action_items(doc_type: str, extracted_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generates actionable items deterministically from extracted facts."""
    actions = []

    if doc_type == "electricity_bill":
        due_date = extracted_data.get("due_date")
        amount = extracted_data.get("amount_due")
        provider = extracted_data.get("provider", "Electricity Provider")
        
        urgency = calculate_urgency(due_date)
        title = f"Pay {provider} bill" + (f" (₹{amount})" if amount else "")
        desc = f"Electricity bill due on {due_date if due_date else 'unspecified date'}."
        
        actions.append({
            "title": title,
            "description": desc,
            "due_date": due_date,
            "urgency": urgency,
            "action_type": "pay"
        })

    elif doc_type == "warranty":
        expiry_date = extracted_data.get("expiry_date")
        product = extracted_data.get("product", "Product")
        
        urgency = calculate_urgency(expiry_date)
        actions.append({
            "title": f"Warranty tracking for {product}",
            "description": f"Warranty expires on {expiry_date if expiry_date else 'unspecified date'}.",
            "due_date": expiry_date,
            "urgency": urgency,
            "action_type": "verify"
        })

    elif doc_type == "notice":
        deadline = extracted_data.get("deadline")
        subject = extracted_data.get("subject", "Notice Action")
        issuer = extracted_data.get("issuer", "Issuer")
        
        urgency = calculate_urgency(deadline)
        actions.append({
            "title": f"Respond to notice: {subject}",
            "description": f"Issued by {issuer}. Deadline: {deadline if deadline else 'unspecified'}.",
            "due_date": deadline,
            "urgency": urgency,
            "action_type": "respond"
        })

    return actions
