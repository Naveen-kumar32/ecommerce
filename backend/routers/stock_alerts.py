from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
from models.product import Product
from models.stock_alert import StockAlert
from models.user import User
from schemas_stock_alerts import StockAlertCreate, StockAlertOut

router = APIRouter(prefix="/stock-alerts", tags=["Stock Alerts"])


@router.get("/mine", response_model=list[StockAlertOut])
def list_my_alerts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(StockAlert).filter(StockAlert.user_id == user.id).all()


@router.post("", response_model=StockAlertOut, status_code=201)
def create_alert(
    payload: StockAlertCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == payload.product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(StockAlert)
        .filter(StockAlert.user_id == user.id, StockAlert.product_id == payload.product_id)
        .first()
    )

    if existing:
        existing.notified = False
        db.commit()
        db.refresh(existing)
        return existing

    alert = StockAlert(user_id=user.id, product_id=payload.product_id)
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.delete("/{product_id}", status_code=204)
def delete_alert(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    alert = (
        db.query(StockAlert)
        .filter(StockAlert.user_id == user.id, StockAlert.product_id == product_id)
        .first()
    )

    if alert:
        db.delete(alert)
        db.commit()
