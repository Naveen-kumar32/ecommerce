from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from config import ADMIN_IDENTIFIERS, ALGORITHM, DEFAULT_USER_ROLE, SECRET_KEY, TOKEN_EXPIRE_HOURS
from database import get_db
from models.user import User
from schemas import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserRole

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_user_role(user: User) -> str:
    identifiers = {user.username.lower(), user.email.lower()}
    role = (user.role or DEFAULT_USER_ROLE).lower()

    if identifiers.intersection(ADMIN_IDENTIFIERS):
        return UserRole.admin.value

    valid_roles = {user_role.value for user_role in UserRole}
    return role if role in valid_roles else UserRole.customer.value


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=pwd_context.hash(payload.password),
        role=payload.role.value,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return RegisterResponse(message="Registration successful")


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(User).filter(User.email == payload.identifier).first()
        or db.query(User).filter(User.username == payload.identifier).first()
    )

    if not user or not pwd_context.verify(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    role = get_user_role(user)

    if payload.role and payload.role.value != role:
        raise HTTPException(status_code=403, detail="Selected role does not match this account")

    token = create_token({"sub": str(user.id), "username": user.username, "role": role})

    return LoginResponse(
        access_token=token,
        username=user.username,
        email=user.email,
        role=role,
    )
