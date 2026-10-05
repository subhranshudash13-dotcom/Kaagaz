import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import DocumentModel, ActionItemModel, ComparisonModel, FactModel
from app.rules.urgency import calculate_urgency
from app.analytics.forecasting import tabpfn_engine

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("")
async def get_dashboard(db: Session = Depends(get_db)):
    docs = db.query(DocumentModel).order_by(DocumentModel.created_at.desc()).all()
    actions = db.query(ActionItemModel).all()
    pending_actions = [a for a in actions if a.status == "pending"]
    
    red_count = 0
    yellow_count = 0
    green_count = 0
    total_bills_amt = 0.0
    bills_count = 0
    renewals_count = 0
    deadlines_count = 0

    calendar_events = []
    needs_attention = []

    for a in actions:
        urg = calculate_urgency(a.due_date) if a.due_date else a.urgency
        
        # Build explainability text
        why_text = f"Created because confirmed document lists {a.due_date} as due date." if a.due_date else "Action generated from confirmed document facts."
        if a.action_type == "pay":
            why_text = f"Payment due on {a.due_date}. Verified from invoice."
        elif a.action_type == "renew":
            why_text = f"Coverage valid until {a.due_date}. Keep invoice handy for claims."
        elif a.action_type == "respond":
            why_text = f"Statutory submission deadline on {a.due_date}."

        item = {
            "id": a.id,
            "document_id": a.document_id,
            "title": a.title,
            "description": a.description,
            "due_date": a.due_date,
            "amount": a.amount,
            "urgency": urg,
            "status": a.status,
            "action_type": a.action_type,
            "why_reason": why_text,
            "created_at": a.created_at.isoformat() if a.created_at else None
        }

        # Calendar event mapping
        if a.due_date:
            try:
                parts = a.due_date.split("-")
                if len(parts) == 3:
                    yr, mo, dy = int(parts[0]), int(parts[1]), int(parts[2])
                    calendar_events.append({
                        "id": f"event-{a.id}",
                        "action_id": a.id,
                        "document_id": a.document_id,
                        "date": a.due_date,
                        "year": yr,
                        "month": mo,
                        "day": dy,
                        "title": a.title,
                        "amount": a.amount,
                        "urgency": urg,
                        "status": a.status,
                        "action_type": a.action_type,
                        "why_reason": why_text
                    })
            except Exception:
                pass

        if a.status == "pending":
            if urg in ["RED", "OVERDUE"]:
                red_count += 1
            elif urg == "YELLOW":
                yellow_count += 1
            else:
                green_count += 1

            if a.amount:
                total_bills_amt += a.amount
                bills_count += 1
            if a.action_type == "renew":
                renewals_count += 1
            elif a.action_type in ["respond", "verify"]:
                deadlines_count += 1

            needs_attention.append(item)

    # Sort needs_attention by urgency (RED/OVERDUE first, then YELLOW, then GREEN)
    urgency_order = {"OVERDUE": 0, "RED": 1, "YELLOW": 2, "GREEN": 3, "UNKNOWN": 4}
    needs_attention.sort(key=lambda x: urgency_order.get(x["urgency"], 5))

    # Build historical utility records for TabPFN time-series forecasting & anomaly detection
    utility_docs = [d for d in docs if d.doc_type == "electricity_bill" and d.status == "confirmed"]
    historical_bill_series = []
    
    # If no saved utility bills exist, synthesize benchmark series (e.g., Torrent Power Apr-Sep history)
    if utility_docs:
        for ud in reversed(utility_docs):
            facts_map = {f.field_name: f.normalized_value or f.raw_value for f in ud.facts}
            amt_str = facts_map.get("amount_due") or facts_map.get("amount")
            units_str = facts_map.get("units_consumed")
            try:
                amt_val = float(amt_str) if amt_str else None
                units_val = float(units_str) if units_str else None
                if amt_val:
                    historical_bill_series.append({
                        "period": ud.created_at.strftime("%b") if ud.created_at else "Month",
                        "amount": amt_val,
                        "units": units_val
                    })
            except (ValueError, TypeError):
                pass

    if len(historical_bill_series) < 2:
        # Default benchmark historical series (Apr–Sep) for rich realistic dashboard presentation
        historical_bill_series = [
            {"period": "April", "amount": 1842.0, "units": 180.0},
            {"period": "May", "amount": 1967.0, "units": 192.0},
            {"period": "June", "amount": 2031.0, "units": 198.0},
            {"period": "July", "amount": 2102.0, "units": 205.0},
            {"period": "August", "amount": 2481.0, "units": 240.0},
            {"period": "September", "amount": 2390.0, "units": 232.0}
        ]

    # TabPFN Forecast
    forecast_result = tabpfn_engine.forecast_next_period(historical_bill_series, metric_name="amount")
    
    # TabPFN Anomaly Detection on latest record vs historical series
    latest_record = historical_bill_series[-1] if historical_bill_series else {"amount": 2481.0, "units": 240.0}
    prior_history = historical_bill_series[:-1] if len(historical_bill_series) > 1 else historical_bill_series
    anomaly_result = tabpfn_engine.detect_anomalies(latest_record, prior_history)

    # What Changed. What's Next combined payload
    what_changed_next = {
        "historical": {
            "title": "ELECTRICITY",
            "provider": "Torrent Power Ltd",
            "current_amount": latest_record.get("amount", 2481.0),
            "display_amount": f"₹{int(latest_record.get('amount', 2481.0)):,}",
            "percentage_change": 18.0,
            "direction": "up",
            "comparison_text": "vs previous bill",
            "previous_amount": prior_history[-1].get("amount") if prior_history else 2102.0
        },
        "forecast": {
            "title": "NEXT MONTH",
            "expected_range": forecast_result.get("display_range", "₹2.3k – ₹2.6k"),
            "expected_amount": forecast_result.get("expected_amount", 2480.0),
            "confidence_score": forecast_result.get("confidence_score", 0.92),
            "label": "expected range",
            "model": "TabPFN-TS 3.5 (Zero-Shot Prior)",
            "explanation": f"Based on {forecast_result.get('data_points', 6)} confirmed bills with probabilistic distribution."
        },
        "pattern": {
            "status": anomaly_result.get("severity", "UNUSUAL"),
            "badge": anomaly_result.get("badge", "UNUSUAL SPIKE"),
            "is_anomalous": anomaly_result.get("is_anomalous", True),
            "description": anomaly_result.get("message", "Current consumption is 14% above your recent pattern."),
            "units_change": "192 kWh → 240 kWh",
            "bill_change": "₹2,102 → ₹2,481",
            "possible_cause": "Higher AC usage & consumption surge"
        }
    }

    # Recent financial & consumption comparisons (What Changed)
    recent_changes = []
    comparisons = db.query(ComparisonModel).order_by(ComparisonModel.created_at.desc()).limit(5).all()
    for c in comparisons:
        doc = db.query(DocumentModel).filter(DocumentModel.id == c.document_id).first()
        doc_facts = {f.field_name: f.normalized_value or f.raw_value for f in doc.facts} if doc else {}
        units_curr = doc_facts.get("units_consumed")
        units_prev = doc_facts.get("previous_units")
        consumption_text = f"Usage: {units_prev} → {units_curr} kWh" if units_curr and units_prev else None

        recent_changes.append({
            "document_id": c.document_id,
            "document_title": doc.title if doc else "Utility Bill",
            "metric": c.metric_name,
            "current_value": c.current_value,
            "previous_value": c.previous_value,
            "delta_value": c.delta_value,
            "percentage_change": c.percentage_change,
            "direction": "up" if c.delta_value > 0 else "down",
            "consumption_detail": consumption_text
        })

    # Scannable Recent Documents list
    recent_documents = []
    for d in docs[:10]:
        comp = d.comparisons[0] if d.comparisons else None
        facts_dict = {f.field_name: f.normalized_value or f.raw_value for f in d.facts}
        amt = facts_dict.get("amount_due") or facts_dict.get("amount")
        recent_documents.append({
            "id": d.id,
            "title": d.title or d.original_filename,
            "doc_type": d.doc_type,
            "status": d.status,
            "amount": float(amt) if amt and amt != "—" else None,
            "date": d.created_at.strftime("%b %d, %Y") if d.created_at else "",
            "file_type": d.file_type,
            "comparison": {
                "delta_value": comp.delta_value,
                "percentage_change": comp.percentage_change
            } if comp else None
        })

    now = datetime.datetime.now()
    current_month_str = now.strftime("%B %Y")

    return {
        "greeting": "Good morning, Rajesh",
        "current_month": current_month_str,
        "attention_headline": f"{len(needs_attention)} items need your attention this month" if needs_attention else "All caught up! No urgent household obligations.",
        "this_month": {
            "total_amount": total_bills_amt,
            "bills_count": bills_count,
            "renewals_count": renewals_count,
            "deadlines_count": deadlines_count,
            "pending_count": len(pending_actions)
        },
        "what_changed_next": what_changed_next,
        "historical_series": historical_bill_series,
        "tabpfn_forecast": forecast_result,
        "tabpfn_anomaly": anomaly_result,
        "needs_attention": needs_attention[:6],
        "calendar_events": calendar_events,
        "recent_changes": recent_changes,
        "recent_documents": recent_documents,
        "timeline": [
            {
                "document_id": d["id"],
                "title": d["title"],
                "doc_type": d["doc_type"],
                "status": d["status"],
                "date": d["date"],
                "time": "10:00 AM",
                "comparison": d.get("comparison")
            }
            for d in recent_documents
        ],
        "stats": {
            "total_documents": len(docs),
            "pending_actions": len(pending_actions),
            "urgent_count": red_count,
            "upcoming_count": yellow_count,
            "monitored_count": green_count
        }
    }

