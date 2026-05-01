from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # Unsplash API (for images - free tier)
    unsplash_access_key: str = os.getenv("UNSPLASH_ACCESS_KEY", "your_unsplash_key_here")
    
    # Redis (caching) - optional, can use simple in-memory cache
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    use_redis: bool = os.getenv("USE_REDIS", "false").lower() == "true"
    cache_ttl: int = int(os.getenv("CACHE_TTL", 86400))  # 24 hours default
    
    # API Configuration
    unsplash_base_url: str = "https://api.unsplash.com"
    opentripmap_base_url: str = "https://api.opentripmap.com/0.1"
    
    # CORS
    cors_origins: list = ["http://localhost:5173", "http://localhost:3000", "*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()
