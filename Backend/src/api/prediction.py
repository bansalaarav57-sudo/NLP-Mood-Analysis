from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import HTTPException


from src.database.db import get_db
from src.services.predictor import predict
from src.services.review_service import save_review
from src.utils.auth import get_current_user


router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
    )


class ReviewRequest(BaseModel):
    review: str


@router.post(
    "/predict",
    summary="Predict mental health mood",
    description="Predicts the user's mental health category using the trained LSTM model and stores the prediction."
)

def predict_review(
    data: ReviewRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        result = predict(data.review)

        save_review(
            db=db,
            user_id=current_user["user_id"],
            review=result["review"],
            mood=result["predicted_mood"],
            confidence=result["confidence"]
        )

        return {
            "success": True,
            "message": "Prediction completed successfully",
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )