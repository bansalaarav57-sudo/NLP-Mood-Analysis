from sqlalchemy.orm import Session

from src.database.models import Review


def save_review(
    db: Session,
    user_id: int,
    review: str,
    mood: str,
    confidence: float,
):

    new_review = Review(
        user_id=user_id,
        review=review,
        predicted_mood=mood,
        confidence=confidence
    )

    try:
        db.add(new_review)
        db.commit()
        db.refresh(new_review)

        return new_review

    except Exception:
        db.rollback()
        raise