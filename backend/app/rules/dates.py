from datetime import datetime, date
from typing import Optional

def parse_date(date_str: Optional[str]) -> Optional[date]:
    """Parses ISO YYYY-MM-DD or common date string representations into a Python date."""
    if not date_str:
        return None
    date_str = date_str.strip()
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y", "%d %b %Y", "%d %B %Y"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    return None

def days_until(target_date_str: Optional[str], current_date: Optional[date] = None) -> Optional[int]:
    """Calculates deterministic days remaining until target date."""
    target = parse_date(target_date_str)
    if not target:
        return None
    today = current_date or date.today()
    return (target - today).days
