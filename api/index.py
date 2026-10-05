import sys
import os

# Add backend directory to sys.path so app modules are discoverable
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "..", "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Override default SQLite path to /tmp on serverless environments if writable data dir is not set
if "DATABASE_URL" not in os.environ:
    os.environ["DATABASE_URL"] = "sqlite:////tmp/kaagaz.db"
if "STORAGE_DIR" not in os.environ:
    os.environ["STORAGE_DIR"] = "/tmp/documents"
if "THUMBNAILS_DIR" not in os.environ:
    os.environ["THUMBNAILS_DIR"] = "/tmp/thumbnails"

from app.main import app
