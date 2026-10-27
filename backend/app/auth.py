
from datetime import datetime, timedelta, timezone
import secrets
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_password_reset_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    payload = {
        "sub": str(user_id),
        "purpose": "password_reset",
        "exp": expire,
        "jti": secrets.token_urlsafe(32),
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def verify_access_token(token: str):
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        return None


def verify_password_reset_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        if payload.get("purpose") != "password_reset":
            return None

        if not payload.get("sub") or not payload.get("jti"):
            return None

        return payload

    except JWTError:
        return None
