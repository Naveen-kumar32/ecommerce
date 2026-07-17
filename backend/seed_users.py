from passlib.context import CryptContext
from sqlalchemy.exc import OperationalError

from config import ADMIN_IDENTIFIERS, DEFAULT_USER_ROLE
from database import (
    Base,
    SessionLocal,
    engine,
    ensure_user_role_column,
    sync_admin_identifier_roles,
)
from demo_users import DEMO_USERS
from models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_demo_users():
    Base.metadata.create_all(bind=engine)
    ensure_user_role_column(DEFAULT_USER_ROLE)

    db = SessionLocal()

    try:
        for demo_user in DEMO_USERS:
            existing_user = (
                db.query(User).filter(User.email == demo_user["email"]).first()
                or db.query(User).filter(User.username == demo_user["username"]).first()
            )

            if existing_user:
                existing_user.username = demo_user["username"]
                existing_user.email = demo_user["email"]
                existing_user.hashed_password = pwd_context.hash(demo_user["password"])
                existing_user.role = demo_user["role"]
                continue

            db.add(
                User(
                    username=demo_user["username"],
                    email=demo_user["email"],
                    hashed_password=pwd_context.hash(demo_user["password"]),
                    role=demo_user["role"],
                )
            )

        db.commit()
        sync_admin_identifier_roles(ADMIN_IDENTIFIERS)
    finally:
        db.close()


if __name__ == "__main__":
    try:
        seed_demo_users()
        print(f"Seeded {len(DEMO_USERS)} demo users.")
    except OperationalError as exc:
        raise SystemExit(
            "Could not seed demo users. Start Postgres first and check DB_URL in backend/.env."
        ) from exc
