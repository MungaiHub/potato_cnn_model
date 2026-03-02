from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Any

import numpy as np
from PIL import Image
import tensorflow as tf


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "potato_cnn_model.keras"
CLASS_INDICES_PATH = BASE_DIR / "class_indices.json"


model = tf.keras.models.load_model(str(MODEL_PATH))

with open(CLASS_INDICES_PATH, "r") as f:
    class_indices: Dict[str, str] = json.load(f)


def predict_disease(image_path: str) -> Dict[str, Any]:
    img = Image.open(image_path).convert("RGB").resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    class_idx = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][class_idx]) * 100.0

    disease_name = class_indices.get(str(class_idx), "Unknown")

    lower_name = disease_name.lower()
    if "blight" in lower_name or "wilt" in lower_name or "leaf" in lower_name:
        image_type = "leaf"
    else:
        image_type = "tuber"

    return {
        "disease": disease_name,
        "confidence": round(confidence, 2),
        "image_type": image_type,
    }