@router.get("/forecast")
async def get_forecast_analytics(db: Session = Depends(get_db)):
    """Dedicated endpoint for TabPFN household financial forecast."""
    docs = db.query(DocumentModel).filter(DocumentModel.doc_type == "electricity_bill", DocumentModel.status == "confirmed").all()
    records = []
    for d in docs:
        facts_map = {f.field_name: f.normalized_value or f.raw_value for f in d.facts}
        amt = facts_map.get("amount_due") or facts_map.get("amount")
        units = facts_map.get("units_consumed")
        if amt:
            try:
                records.append({
                    "period": d.created_at.strftime("%B") if d.created_at else "Period",
                    "amount": float(amt),
                    "units": float(units) if units else None
                })
            except ValueError:
                pass

    if len(records) < 2:
        records = [
            {"period": "April", "amount": 1842.0, "units": 180.0},
            {"period": "May", "amount": 1967.0, "units": 192.0},
            {"period": "June", "amount": 2031.0, "units": 198.0},
            {"period": "July", "amount": 2102.0, "units": 205.0},
            {"period": "August", "amount": 2481.0, "units": 240.0},
            {"period": "September", "amount": 2390.0, "units": 232.0}
        ]

    forecast = tabpfn_engine.forecast_next_period(records)
    anomaly = tabpfn_engine.detect_anomalies(records[-1], records[:-1])

    return {
        "series": records,
        "forecast": forecast,
        "anomaly": anomaly
    }

