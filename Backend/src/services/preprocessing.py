import re
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords", quiet=True)

STOP_WORDS = set(stopwords.words("english"))

def clean_text(text: str) -> str:
    text = re.sub(r"[^a-zA-Z]", " ", str(text))
    words = text.lower().split()

    words = [word for word in words if word not in STOP_WORDS]

    return " ".join(words)