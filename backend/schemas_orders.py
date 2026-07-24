from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

ORDER_STATUSES = [
    "placed",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
    "returned",
    "replaced",
]


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    is_default: bool = False


class AddressOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    phone: str
    line1: str
    line2: Optional[str]
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool


class PaymentMethodCreate(BaseModel):
    method_type: str  # "upi" | "card"
    vpa: Optional[str] = None
    card_number: Optional[str] = None
    card_holder_name: Optional[str] = None
    is_default: bool = False

    @field_validator("method_type")
    @classmethod
    def valid_method_type(cls, value: str) -> str:
        if value not in ("upi", "card"):
            raise ValueError("method_type must be 'upi' or 'card'")
        return value


class PaymentMethodOut(BaseModel):
    id: int
    method_type: str
    display_label: str
    is_default: bool


class BuyNowItem(BaseModel):
    product_id: int
    quantity: int = 1


class CheckoutSummaryRequest(BaseModel):
    buy_now: Optional[BuyNowItem] = None


class CheckoutSummaryItem(BaseModel):
    product_id: int
    name: str
    price: Decimal
    quantity: int
    line_total: Decimal


class CheckoutSummaryOut(BaseModel):
    items: list[CheckoutSummaryItem]
    total_amount: Decimal
    has_address: bool
    has_payment_method: bool


class CheckoutCreateOrderRequest(BaseModel):
    address_id: int
    buy_now: Optional[BuyNowItem] = None


class CheckoutCreateOrderOut(BaseModel):
    razorpay_order_id: str
    razorpay_key_id: str
    amount: int  # paise, as Razorpay Checkout expects
    currency: str
    total_amount: Decimal


class CheckoutVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    address_id: int
    payment_method_id: Optional[int] = None
    buy_now: Optional[BuyNowItem] = None


class OrderItemOut(BaseModel):
    product_id: int
    product_name_snapshot: str
    quantity: int
    price_at_purchase: Decimal


class OrderOut(BaseModel):
    id: int
    status: str
    total_amount: Decimal
    payment_id: Optional[str]
    created_at: datetime
    items: list[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def valid_status(cls, value: str) -> str:
        if value not in ORDER_STATUSES:
            raise ValueError(f"status must be one of {ORDER_STATUSES}")
        return value
