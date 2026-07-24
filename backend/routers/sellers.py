from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from deps import require_roles
from models.seller import Seller
from models.user import User
from schemas_sellers import SellerOut, SellerUpdate

router = APIRouter(prefix="/sellers", tags=["Sellers"])


def get_or_create_seller(db: Session, user: User) -> Seller:
    seller = db.query(Seller).filter(Seller.user_id == user.id).first()

    if seller:
        return seller

    seller = Seller(user_id=user.id, store_name=user.username)
    db.add(seller)
    db.commit()
    db.refresh(seller)
    return seller


@router.get("/me", response_model=SellerOut)
def get_my_seller_profile(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("seller")),
):
    return get_or_create_seller(db, user)


@router.put("/me", response_model=SellerOut)
def update_my_seller_profile(
    payload: SellerUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles("seller")),
):
    seller = get_or_create_seller(db, user)
    seller.store_name = payload.store_name
    seller.description = payload.description
    db.commit()
    db.refresh(seller)
    return seller
