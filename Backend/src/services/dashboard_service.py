from collections import Counter
from sqlalchemy.orm import Session

from src.database.models import Review, User


def get_dashboard(db: Session, user_id: int):

    user = db.query(User).filter(User.id == user_id).first()

    reviews = (
        db.query(Review)
        .filter(Review.user_id == user_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    total_reviews = len(reviews)

    latest = reviews[0] if reviews else None

    average_confidence = (
        round(
            sum(r.confidence for r in reviews) / total_reviews,
            2
        )
        if total_reviews
        else 0
    )

    mood_counter = Counter(
        r.predicted_mood
        for r in reviews
    )

    mood_distribution = [

        {
            "mood": mood,
            "count": count
        }

        for mood, count in mood_counter.items()

    ]

    most_frequent_mood = (
        mood_counter.most_common(1)[0][0]
        if mood_counter
        else "-"
    )

    trend = []

    last7 = list(reversed(reviews[:7]))

    days = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ]

    for i, review in enumerate(last7):

        trend.append({

            "day": days[i % 7],

            "confidence": review.confidence

        })

    recent_reviews = [

        {

            "id": r.id,

            "text": r.review,

            "mood": r.predicted_mood,

            "confidence": r.confidence,

            "date": r.created_at.strftime("%b %d")

        }

        for r in reviews[:5]

    ]

    return {

        "user_name": user.name if user else "",

        "total_reviews": total_reviews,

        "latest_mood": latest.predicted_mood if latest else "-",

        "average_confidence": average_confidence,

        "most_frequent_mood": most_frequent_mood,

        "mood_distribution": mood_distribution,

        "trend": trend,

        "recent_reviews": recent_reviews

    }