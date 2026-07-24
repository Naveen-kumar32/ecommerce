from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user, require_roles
from models.order import Order, OrderItem
from models.user import User
from schemas_orders import OrderItemOut, OrderOut, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["Orders"])


def to_order_out(db: Session, order: Order) -> OrderOut:
    order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    return OrderOut(
        id=order.id,
        status=order.status,
        total_amount=order.total_amount,
        payment_id=order.payment_id,
        created_at=order.created_at,
        items=[
            OrderItemOut(
                product_id=item.product_id,
                product_name_snapshot=item.product_name_snapshot,
                quantity=item.quantity,
                price_at_purchase=item.price_at_purchase,
            )
            for item in order_items
        ],
    )


@router.get("", response_model=list[OrderOut])
def list_my_orders(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()
    return [to_order_out(db, order) for order in orders]


@router.get("/admin/all", response_model=list[OrderOut])
def list_all_orders(db: Session = Depends(get_db), _user: User = Depends(require_roles("admin"))):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [to_order_out(db, order) for order in orders]


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order or (order.user_id != user.id and user.role != "admin"):
        raise HTTPException(status_code=404, detail="Order not found")

    return to_order_out(db, order)


@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles("admin")),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return to_order_out(db, order)
