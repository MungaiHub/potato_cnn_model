from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Dict, Any

import numpy as np
from PIL import Image
import tensorflow as tf


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "potato_cnn_model.keras"
CLASS_INDICES_PATH = BASE_DIR / "class_indices.json"


model = None

# confidence threshold (%) below which predictions are considered "unidentified"
CONFIDENCE_THRESHOLD = float(os.getenv("PRED_CONF_THRESHOLD", "60"))


def load_model():
    global model
    if model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        model = tf.keras.models.load_model(str(MODEL_PATH))
    return model


def load_class_indices() -> Dict[str, str]:
    if not CLASS_INDICES_PATH.exists():
        raise FileNotFoundError(f"Class indices file not found: {CLASS_INDICES_PATH}")
    with open(CLASS_INDICES_PATH, "r") as f:
        data = json.load(f)
    # invert mapping if file maps class_name -> index
    # result should map index (as string) -> class_name
    if all(isinstance(v, int) for v in data.values()):
        inv = {str(v): k for k, v in data.items()}
        return inv
    # otherwise assume it's already index->name
    return {str(k): v for k, v in data.items()}


def predict_disease(image_path: str) -> Dict[str, Any]:
    model = load_model()
    class_indices = load_class_indices()
    # Prepare input according to model expected shape
    input_shape = None
    try:
        input_shape = model.input_shape
    except Exception:
        try:
            # fallback for some SavedModel shapes
            input_shape = model.inputs[0].shape.as_list()
        except Exception:
            input_shape = None

    if input_shape and len(input_shape) == 4:
        # expected format: (None, H, W, C)
        _, h, w, c = input_shape
        h = int(h) if h else 224
        w = int(w) if w else 224
        c = int(c) if c else 3
        mode = "RGB" if c == 3 else "L"
        img = Image.open(image_path).convert(mode).resize((w, h))
        img_array = np.array(img).astype(np.float32)
        # If model expects 3 channels but image is single-channel, stack
        if img_array.ndim == 2 and c == 3:
            img_array = np.stack([img_array] * 3, axis=-1)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
    elif input_shape and len(input_shape) == 2:
        # model expects a flat vector: (None, N)
        expected = int(input_shape[1]) if input_shape[1] else None
        # load as RGB and flatten
        img = Image.open(image_path).convert("RGB").resize((224, 224))
        arr = np.array(img).astype(np.float32) / 255.0
        flat = arr.flatten()
        if expected and flat.size != expected:
            raise ValueError(
                f"Model expects flattened input length {expected} but image flattened is {flat.size}"
            )
        img_array = np.expand_dims(flat, axis=0)
    else:
        # default: standard 224x224 RGB
        img = Image.open(image_path).convert("RGB").resize((224, 224))
        img_array = np.array(img).astype(np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    class_idx = int(np.argmax(predictions[0]))
    confidence = float(predictions[0][class_idx]) * 100.0

    disease_name = class_indices.get(str(class_idx), "Unknown")

    # If the model returned an unknown class or confidence is below threshold,
    # treat as unidentified.
    if disease_name == "Unknown" or confidence < CONFIDENCE_THRESHOLD:
        return {
            "disease": "Unidentified image",
            "confidence": round(confidence, 2),
            "image_type": "unknown",
            "normalized_disease_key": "unidentified",
        }

    # Normalize disease name for chemical lookup
    # Remove "Potato___" or "Potato_" prefix, convert to lowercase, collapse underscores
    normalized = disease_name.replace("Potato___", "").replace("Potato_", "")
    normalized = normalized.lower().replace(" ", "_")
    # collapse multiple underscores to single
    while "__" in normalized:
        normalized = normalized.replace("__", "_")
    
    lower_name = normalized
    if "blight" in lower_name or "wilt" in lower_name or "leaf" in lower_name:
        image_type = "leaf"
    else:
        image_type = "tuber"

    return {
        "disease": disease_name,
        "confidence": round(confidence, 2),
        "image_type": image_type,
        "normalized_disease_key": normalized,
    }

