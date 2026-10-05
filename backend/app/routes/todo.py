from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import ActionItemModel, DocumentModel
from app.rules.urgency import calculate_urgency

router = APIRouter(prefix="/api/todo", tags=["todo"])

@router.get("")
async def get_categorized_todos(db: Session = Depends(get_db)):
    actions = db.query(ActionItemModel).all()
    
    do_now = []
    coming_up = []
    monitored = []
    completed = []

    for a in actions:
        # Re-evaluate urgency dynamically based on current date
        current_urgency = calculate_urgency(a.due_date) if a.due_date else a.urgency
        item = {
            "id": a.id,
            "document_id": a.document_id,
            "title": a.title,
            "description": a.description,
            "due_date": a.due_date,
            "amount": a.amount,
            "urgency": current_urgency,
            "status": a.status,
            "action_type": a.action_type,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }

        if a.status == "completed":
            completed.append(item)
        elif current_urgency in ["RED", "OVERDUE"]:
            do_now.append(item)
        elif current_urgency == "YELLOW":
            coming_up.append(item)
        else:
            monitored.append(item)

    return {
        "do_now": do_now,
        "coming_up": coming_up,
        "monitored": monitored,
        "completed": completed,
        "total_pending": len(do_now) + len(coming_up) + len(monitored)
    }

@router.patch("/{action_id}/toggle")
async def toggle_action_status(action_id: str, db: Session = Depends(get_db)):
    action = db.query(ActionItemModel).filter(ActionItemModel.id == action_id).first()
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Action item not found")

    action.status = "completed" if action.status == "pending" else "pending"
    db.commit()
    return {
        "status": "success",
        "action_id": action.id,
        "new_status": action.status
    }
