from sqlalchemy.orm import Session
from sqlalchemy import func

from src.database.models import Review


def get_history(db: Session, user_id: int):

    reviews = (
        db.query(Review)
        .filter(Review.user_id == user_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    return [
        {
            "id": review.id,
            "review": review.review,
            "predicted_mood": review.predicted_mood,
            "confidence": round(review.confidence, 2),
            "created_at": review.created_at.isoformat(),
        }
        for review in reviews
    ]


def get_summary(db: Session, user_id: int):

    reviews = (
        db.query(Review)
        .filter(Review.user_id == user_id)
        .order_by(Review.created_at.asc())
        .all()
    )

    total_reviews = len(reviews)

    average_confidence = (
        round(
            sum(r.confidence for r in reviews) / total_reviews,
            2
        )
        if total_reviews
        else 0
    )

    mood_counts = {}

    for review in reviews:

        mood_counts[review.predicted_mood] = (
            mood_counts.get(review.predicted_mood, 0) + 1
        )

    mood_distribution = [

        {
            "mood": mood,
            "count": count
        }

        for mood, count in mood_counts.items()

    ]

    most_common_mood = (

        max(
            mood_counts,
            key=mood_counts.get
        )

        if mood_counts

        else None

    )

    confidence_trend = [

        {

            "week": review.created_at.strftime("%d %b"),

            "avg": round(review.confidence, 2)

        }

        for review in reviews[-7:]

    ]

    return {

        "total_reviews": total_reviews,

        "average_confidence": average_confidence,

        "most_common_mood": most_common_mood,

        "mood_distribution": mood_distribution,

        "confidence_trend": confidence_trend

    }