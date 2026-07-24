from pydantic import BaseModel, ConfigDict


class StockAlertCreate(BaseModel):
    product_id: int


class StockAlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    notified: bool
