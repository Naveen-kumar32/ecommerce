from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
from models.cart import CartItem
from models.product import Product
from models.user import User
from schemas_cart import CartItemCreate, CartItemUpdate, CartOut

router = APIRouter(prefix="/cart", tags=["Cart"])


def build_cart_out(db: Session, user: User) -> CartOut:
    rows = db.query(CartItem).filter(CartItem.user_id == user.id).all()
    items = []
    subtotal = 0

    for row in rows:
        product = db.query(Product).filter(Product.id == row.product_id).first()

        if not product:
            continue

        items.append(
            {
                "id": row.id,
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": row.quantity,
                "in_stock": product.quantity > 0,
                "has_image": product.image_data is not None,
                "available_quantity": product.quantity,
            }
        )
        subtotal += product.price * row.quantity

    total_count = sum(item["quantity"] for item in items)
    return CartOut(items=items, total_count=total_count, subtotal=subtotal)


@router.get("", response_model=CartOut)
def get_cart(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return build_cart_out(db, user)


@router.post("", response_model=CartOut, status_code=201)
def add_to_cart(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == payload.product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(CartItem)
        .filter(CartItem.user_id == user.id, CartItem.product_id == payload.product_id)
        .first()
    )
    requested_quantity = (existing.quantity if existing else 0) + payload.quantity

    if requested_quantity > product.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    if existing:
        existing.quantity = requested_quantity
    else:
        db.add(CartItem(user_id=user.id, product_id=payload.product_id, quantity=payload.quantity))

    db.commit()
    return build_cart_out(db, user)


@router.put("/{item_id}", response_model=CartOut)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    product = db.query(Product).filter(Product.id == item.product_id).first()

    if product and payload.quantity > product.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock available")

    item.quantity = payload.quantity
    db.commit()
    return build_cart_out(db, user)


@router.delete("/{item_id}", response_model=CartOut)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user.id).first()

    if item:
        db.delete(item)
        db.commit()

    return build_cart_out(db, user)


@router.delete("", response_model=CartOut)
def clear_cart(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.query(CartItem).filter(CartItem.user_id == user.id).delete()
    db.commit()
    return build_cart_out(db, user)
