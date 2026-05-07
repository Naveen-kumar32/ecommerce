from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ALLOWED_ORIGINS
from database import Base, engine
from models import user as user_model  # noqa: F401 — registers User model with Base
from routers import auth

# Auto-create tables on startup
Base.metadata.create_all(bind=engine)

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
