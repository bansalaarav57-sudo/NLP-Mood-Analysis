import os
import csv
import re
from datetime import date

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import nltk
from nltk.corpus import stopwords

import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer # type: ignore
from tensorflow.keras.preprocessing.sequence import pad_sequences # type: ignore
from tensorflow.keras.models import Sequential # type: ignore
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout # type: ignore

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import pickle

# -----------------------------
# 1. Download NLTK stopwords
# -----------------------------
nltk.download("stopwords")

# -----------------------------
# 2. Load dataset
# -----------------------------
file_path = "/Users/yashagarwal/Downloads/NLP Mood/data/Combined Data.csv"   # make sure this file is in same folder
df = pd.read_csv(file_path)

# If first column is an unwanted index column, remove it
if df.columns[0].lower() in ["unnamed: 0", "index"]:
    df = df.drop(df.columns[0], axis=1)

df = df.fillna("")

# Shuffle dataset
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Column names
text_col = "statement"
label_col = "status"

print("Dataset shape:", df.shape)
print(df.head())

# -----------------------------
# 3. Text cleaning
# -----------------------------
stop_words = set(stopwords.words("english"))

def clean_text(text):
    text = re.sub(r"[^a-zA-Z]", " ", str(text))
    text = text.lower().split()
    text = [word for word in text if word not in stop_words]
    return " ".join(text)

df["Cleaned"] = df[text_col].apply(clean_text)

# -----------------------------
# 4. Encode labels
# -----------------------------
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(df[label_col])
num_classes = len(label_encoder.classes_)

# -----------------------------
# 5. Tokenization
# -----------------------------
vocab_size = 5000
maxlen = 80

tokenizer = Tokenizer(num_words=vocab_size, oov_token="<OOV>")
tokenizer.fit_on_texts(df["Cleaned"])

X = tokenizer.texts_to_sequences(df["Cleaned"])
X = pad_sequences(X, maxlen=maxlen, padding="post", truncating="post")

# -----------------------------
# 6. Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("X_train shape:", X_train.shape)
print("X_test shape:", X_test.shape)

# -----------------------------
# 7. Build LSTM model
# -----------------------------
model = Sequential([
    Embedding(input_dim=vocab_size, output_dim=64),
    LSTM(64, dropout=0.2, recurrent_dropout=0.2),
    Dropout(0.3),
    Dense(num_classes, activation="softmax")
])

model.compile(
    loss="sparse_categorical_crossentropy",
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.01),
    metrics=["accuracy"]
)

model.summary()

# -----------------------------
# 8. Train model
# -----------------------------
history = model.fit(
    X_train,
    y_train,
    epochs=11,
    batch_size=32,
    validation_data=(X_test, y_test),
    verbose=1
)

# -----------------------------
# 9. Evaluate model
# -----------------------------
y_pred = model.predict(X_test)
y_pred_classes = np.argmax(y_pred, axis=1)

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred_classes, target_names=label_encoder.classes_))

# -----------------------------
# 10. Single prediction
# -----------------------------
def predict_mood(review):
    cleaned = clean_text(review)
    seq = tokenizer.texts_to_sequences([cleaned])
    padded = pad_sequences(seq, maxlen=maxlen, padding="post", truncating="post")
    prediction = model.predict(padded, verbose=0)
    mood = label_encoder.inverse_transform([np.argmax(prediction)])
    return mood[0]

# Example manual prediction
new_review = input("\nEnter a review: ")
predicted_mood = predict_mood(new_review)
print("Predicted Mood:", predicted_mood)

# -----------------------------
# 11. Logging reviews
# -----------------------------
log_file = "/Users/yashagarwal/Downloads/NLP Mood/logs/student_mood_log.csv"

# Create file with header if it doesn't exist
if not os.path.exists(log_file):
    with open(log_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Date", "Review", "Predicted_Mood"])

def log_student_review(review):
    mood = predict_mood(review)
    today = date.today().isoformat()

    with open(log_file, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([today, review, mood])

    print(f"Logged: {today} | Mood: {mood}")

# -----------------------------
# 12. Generate progress report
# -----------------------------
def generate_progress_report():
    if not os.path.exists(log_file):
        print("No log file found yet.")
        return

    report_df = pd.read_csv(log_file)

    print("\nStudent Mood Report:")
    print(report_df.tail(10))

    mood_counts = report_df["Predicted_Mood"].value_counts()
    print("\nMood Frequency:\n", mood_counts)

    # Plot mood over time
    plt.figure(figsize=(10, 5))
    plt.plot(report_df["Date"], report_df["Predicted_Mood"], marker="o")
    plt.xticks(rotation=45)
    plt.title("Mood Progress Over Time")
    plt.xlabel("Date")
    plt.ylabel("Predicted Mood")
    plt.tight_layout()
    plt.show()

    # Pie chart
    plt.figure(figsize=(6, 6))
    mood_counts.plot.pie(autopct="%1.1f%%") # type: ignore
    plt.title("Mood Distribution")
    plt.ylabel("")
    plt.show()

# -----------------------------
# 13. Take 3 daily reviews
# -----------------------------
for i in range(1, 4):
    review = input(f"Enter review {i}: ")
    log_student_review(review)

# -----------------------------
# 14. Show report
# -----------------------------
generate_progress_report()

#Saving the model and tokenizer for future use
model.save("/Users/yashagarwal/Downloads/NLP Mood/models/mood_lstm_model.keras")

with open("/Users/yashagarwal/Downloads/NLP Mood/models/tokenizer.pkl", "wb") as f:
    pickle.dump(tokenizer, f)

with open("/Users/yashagarwal/Downloads/NLP Mood/models/label_encoder.pkl", "wb") as f:
    pickle.dump(label_encoder, f)