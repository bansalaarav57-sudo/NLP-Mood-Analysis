from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from src.database.db import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    password = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    reviews = relationship(
        "Review",
        back_populates="user"
    )


class Review(Base):

    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    review = Column(String)

    predicted_mood = Column(String)

    confidence = Column(Float)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="reviews"
    )