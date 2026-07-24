from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from database import get_db
from deps import get_current_user, require_roles
from models.category import Category
from models.product import Product
from models.user import User
from schemas_catalog import (
    CategoryCreate,
    CategoryOut,
    ProductCreate,
    ProductOwnerOut,
    ProductShopOut,
    ProductUpdate,
    parse_data_url,
)
from services.notifications import notify_stock_subscribers

router = APIRouter(tags=["Catalog"])

OWNER_ROLES = ("admin", "seller")


def to_shop_out(product: Product) -> ProductShopOut:
    return ProductShopOut(
        id=product.id,
        name=product.name,
        price=product.price,
        description=product.description,
        category_id=product.category_id,
        in_stock=product.quantity > 0,
        has_image=product.image_data is not None,
    )


def to_owner_out(product: Product) -> ProductOwnerOut:
    return ProductOwnerOut(
        **to_shop_out(product).model_dump(),
        quantity=product.quantity,
        owner_type=product.owner_type,
        created_by=product.created_by,
    )


def apply_image(product: Product, image_base64: Optional[str]) -> None:
    if image_base64 is None:
        return

    image_bytes, mime_type = parse_data_url(image_base64)
    product.image_data = image_bytes
    product.image_mime_type = mime_type


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()


@router.post("/categories", response_model=CategoryOut, status_code=201)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles("admin")),
):
    if db.query(Category).filter(Category.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Category already exists")

    category = Category(name=payload.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/products/mine", response_model=list[ProductOwnerOut])
def list_my_products(
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(*OWNER_ROLES)),
):
    products = (
        db.query(Product)
        .filter(Product.created_by == user.id)
        .order_by(Product.created_at.desc())
        .all()
    )
    return [to_owner_out(product) for product in products]


@router.get("/products", response_model=list[ProductShopOut])
def list_products(
    category_id: Optional[int] = Query(default=None),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_active.is_(True))

    if category_id is not None:
        query = query.filter(Product.category_id == category_id)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    products = query.order_by(Product.created_at.desc()).all()
    return [to_shop_out(product) for product in products]


@router.get("/products/{product_id}", response_model=ProductShopOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return to_shop_out(product)


@router.get("/products/{product_id}/image")
def get_product_image(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product or not product.image_data:
        raise HTTPException(status_code=404, detail="Image not found")

    return Response(content=product.image_data, media_type=product.image_mime_type or "application/octet-stream")


@router.post("/products", response_model=ProductOwnerOut, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(*OWNER_ROLES)),
):
    if payload.category_id is not None and not db.query(Category).filter(Category.id == payload.category_id).first():
        raise HTTPException(status_code=400, detail="Category not found")

    try:
        product = Product(
            name=payload.name,
            price=payload.price,
            quantity=payload.quantity,
            description=payload.description,
            category_id=payload.category_id,
            created_by=user.id,
            owner_type=user.role,
        )
        apply_image(product, payload.image_base64)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    db.add(product)
    db.commit()
    db.refresh(product)
    return to_owner_out(product)


def get_owned_product(product_id: int, db: Session, user: User) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.created_by != user.id:
        raise HTTPException(status_code=403, detail="You can only manage your own products")

    return product


@router.put("/products/{product_id}", response_model=ProductOwnerOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(*OWNER_ROLES)),
):
    product = get_owned_product(product_id, db, user)
    was_out_of_stock = product.quantity <= 0

    update_data = payload.model_dump(exclude_unset=True, exclude={"image_base64"})

    if "category_id" in update_data and update_data["category_id"] is not None:
        if not db.query(Category).filter(Category.id == update_data["category_id"]).first():
            raise HTTPException(status_code=400, detail="Category not found")

    for field, value in update_data.items():
        setattr(product, field, value)

    try:
        apply_image(product, payload.image_base64)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    db.commit()
    db.refresh(product)

    if was_out_of_stock and product.quantity > 0:
        notify_stock_subscribers(db, product)

    return to_owner_out(product)


@router.delete("/products/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_roles(*OWNER_ROLES)),
):
    product = get_owned_product(product_id, db, user)
    db.delete(product)
    db.commit()
