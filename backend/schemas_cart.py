from decimal import Decimal

from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(ge=1)


class CartItemOut(BaseModel):
    id: int
    product_id: int
    name: str
    price: Decimal
    quantity: int
    in_stock: bool
    has_image: bool
    available_quantity: int


class CartOut(BaseModel):
    items: list[CartItemOut]
    total_count: int
    subtotal: Decimal
