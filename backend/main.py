from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ADMIN_IDENTIFIERS, ALLOWED_ORIGINS, DEFAULT_USER_ROLE
from database import Base, engine, ensure_user_role_column, sync_admin_identifier_roles
from models import user as user_model  # noqa: F401 — registers User model with Base
from routers import auth

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


@app.get("/")
def root():
    return {"message": "React Project API is running"}
