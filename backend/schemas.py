from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserRole(str, Enum):
    admin = "admin"
    customer = "customer"
    sales = "sales"
    support = "support"


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.customer


class RegisterResponse(BaseModel):
    message: str


class LoginRequest(BaseModel):
    identifier: str  # accepts email or username
    password: str
    role: Optional[UserRole] = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    email: str
    role: UserRole
