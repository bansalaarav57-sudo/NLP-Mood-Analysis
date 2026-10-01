from sqlalchemy.orm import Session

from src.database.models import User

from src.utils.security import (
    hash_password,
    verify_password
)


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str
):

    email = email.lower().strip()

    existing = db.query(User).filter(
        User.email == email
    ).first()

    if existing:
        return None

    user = User(
        name=name,
        email=email,
        password=hash_password(password)
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    except Exception:
        db.rollback()
        raise


def login_user(
    db: Session,
    email: str,
    password: str
):

    email = email.lower().strip()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        return None

    if not verify_password(
        password,
        user.password
    ):
        return None

    return user