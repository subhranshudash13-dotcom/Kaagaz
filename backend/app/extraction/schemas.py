from pydantic import BaseModel, Field
from typing import Optional, List, Union

class ElectricityBillSchema(BaseModel):
    provider: Optional[str] = Field(None, description="Name of the utility provider")
    account_reference: Optional[str] = Field(None, description="Account or Consumer Number")
    billing_period_start: Optional[str] = Field(None, description="Start date of billing period")
    billing_period_end: Optional[str] = Field(None, description="End date of billing period")
    issue_date: Optional[str] = Field(None, description="Bill issue date")
    due_date: Optional[str] = Field(None, description="Payment due date")
    amount_due: Optional[Union[float, int]] = Field(None, description="Current total amount due")
    previous_amount: Optional[Union[float, int]] = Field(None, description="Previous bill amount")
    units_consumed: Optional[Union[float, int]] = Field(None, description="Electricity units consumed")
    meter_number: Optional[str] = Field(None, description="Meter identification number")
    service_address: Optional[str] = Field(None, description="Address where service is provided")


class WarrantySchema(BaseModel):
    product: Optional[str] = Field(None, description="Name of product")
    brand: Optional[str] = Field(None, description="Brand or manufacturer")
    model: Optional[str] = Field(None, description="Model number or name")
    serial_number: Optional[str] = Field(None, description="Serial number of product")
    purchase_date: Optional[str] = Field(None, description="Date of purchase")
    warranty_months: Optional[int] = Field(None, description="Warranty duration in months")
    expiry_date: Optional[str] = Field(None, description="Warranty expiration date")
    seller: Optional[str] = Field(None, description="Store or seller name")
    service_contact: Optional[str] = Field(None, description="Service center phone or email")
    invoice_reference: Optional[str] = Field(None, description="Invoice or order number")


class NoticeSchema(BaseModel):
    issuer: Optional[str] = Field(None, description="Organization or body issuing the notice")
    notice_date: Optional[str] = Field(None, description="Date of notice")
    subject: Optional[str] = Field(None, description="Topic or subject of notice")
    deadline: Optional[str] = Field(None, description="Action or response deadline")
    amount: Optional[Union[float, int]] = Field(None, description="Amount required to be paid if applicable")
    required_documents: Optional[List[str]] = Field(default_factory=list, description="Documents required")
    contact_information: Optional[str] = Field(None, description="Contact phone/email/address")
    instructions: Optional[str] = Field(None, description="Specific instructions or next steps")
