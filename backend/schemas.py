from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=72)


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class DetectionBase(BaseModel):
    id: int
    image_path: str
    predicted_disease: str
    confidence: float
    detection_date: datetime
    image_type: str

    class Config:
        from_attributes = True


class DetectionHistoryList(BaseModel):
    total: int
    page: int
    limit: int
    items: List[DetectionBase]


class AgrovetBase(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    latitude: float
    longitude: float
    ward: str
    constituency: str
    town: Optional[str] = None
    verified: bool

    class Config:
        from_attributes = True


class AgrovetNearest(AgrovetBase):
    distance: float


class AgrovetLocationList(BaseModel):
    """Utility type for returning dropdown options when user is outside Nyandarua.

    The `wards_by_constituency` map makes it easy for the frontend to only show
    wards that belong to the currently selected constituency.
    """

    constituencies: List[str]
    wards: List[str]
    wards_by_constituency: dict[str, List[str]] | None = None


class ChemicalRecommendation(BaseModel):
    name: str
    chemicals: List[str]
    application: str
    dosage: str
    safety: str
    description: str