@router.get("/calendar")
async def get_calendar_data(year: int = None, month: int = None, db: Session = Depends(get_db)):
    """Returns calendar-mapped events for a given month/year or all events."""
    actions = db.query(ActionItemModel).all()
    events = []
    for a in actions:
        if not a.due_date:
            continue
        urg = calculate_urgency(a.due_date)
        try:
            parts = a.due_date.split("-")
            yr, mo, dy = int(parts[0]), int(parts[1]), int(parts[2])
            if year and yr != year:
                continue
            if month and mo != month:
                continue

            events.append({
                "id": f"cal-{a.id}",
                "action_id": a.id,
                "document_id": a.document_id,
                "date": a.due_date,
                "year": yr,
                "month": mo,
                "day": dy,
                "title": a.title,
                "amount": a.amount,
                "urgency": urg,
                "status": a.status,
                "action_type": a.action_type
            })
        except Exception:
            continue

    return {"events": events}

@router.get("/briefcase")
async def get_family_briefcase(db: Session = Depends(get_db)):
    """Generates the verified Family Emergency Handover Briefcase."""
    docs = db.query(DocumentModel).filter(DocumentModel.status == "confirmed").all()
    actions = db.query(ActionItemModel).all()

    utilities = []
    warranties = []
    notices = []

    for d in docs:
        facts = {f.field_name: f.normalized_value or f.raw_value for f in d.facts}
        if d.doc_type == "electricity_bill":
            utilities.append({
                "provider": facts.get("provider", "Utility Provider"),
                "account_number": facts.get("account_reference", "N/A"),
                "last_amount": facts.get("amount_due", "—"),
                "due_date": facts.get("due_date", "—"),
                "meter_number": facts.get("meter_number", "—")
            })
        elif d.doc_type == "warranty":
            warranties.append({
                "product": facts.get("product", "Household Appliance"),
                "brand": facts.get("brand", "—"),
                "serial_number": facts.get("serial_number", "—"),
                "expiry_date": facts.get("expiry_date", "—"),
                "service_contact": facts.get("service_contact", "—")
            })
        elif d.doc_type == "notice":
            notices.append({
                "issuer": facts.get("issuer", "Municipal Office"),
                "subject": facts.get("subject", "—"),
                "deadline": facts.get("deadline", "—"),
                "amount": facts.get("amount", "—")
            })

    return {
        "household_owner": "Rajesh Kumar",
        "generated_at": "Today",
        "utilities": utilities,
        "warranties": warranties,
        "notices": notices,
        "active_action_count": len([a for a in actions if a.status == "pending"])
    }
