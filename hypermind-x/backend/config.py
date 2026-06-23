from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "HyperMind-X"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/hypermind")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")
    class Config:
        env_file = ".env"

try:
    settings = Settings()
except Exception:
    settings = Settings(DATABASE_URL="postgresql://user:password@localhost:5432/hypermind")
