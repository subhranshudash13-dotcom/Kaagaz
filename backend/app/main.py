import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import engine, Base, SessionLocal
from app.routes import health, documents, dashboard, todo, assistant
from app.db_seeder import seed_demo_household_if_empty

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("kaagaz.main")

# Initialize DB tables and seed if empty
Base.metadata.create_all(bind=engine)
try:
    _init_db = SessionLocal()
    seed_demo_household_if_empty(_init_db)
    _init_db.close()
except Exception as e:
    logger.warning(f"Initial DB seeding: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure demo household is seeded if empty
    db = SessionLocal()
    try:
        seed_demo_household_if_empty(db)
    except Exception as e:
        logger.warning(f"Database seeder notice: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title="Kaagaz — Life Admin Copilot Backend",
    version="0.2.0",
    description="Privacy-first Life Admin Copilot powered by open-source AI.",
    lifespan=lifespan
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router)
app.include_router(documents.router)
app.include_router(dashboard.router)
app.include_router(todo.router)
app.include_router(assistant.router)

@app.get("/")
async def root():
    return {
        "message": "Kaagaz Backend API",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
