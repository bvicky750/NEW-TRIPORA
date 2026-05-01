import json
import hashlib
from typing import Optional, Any
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class Cache:
    """In-memory cache implementation (can be replaced with Redis)"""
    
    def __init__(self):
        self._cache = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            if key in self._cache:
                cached_data, expiry = self._cache[key]
                # Check if not expired
                if expiry is None or expiry > 0:
                    return cached_data
                else:
                    # Remove expired entry
                    del self._cache[key]
                    return None
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    def set(self, key: str, value: Any, ttl: int = 86400) -> bool:
        """Set value in cache with TTL"""
        try:
            self._cache[key] = (value, ttl)
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            if key in self._cache:
                del self._cache[key]
                return True
            return False
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False
    
    def clear(self) -> bool:
        """Clear entire cache"""
        try:
            self._cache.clear()
            return True
        except Exception as e:
            logger.error(f"Cache clear error: {e}")
            return False
    
    @staticmethod
    def generate_key(*args, **kwargs) -> str:
        """Generate cache key from arguments"""
        key_str = json.dumps(
            {
                "args": [str(arg) for arg in args],
                "kwargs": {k: str(v) for k, v in kwargs.items()}
            },
            sort_keys=True
        )
        return hashlib.md5(key_str.encode()).hexdigest()

# Global cache instance
cache_instance = Cache()

def get_cache() -> Cache:
    """Get cache instance"""
    return cache_instance
