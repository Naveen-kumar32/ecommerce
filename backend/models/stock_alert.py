from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.sql import func

from database import Base


class StockAlert(Base):
    __tablename__ = "stock_alerts"
    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_stock_alert_user_product"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    notified = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
