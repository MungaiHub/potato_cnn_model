from __future__ import annotations

from typing import List, Optional, Tuple

from sqlalchemy import desc
from sqlalchemy.orm import Session

from . import models

from .auth import get_password_hash, verify_password


def create_user(db: Session, username: str, email: str, password: str) -> models.User:
    hashed_password = get_password_hash(password)
    user = models.User(username=username, email=email, password_hash=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()


def authenticate_user(db: Session, username: str, password: str) -> Optional[models.User]:
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def create_detection_history(
    db: Session,
    user_id: int,
    image_path: str,
    predicted_disease: str,
    confidence: float,
    image_type: str,
) -> models.DetectionHistory:
    detection = models.DetectionHistory(
        user_id=user_id,
        image_path=image_path,
        predicted_disease=predicted_disease,
        confidence=confidence,
        image_type=image_type,
    )
    db.add(detection)
    db.commit()
    db.refresh(detection)
    return detection


def get_user_detections_paginated(
    db: Session, user_id: int, page: int, limit: int
) -> Tuple[int, List[models.DetectionHistory]]:
    query = db.query(models.DetectionHistory).filter(models.DetectionHistory.user_id == user_id)
    total = query.count()
    items = (
        query.order_by(desc(models.DetectionHistory.detection_date))
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return total, items


def get_detection_by_id_for_user(
    db: Session, detection_id: int, user_id: int
) -> Optional[models.DetectionHistory]:
    return (
        db.query(models.DetectionHistory)
        .filter(
            models.DetectionHistory.id == detection_id,
            models.DetectionHistory.user_id == user_id,
        )
        .first()
    )


def delete_detection(db: Session, detection: models.DetectionHistory) -> None:
    db.delete(detection)
    db.commit()

