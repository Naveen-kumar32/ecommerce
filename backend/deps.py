from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import ALGORITHM, SECRET_KEY
from database import get_db
from models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_error = HTTPException(status_code=401, detail="Could not validate credentials")

    if not token:
        raise credentials_error

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        raise credentials_error

    if user_id is None:
        raise credentials_error

    user = db.query(User).filter(User.id == int(user_id)).first()

    if not user:
        raise credentials_error

    return user


def require_roles(*roles: str):
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="You do not have access to this resource")
        return user

    return dependency
