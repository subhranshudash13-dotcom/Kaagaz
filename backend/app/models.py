import datetime
import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

def get_utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    doc_type = Column(String, nullable=True) # electricity_bill, warranty, notice, etc.
    title = Column(String, nullable=True)
    status = Column(String, default="provisional") # provisional, confirmed, archived
    ocr_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    facts = relationship("FactModel", back_populates="document", cascade="all, delete-orphan")
    actions = relationship("ActionItemModel", back_populates="document", cascade="all, delete-orphan")
    comparisons = relationship("ComparisonModel", foreign_keys="[ComparisonModel.document_id]", back_populates="document", cascade="all, delete-orphan")


class FactModel(Base):
    __tablename__ = "facts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    field_name = Column(String, nullable=False)
    raw_value = Column(String, nullable=True)
    normalized_value = Column(String, nullable=True)
    confidence = Column(Float, default=1.0)
    user_confirmed = Column(Boolean, default=False)
    source_page = Column(Integer, default=1)
    created_at = Column(DateTime, default=get_utc_now)

    document = relationship("DocumentModel", back_populates="facts")


class ActionItemModel(Base):
    __tablename__ = "action_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(String, nullable=True) # ISO date string YYYY-MM-DD
    amount = Column(Float, nullable=True)
    urgency = Column(String, nullable=False) # RED, YELLOW, GREEN, OVERDUE, UNKNOWN
    status = Column(String, default="pending") # pending, completed
    action_type = Column(String, nullable=False) # pay, renew, respond, verify
    created_at = Column(DateTime, default=get_utc_now)

    document = relationship("DocumentModel", back_populates="actions")


class ComparisonModel(Base):
    __tablename__ = "comparisons"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    previous_document_id = Column(String, ForeignKey("documents.id"), nullable=True)
    metric_name = Column(String, nullable=False) # amount_due, units_consumed, etc.
    current_value = Column(Float, nullable=False)
    previous_value = Column(Float, nullable=False)
    delta_value = Column(Float, nullable=False)
    percentage_change = Column(Float, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)

    document = relationship("DocumentModel", foreign_keys=[document_id], back_populates="comparisons")
