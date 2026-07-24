from typing import Optional

from pydantic import BaseModel, ConfigDict


class SellerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    store_name: str
    description: Optional[str]


class SellerUpdate(BaseModel):
    store_name: str
    description: Optional[str] = None
