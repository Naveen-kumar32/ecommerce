from fastapi import APIRouter, HTTPException

from database import fake_users_db
from schemas import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    user = next(
        (u for u in fake_users_db if u["email"] == payload.email and u["password"] == payload.password),
        None,
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return LoginResponse(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        message="Login successful",
    )


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(payload: RegisterRequest):
    # Check if email already exists
    existing = next((u for u in fake_users_db if u["email"] == payload.email), None)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "id": len(fake_users_db) + 1,
        "name": payload.name,
        "email": payload.email,
        "password": payload.password,
    }
    fake_users_db.append(new_user)

    return RegisterResponse(
        id=new_user["id"],
        name=new_user["name"],
        email=new_user["email"],
        message="Registration successful",
    )
