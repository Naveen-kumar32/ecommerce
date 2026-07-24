import logging

from sqlalchemy.orm import Session

from models.stock_alert import StockAlert
from models.user import User

logger = logging.getLogger("notifications")


def notify_stock_subscribers(db: Session, product) -> None:
    alerts = (
        db.query(StockAlert)
        .filter(StockAlert.product_id == product.id, StockAlert.notified.is_(False))
        .all()
    )

    if not alerts:
        return

    for alert in alerts:
        user = db.query(User).filter(User.id == alert.user_id).first()
        recipient = user.email if user else f"user #{alert.user_id}"
        logger.info("[stock-alert] %s is back in stock — notifying %s", product.name, recipient)
        alert.notified = True

    db.commit()
