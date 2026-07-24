import base64
import re
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

DATA_URL_RE = re.compile(r"^data:(?P<mime>[\w/.+-]+);base64,(?P<data>.+)$", re.DOTALL)


class CategoryCreate(BaseModel):
    name: str


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class ProductCreate(BaseModel):
    name: str
    price: Decimal
    quantity: int = 0
    description: Optional[str] = None
    category_id: Optional[int] = None
    image_base64: Optional[str] = None  # data URL, e.g. "data:image/png;base64,...."

    @field_validator("quantity")
    @classmethod
    def quantity_not_negative(cls, value: int) -> int:
        if value < 0:
            raise ValueError("Quantity cannot be negative")
        return value

    @field_validator("price")
    @classmethod
    def price_not_negative(cls, value: Decimal) -> Decimal:
        if value < 0:
            raise ValueError("Price cannot be negative")
        return value


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    quantity: Optional[int] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    image_base64: Optional[str] = None


def parse_data_url(data_url: str) -> tuple[bytes, str]:
    match = DATA_URL_RE.match(data_url)

    if not match:
        raise ValueError("image_base64 must be a data URL (data:<mime>;base64,<data>)")

    return base64.b64decode(match.group("data")), match.group("mime")


class ProductShopOut(BaseModel):
    id: int
    name: str
    price: Decimal
    description: Optional[str]
    category_id: Optional[int]
    in_stock: bool
    has_image: bool


class ProductOwnerOut(ProductShopOut):
    quantity: int
    owner_type: str
    created_by: int
