from typing import Dict, Any, Optional

def compare_amounts(current_amount: Optional[float], previous_amount: Optional[float]) -> Dict[str, Any]:
    """Calculates financial delta deterministically without LLM guesswork."""
    if current_amount is None or previous_amount is None or previous_amount == 0:
        return {
            "has_comparison": False,
            "delta_amount": None,
            "percentage_change": None
        }

    delta = current_amount - previous_amount
    pct = (delta / previous_amount) * 100.0

    return {
        "has_comparison": True,
        "delta_amount": round(delta, 2),
        "percentage_change": round(pct, 2)
    }
