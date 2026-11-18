import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./carebridge.db")
SECRET_KEY = os.getenv("SECRET_KEY", "demo-secret-key")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ENVIRONMENT = os.getenv("APP_ENV", "demo")
