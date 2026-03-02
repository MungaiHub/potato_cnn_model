from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    DECIMAL,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)

    detections = relationship("DetectionHistory", back_populates="user", cascade="all,delete")


class Agrovet(Base):
    __tablename__ = "agrovets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20))
    latitude = Column(DECIMAL(10, 8), nullable=False)
    longitude = Column(DECIMAL(11, 8), nullable=False)
    ward = Column(String(100), nullable=False)
    constituency = Column(String(100), nullable=False)
    address = Column(Text)
    verified = Column(Boolean, default=True)


class DetectionHistory(Base):
    __tablename__ = "detection_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_path = Column(String(500), nullable=False)
    predicted_disease = Column(String(100), nullable=False)
    confidence = Column(DECIMAL(5, 2), nullable=False)
    detection_date = Column(DateTime, default=datetime.utcnow)
    image_type = Column(Enum("leaf", "tuber", name="image_type_enum"), nullable=False)

    user = relationship("User", back_populates="detections")

