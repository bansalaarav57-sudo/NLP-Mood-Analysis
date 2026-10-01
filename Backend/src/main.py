from fastapi import FastAPI

from src.api.prediction import router as prediction_router
from src.api.reports import router as report_router
from src.database.db import engine
from src.database.db import Base

from src.api.auth import router as auth_router

from src.api.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(

    title="Mental Health Detection API",

    description="AI-powered Mental Health Detection using LSTM, FastAPI and TensorFlow.",

    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(report_router)
app.include_router(dashboard_router)


@app.get("/", tags=["Health"])

def home():

    return {
    "status": "Running",
    "message": "Mental Health Detection API",
    "version": "1.0.0"
    }