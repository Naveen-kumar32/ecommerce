import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def parse_csv_env(name: str, default: str = "") -> list[str]:
    return [
        value.strip()
        for value in os.getenv(name, default).split(",")
        if value.strip()
    ]

DB_URL: str = os.getenv("DB_URL", "")
SECRET_KEY: str = os.getenv("SECRET_KEY", "")
ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
TOKEN_EXPIRE_HOURS: int = int(os.getenv("TOKEN_EXPIRE_HOURS", "24"))
DEFAULT_LOCAL_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
DEFAULT_LOCAL_ORIGINS += ["http://localhost:5174", "http://127.0.0.1:5174"]
ALLOWED_ORIGINS: list[str] = list(
    dict.fromkeys(parse_csv_env("ALLOWED_ORIGINS") + DEFAULT_LOCAL_ORIGINS)
)
ADMIN_IDENTIFIERS: list[str] = [
    value.lower()
    for value in parse_csv_env("ADMIN_IDENTIFIERS", "admin,admin@example.com")
]
DEFAULT_USER_ROLE: str = os.getenv("DEFAULT_USER_ROLE", "customer").lower()
RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
