from __future__ import annotations

import sys
import os
import shutil
import uuid
from datetime import timedelta, datetime
from math import radians, cos, sin, asin, sqrt
from pathlib import Path
from typing import List

# Add project root to Python path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from fastapi import (
    Depends,
    FastAPI,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend import auth, crud, models, schemas
from backend.database import Base, engine, get_db
from backend.ml_model.predictor import predict_disease


load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Potato Guard API", version="1.0.0")


origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOADS_DIR = Path(__file__).resolve().parent / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)


async def save_upload_file(upload_file: UploadFile) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    ext = upload_file.filename.split(".")[-1]
    filename = f"{timestamp}_{unique_id}.{ext}"
    file_path = UPLOADS_DIR / filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return str(file_path)


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    km = 6371 * c
    return round(km, 2)


def load_chemicals() -> dict:
    data_path = Path(__file__).resolve().parent / "data" / "chemicals.json"
    import json

    with data_path.open("r") as f:
        return json.load(f)


chemicals_data = load_chemicals()


@app.post("/api/auth/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, user_in.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    user = crud.create_user(db, user_in.username, user_in.email, user_in.password)
    return user


@app.post("/api/auth/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(hours=auth.ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = auth.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/auth/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@app.post("/api/predict")
async def predict_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/jpg"):
        raise HTTPException(status_code=400, detail="Invalid file type. Use JPG or PNG.")

    file_path = await save_upload_file(file)

    try:
        result = predict_disease(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    detection = crud.create_detection_history(
        db=db,
        user_id=current_user.id,
        image_path=file_path,
        predicted_disease=result["disease"],
        confidence=result["confidence"],
        image_type=result["image_type"],
    )

    # Use the normalized key from predictor to look up chemicals
    disease_key = result.get("normalized_disease_key", result["disease"].lower().replace(" ", "_"))
    chemical_recommendations = chemicals_data.get(disease_key)

    return {
        "disease": result["disease"],
        "confidence": result["confidence"],
        "image_type": result["image_type"],
        "chemical_recommendations": chemical_recommendations,
        "detection_id": detection.id,
    }


@app.get("/api/history", response_model=schemas.DetectionHistoryList)
def get_history(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    page = max(page, 1)
    limit = max(min(limit, 100), 1)
    total, detections = crud.get_user_detections_paginated(db, current_user.id, page, limit)
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": detections,
    }


@app.delete("/api/history/{detection_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history_item(
    detection_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    detection = crud.get_detection_by_id_for_user(db, detection_id, current_user.id)
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")

    crud.delete_detection(db, detection)
    return


@app.get("/api/agrovets/nearest", response_model=List[schemas.AgrovetNearest])
def get_nearest_agrovets(
    latitude: float,
    longitude: float,
    db: Session = Depends(get_db),
):
    agrovets = db.query(models.Agrovet).all()
    if not agrovets:
        return []

    nearest = []
    for agrovet in agrovets:
        distance = calculate_distance(
            latitude,
            longitude,
            float(agrovet.latitude),
            float(agrovet.longitude),
        )
        nearest.append(
            schemas.AgrovetNearest(
                id=agrovet.id,
                name=agrovet.name,
                phone=agrovet.phone,
                latitude=float(agrovet.latitude),
                longitude=float(agrovet.longitude),
                ward=agrovet.ward,
                constituency=agrovet.constituency,
                address=agrovet.address,
                verified=agrovet.verified,
                distance=distance,
            )
        )

    nearest_sorted = sorted(nearest, key=lambda x: x.distance)
    return nearest_sorted[:3]


@app.get("/api/chemicals/{disease_name}", response_model=schemas.ChemicalRecommendation)
def get_chemicals(disease_name: str):
    key = disease_name.lower().replace(" ", "_")
    data = chemicals_data.get(key)
    if not data:
        raise HTTPException(status_code=404, detail="No chemical recommendations for this disease")
    return data

