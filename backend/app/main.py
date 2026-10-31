from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal, init_db
from .seed_data import seed_database
from .routers import auth_routes, curriculum, flashcards, exams, schedule, teacher, student

# Initialize tables and run migrations (role column in users table)
init_db()

# Seed sample data on first run
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="DerinTalks API",
    description="Modern İngilizce Öğrenme Platformu - FastAPI Backend",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_routes.router)  # Provides POST /register and POST /login directly
app.include_router(auth_routes.router, prefix="/api")  # Provides POST /api/register and POST /api/login
app.include_router(auth_routes.router, prefix="/api/auth")  # Provides /api/auth/register and /api/auth/login
app.include_router(curriculum.router)
app.include_router(flashcards.router)
app.include_router(exams.router)
app.include_router(schedule.router)
app.include_router(teacher.router)
app.include_router(student.router)

@app.get("/")
def root():
    return {
        "app": "DerinTalks API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "platform": "DerinTalks English Learning Platform"}
