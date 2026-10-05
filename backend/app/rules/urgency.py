from typing import Optional
from app.rules.dates import days_until

def calculate_urgency(due_date_str: Optional[str]) -> str:
    """
    Determines urgency category deterministically:
    - RED: <= 3 days remaining
    - YELLOW: 4 to 14 days remaining
    - GREEN: > 14 days remaining
    - OVERDUE: past due date (< 0 days)
    - UNKNOWN: missing due date
    """
    days = days_until(due_date_str)
    if days is None:
        return "UNKNOWN"
    if days < 0:
        return "OVERDUE"
    elif days <= 3:
        return "RED"
    elif days <= 14:
        return "YELLOW"
    else:
        return "GREEN"
