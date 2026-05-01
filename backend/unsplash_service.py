import requests
import logging
from typing import List, Optional
from schemas import PhotoSchema
from config import get_settings
from cache import get_cache

logger = logging.getLogger(__name__)
settings = get_settings()
cache = get_cache()

class UnsplashService:
    """Service to interact with Unsplash API for fallback images"""
    
    def __init__(self):
        self.access_key = settings.unsplash_access_key
        self.base_url = settings.unsplash_base_url
        self.cache_ttl = settings.cache_ttl
    
    def search_photos(self, query: str, page: int = 1, per_page: int = 5) -> List[PhotoSchema]:
        """
        Search for photos on Unsplash
        """
        cache_key = cache.generate_key("unsplash_search", query, page, per_page)
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for unsplash_search: {query}")
            return cached_result
        
        try:
            url = f"{self.base_url}/search/photos"
            headers = {
                "Authorization": f"Client-ID {self.access_key}"
            }
            params = {
                "query": query,
                "page": page,
                "per_page": per_page,
                "orientation": "landscape"
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            photos = []
            
            for photo in data.get("results", []):
                photos.append(PhotoSchema(
                    url=photo["urls"]["regular"],
                    height=photo["height"],
                    width=photo["width"],
                    attribution=f"Photo by {photo['user']['name']} on Unsplash"
                ))
            
            cache.set(cache_key, photos, self.cache_ttl)
            return photos
        
        except Exception as e:
            logger.error(f"Error in unsplash search_photos: {e}")
            return []

# Create singleton instance
unsplash_service = UnsplashService()

def get_unsplash_service() -> UnsplashService:
    """Get Unsplash service instance"""
    return unsplash_service
