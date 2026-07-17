from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

from config import DB_URL

DATABASE_URL = DB_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def ensure_user_role_column(default_role: str = "customer"):
    inspector = inspect(engine)

    if "users" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("users")}

    if "role" in columns:
        return

    safe_default_role = default_role.replace("'", "''")
    sql = (
        "ALTER TABLE users "
        f"ADD COLUMN role VARCHAR NOT NULL DEFAULT '{safe_default_role}'"
    )

    if engine.dialect.name == "postgresql":
        sql = (
            "ALTER TABLE users "
            f"ADD COLUMN IF NOT EXISTS role VARCHAR NOT NULL DEFAULT '{safe_default_role}'"
        )

    with engine.begin() as connection:
        connection.execute(text(sql))


def sync_admin_identifier_roles(admin_identifiers: list[str]):
    if not admin_identifiers:
        return

    inspector = inspect(engine)

    if "users" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("users")}

    if "role" not in columns:
        return

    with engine.begin() as connection:
        for identifier in admin_identifiers:
            connection.execute(
                text(
                    "UPDATE users "
                    "SET role = 'admin' "
                    "WHERE lower(username) = :identifier OR lower(email) = :identifier"
                ),
                {"identifier": identifier.lower()},
            )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
