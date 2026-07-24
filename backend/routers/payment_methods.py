import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
from models.payment_method import PaymentMethod
from models.user import User
from schemas_orders import PaymentMethodCreate, PaymentMethodOut

router = APIRouter(prefix="/payment-methods", tags=["Payment Methods"])


def clear_other_defaults(db: Session, user_id: int) -> None:
    db.query(PaymentMethod).filter(
        PaymentMethod.user_id == user_id, PaymentMethod.is_default.is_(True)
    ).update({"is_default": False})


@router.get("", response_model=list[PaymentMethodOut])
def list_payment_methods(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(PaymentMethod).filter(PaymentMethod.user_id == user.id).order_by(PaymentMethod.id).all()


@router.post("", response_model=PaymentMethodOut, status_code=201)
def create_payment_method(
    payload: PaymentMethodCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.method_type == "upi":
        if not payload.vpa:
            raise HTTPException(status_code=400, detail="vpa is required for UPI")
        tokenized_reference = payload.vpa
        display_label = f"UPI: {payload.vpa}"
    else:
        if not payload.card_number or len(payload.card_number) < 4:
            raise HTTPException(status_code=400, detail="A valid card_number is required for card")
        # Mock Razorpay tokenization — the raw card number is used only to derive a
        # display label and is never persisted. Only the mock token + last4 are stored.
        last4 = payload.card_number[-4:]
        tokenized_reference = f"tok_mock_{uuid.uuid4().hex}"
        display_label = f"Card ending {last4}"

    if payload.is_default:
        clear_other_defaults(db, user.id)

    payment_method = PaymentMethod(
        user_id=user.id,
        method_type=payload.method_type,
        tokenized_reference=tokenized_reference,
        display_label=display_label,
        is_default=payload.is_default,
    )
    db.add(payment_method)
    db.commit()
    db.refresh(payment_method)
    return payment_method


@router.delete("/{payment_method_id}", status_code=204)
def delete_payment_method(
    payment_method_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    payment_method = (
        db.query(PaymentMethod)
        .filter(PaymentMethod.id == payment_method_id, PaymentMethod.user_id == user.id)
        .first()
    )

    if payment_method:
        db.delete(payment_method)
        db.commit()


@router.put("/{payment_method_id}/default", response_model=PaymentMethodOut)
def set_default_payment_method(
    payment_method_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    payment_method = (
        db.query(PaymentMethod)
        .filter(PaymentMethod.id == payment_method_id, PaymentMethod.user_id == user.id)
        .first()
    )

    if not payment_method:
        raise HTTPException(status_code=404, detail="Payment method not found")

    clear_other_defaults(db, user.id)
    payment_method.is_default = True
    db.commit()
    db.refresh(payment_method)
    return payment_method
