import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DOCUMENTS_DIR = DATA_DIR / "documents"
THUMBNAILS_DIR = DATA_DIR / "thumbnails"
DB_DIR = DATA_DIR / "db"

# Create directories if they do not exist
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)
DB_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DB_DIR / 'kaagaz.db'}")
    STORAGE_DIR: Path = DOCUMENTS_DIR
    THUMBNAILS_DIR: Path = THUMBNAILS_DIR
    
    # Ollama local settings (Default, Zero API Key required)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "gemma2:2b")
    
    # Optional Cloud AI API Keys (Optional fallback)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Upload limits
    MAX_FILE_SIZE_BYTES: int = 15 * 1024 * 1024  # 15 MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".jpg", ".jpeg", ".png", ".txt"}

settings = Settings()
