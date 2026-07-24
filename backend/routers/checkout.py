from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from config import RAZORPAY_KEY_ID
from database import get_db
from deps import get_current_user
from models.address import Address
from models.cart import CartItem
from models.order import Order, OrderItem
from models.payment_method import PaymentMethod
from models.product import Product
from models.user import User
from schemas_orders import (
    CheckoutCreateOrderOut,
    CheckoutCreateOrderRequest,
    CheckoutSummaryItem,
    CheckoutSummaryOut,
    CheckoutSummaryRequest,
    CheckoutVerifyRequest,
    OrderItemOut,
    OrderOut,
)
from services import payment_gateway
from services.email_service import send_invoice_email

router = APIRouter(prefix="/checkout", tags=["Checkout"])


def resolve_line_items(db: Session, user: User, buy_now) -> list[tuple[Product, int]]:
    if buy_now:
        product = db.query(Product).filter(Product.id == buy_now.product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        return [(product, buy_now.quantity)]

    cart_rows = db.query(CartItem).filter(CartItem.user_id == user.id).all()

    if not cart_rows:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    line_items = []
    for row in cart_rows:
        product = db.query(Product).filter(Product.id == row.product_id).first()
        if product:
            line_items.append((product, row.quantity))

    return line_items


@router.post("/summary", response_model=CheckoutSummaryOut)
def checkout_summary(
    payload: CheckoutSummaryRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    line_items = resolve_line_items(db, user, payload.buy_now)

    items = [
        CheckoutSummaryItem(
            product_id=product.id,
            name=product.name,
            price=product.price,
            quantity=quantity,
            line_total=product.price * quantity,
        )
        for product, quantity in line_items
    ]
    total_amount = sum((item.line_total for item in items), start=items[0].line_total * 0) if items else 0

    has_address = db.query(Address).filter(Address.user_id == user.id).first() is not None
    has_payment_method = (
        db.query(PaymentMethod).filter(PaymentMethod.user_id == user.id).first() is not None
    )

    return CheckoutSummaryOut(
        items=items,
        total_amount=total_amount,
        has_address=has_address,
        has_payment_method=has_payment_method,
    )


@router.post("/create-order", response_model=CheckoutCreateOrderOut)
def create_order(
    payload: CheckoutCreateOrderRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    address = db.query(Address).filter(Address.id == payload.address_id, Address.user_id == user.id).first()
    if not address:
        raise HTTPException(status_code=400, detail="Address not found")

    line_items = resolve_line_items(db, user, payload.buy_now)

    for product, quantity in line_items:
        if quantity > product.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")

    total_amount = sum(product.price * quantity for product, quantity in line_items)

    try:
        gateway_order = payment_gateway.create_order(total_amount)
    except payment_gateway.PaymentGatewayError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return CheckoutCreateOrderOut(
        razorpay_order_id=gateway_order["id"],
        razorpay_key_id=RAZORPAY_KEY_ID,
        amount=gateway_order["amount"],
        currency=gateway_order["currency"],
        total_amount=total_amount,
    )


@router.post("/verify-payment", response_model=OrderOut)
def verify_payment(
    payload: CheckoutVerifyRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    address = db.query(Address).filter(Address.id == payload.address_id, Address.user_id == user.id).first()
    if not address:
        raise HTTPException(status_code=400, detail="Address not found")

    payment_method_id = None
    if payload.payment_method_id is not None:
        payment_method = (
            db.query(PaymentMethod)
            .filter(PaymentMethod.id == payload.payment_method_id, PaymentMethod.user_id == user.id)
            .first()
        )
        payment_method_id = payment_method.id if payment_method else None

    try:
        gateway_payment = payment_gateway.verify_payment(
            payload.razorpay_order_id, payload.razorpay_payment_id, payload.razorpay_signature
        )
    except payment_gateway.PaymentGatewayError as exc:
        raise HTTPException(status_code=402, detail=str(exc)) from exc

    line_items = resolve_line_items(db, user, payload.buy_now)

    for product, quantity in line_items:
        if quantity > product.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")

    total_amount = sum(product.price * quantity for product, quantity in line_items)

    order = Order(
        user_id=user.id,
        status="placed",
        total_amount=total_amount,
        payment_id=gateway_payment["payment_id"],
        address_id=address.id,
        payment_method_id=payment_method_id,
    )
    db.add(order)
    db.flush()

    order_items = []
    for product, quantity in line_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name_snapshot=product.name,
            quantity=quantity,
            price_at_purchase=product.price,
        )
        db.add(order_item)
        order_items.append(order_item)
        product.quantity -= quantity

    if not payload.buy_now:
        db.query(CartItem).filter(CartItem.user_id == user.id).delete()

    db.commit()
    db.refresh(order)

    order.items = order_items  # attach for the email stub below (not a persisted relationship)
    send_invoice_email(user.email, order)

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
