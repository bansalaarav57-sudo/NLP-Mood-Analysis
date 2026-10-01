import pickle
import numpy as np
from pathlib import Path

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

from src.services.preprocessing import clean_text

BASE_DIR = Path(__file__).resolve().parent.parent.parent

MODEL_PATH = BASE_DIR / "models" / "mood_lstm_model.keras"
TOKENIZER_PATH = BASE_DIR / "models" / "tokenizer.pkl"
LABEL_PATH = BASE_DIR / "models" / "label_encoder.pkl"

MAX_LEN = 80

model = load_model(MODEL_PATH)

with open(TOKENIZER_PATH, "rb") as f:
    tokenizer = pickle.load(f)

with open(LABEL_PATH, "rb") as f:
    label_encoder = pickle.load(f)


def predict(review: str):

    cleaned = clean_text(review)

    sequence = tokenizer.texts_to_sequences([cleaned])

    padded = pad_sequences(
        sequence,
        maxlen=MAX_LEN,
        padding="post",
        truncating="post"
    )

    prediction = model.predict(
        padded,
        verbose=0
    )[0]

    index = np.argmax(prediction)

    mood = label_encoder.inverse_transform([index])[0]

    confidence = float(prediction[index] * 100)

    return {
        "review": review,
        "predicted_mood": mood,
        "confidence": round(confidence, 2)
    }