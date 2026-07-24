from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ADMIN_IDENTIFIERS, ALLOWED_ORIGINS, DEFAULT_USER_ROLE
from database import Base, engine, ensure_user_role_column, sync_admin_identifier_roles
from models import address as address_model  # noqa: F401 — registers Address model with Base
from models import cart as cart_model  # noqa: F401 — registers CartItem model with Base
from models import category as category_model  # noqa: F401 — registers Category model with Base
from models import order as order_model  # noqa: F401 — registers Order/OrderItem models with Base
from models import payment_method as payment_method_model  # noqa: F401 — registers PaymentMethod model with Base
from models import product as product_model  # noqa: F401 — registers Product model with Base
from models import seller as seller_model  # noqa: F401 — registers Seller model with Base
from models import stock_alert as stock_alert_model  # noqa: F401 — registers StockAlert model with Base
from models import user as user_model  # noqa: F401 — registers User model with Base
from routers import addresses, auth, cart, catalog, checkout, orders, payment_methods, sellers, stock_alerts

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)
ensure_user_role_column(DEFAULT_USER_ROLE)
sync_admin_identifier_roles(ADMIN_IDENTIFIERS)

app = FastAPI(title="React Project API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(catalog.router)
app.include_router(stock_alerts.router)
app.include_router(cart.router)
app.include_router(addresses.router)
app.include_router(payment_methods.router)
app.include_router(checkout.router)
app.include_router(orders.router)
app.include_router(sellers.router)


@app.get("/")
def root():
    return {"message": "React Project API is running"}
