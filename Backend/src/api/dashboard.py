from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from src.database.db import get_db

from src.utils.auth import get_current_user

from src.services.dashboard_service import get_dashboard

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/",
    summary="Get user dashboard",
    description="Returns dashboard statistics, latest mood prediction and review history."
)

def dashboard(

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)

):

    return get_dashboard(

        db,

        current_user["user_id"]

    )