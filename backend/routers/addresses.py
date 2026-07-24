from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user
from models.address import Address
from models.user import User
from schemas_orders import AddressCreate, AddressOut

router = APIRouter(prefix="/addresses", tags=["Addresses"])


def clear_other_defaults(db: Session, user_id: int) -> None:
    db.query(Address).filter(Address.user_id == user_id, Address.is_default.is_(True)).update(
        {"is_default": False}
    )


@router.get("", response_model=list[AddressOut])
def list_addresses(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Address).filter(Address.user_id == user.id).order_by(Address.id).all()


@router.post("", response_model=AddressOut, status_code=201)
def create_address(
    payload: AddressCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.is_default:
        clear_other_defaults(db, user.id)

    address = Address(user_id=user.id, **payload.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.put("/{address_id}", response_model=AddressOut)
def update_address(
    address_id: int,
    payload: AddressCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == user.id).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    if payload.is_default:
        clear_other_defaults(db, user.id)

    for field, value in payload.model_dump().items():
        setattr(address, field, value)

    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}", status_code=204)
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == user.id).first()

    if address:
        db.delete(address)
        db.commit()


@router.put("/{address_id}/default", response_model=AddressOut)
def set_default_address(
    address_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == user.id).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    clear_other_defaults(db, user.id)
    address.is_default = True
    db.commit()
    db.refresh(address)
    return address
