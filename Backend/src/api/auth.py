from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from pydantic import BaseModel

from src.database.db import get_db
from src.services.auth_service import (
    create_user,
    login_user
)
from src.utils.security import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


class Signup(BaseModel):
    name: str
    email: str
    password: str


class Login(BaseModel):
    email: str
    password: str


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(
    user: Signup,
    db: Session = Depends(get_db)
):

    new_user = create_user(
        db=db,
        name=user.name,
        email=user.email,
        password=user.password
    )

    if new_user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already exists"
        )

    return {
        "success": True,
        "message": "User created successfully",
        "data": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }


@router.post("/login")
def login(
    user: Login,
    db: Session = Depends(get_db)
):

    existing = login_user(
        db=db,
        email=user.email,
        password=user.password
    )

    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": str(existing.id),
            "email": existing.email
        }
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": existing.id,
            "name": existing.name,
            "email": existing.email
        }
    }