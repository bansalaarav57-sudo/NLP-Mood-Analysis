from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.db import get_db
from src.services.report_service import (
    get_history,
    get_summary,
)
from src.utils.auth import get_current_user

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/history")
def history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_history(
        db,
        current_user["user_id"]
    )


@router.get("/summary")
def summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_summary(
        db,
        current_user["user_id"]
    )