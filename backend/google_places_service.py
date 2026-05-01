import requests
import logging
from typing import List, Dict, Optional, Any
from schemas import PhotoSchema, ReviewSchema, PlaceDetailsSchema
from config import get_settings
from cache import get_cache

logger = logging.getLogger(__name__)
settings = get_settings()
cache = get_cache()

class GooglePlacesService:
    """Service to interact with Google Places API"""
    
    def __init__(self):
        self.api_key = settings.google_places_api_key
        self.base_url = settings.google_places_base_url
        self.cache_ttl = settings.cache_ttl
    
    def _handle_api_error(self, response: requests.Response, context: str):
        """Handle API errors"""
        logger.error(f"Google Places API Error ({context}): {response.status_code} - {response.text}")
        if response.status_code == 403:
            raise Exception("Invalid API key or quota exceeded")
        elif response.status_code == 404:
            raise Exception("Place not found")
        else:
            raise Exception(f"API Error: {response.status_code}")
    
    def text_search(self, query: str) -> Optional[Dict[str, Any]]:
        """
        Search for a place using text search
        Returns the first matching place
        """
        cache_key = cache.generate_key("text_search", query)
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for text_search: {query}")
            return cached_result
        
        try:
            url = f"{self.base_url}/place/textsearch/json"
            params = {
                "query": query,
                "key": self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") != "OK" or not data.get("results"):
                logger.warning(f"No results found for query: {query}")
                return None
            
            place = data["results"][0]
            cache.set(cache_key, place, self.cache_ttl)
            return place
        
        except Exception as e:
            logger.error(f"Error in text_search: {e}")
            return None
    
    def get_place_details(self, place_id: str, fields: List[str] = None) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a place
        """
        if fields is None:
            fields = [
                "name", "formatted_address", "rating", "review", "photo",
                "opening_hours", "website", "formatted_phone_number",
                "types", "business_status", "place_id"
            ]
        
        cache_key = cache.generate_key("place_details", place_id)
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for place_details: {place_id}")
            return cached_result
        
        try:
            url = f"{self.base_url}/place/details/json"
            params = {
                "place_id": place_id,
                "fields": ",".join(fields),
                "key": self.api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") != "OK":
                logger.warning(f"Failed to get details for place_id: {place_id}")
                return None
            
            place = data.get("result", {})
            cache.set(cache_key, place, self.cache_ttl)
            return place
        
        except Exception as e:
            logger.error(f"Error in get_place_details: {e}")
            return None
    
    def get_place_photos(self, place_id: str, max_photos: int = 5) -> List[PhotoSchema]:
        """
        Extract photos from place details
        """
        try:
            place_details = self.get_place_details(place_id)
            if not place_details:
                return []
            
            photos = []
            photo_references = place_details.get("photos", [])
            
            for i, photo in enumerate(photo_references[:max_photos]):
                photo_ref = photo.get("photo_reference")
                if photo_ref:
                    # Construct photo URL using photo reference
                    photo_url = self._get_photo_url(photo_ref)
                    photos.append(PhotoSchema(
                        url=photo_url,
                        height=photo.get("height"),
                        width=photo.get("width"),
                        attribution=photo.get("html_attributions", [""])[0]
                    ))
            
            return photos
        
        except Exception as e:
            logger.error(f"Error in get_place_photos: {e}")
            return []
    
    def _get_photo_url(self, photo_reference: str, max_width: int = 600) -> str:
        """
        Generate photo URL from photo reference
        """
        return (
            f"{self.base_url}/place/photo?maxwidth={max_width}"
            f"&photo_reference={photo_reference}&key={self.api_key}"
        )
    
    def get_place_reviews(self, place_details: Dict[str, Any], max_reviews: int = 5) -> List[ReviewSchema]:
        """
        Extract reviews from place details
        """
        try:
            reviews = []
            place_reviews = place_details.get("reviews", [])
            
            for review_data in place_reviews[:max_reviews]:
                reviews.append(ReviewSchema(
                    author=review_data.get("author_name", "Anonymous"),
                    rating=float(review_data.get("rating", 4.5)),
                    text=review_data.get("text", ""),
                    time=review_data.get("relative_time_description", "")
                ))
            
            return reviews
        
        except Exception as e:
            logger.error(f"Error in get_place_reviews: {e}")
            return []
    
    def search_place_details(
        self,
        query: str,
        include_photos: bool = True,
        include_reviews: bool = True,
        max_photos: int = 5,
        max_reviews: int = 5,
        vibe: str = "Adventure",
        emoji: Optional[str] = None
    ) -> Optional[PlaceDetailsSchema]:
        """
        Complete workflow: search for place and get all details
        """
        try:
            # Step 1: Search for place
            place = self.text_search(query)
            if not place:
                return None
            
            place_id = place.get("place_id")
            
            # Step 2: Get detailed information
            place_details = self.get_place_details(place_id)
            if not place_details:
                return None
            
            # Step 3: Extract data
            photos = []
            if include_photos:
                photos = self.get_place_photos(place_id, max_photos)
            
            reviews = []
            if include_reviews:
                reviews = self.get_place_reviews(place_details, max_reviews)
            
            # Create response schema
            result = PlaceDetailsSchema(
                name=place_details.get("name", query),
                place_id=place_id,
                location=place_details.get("formatted_address", ""),
                description=self._generate_description(place_details, query),
                rating=float(place_details.get("rating", 4.5)),
                review_count=place_details.get("user_ratings_total", 0),
                photos=photos,
                reviews=reviews,
                website=place_details.get("website", ""),
                phone=place_details.get("formatted_phone_number", ""),
                vibe=vibe,
                emoji=emoji or "📍"
            )
            
            return result
        
        except Exception as e:
            logger.error(f"Error in search_place_details: {e}")
            return None
    
    def _generate_description(self, place_details: Dict[str, Any], query: str) -> str:
        """
        Generate a description based on place details and query
        """
        place_types = place_details.get("types", [])
        name = place_details.get("name", query)
        
        descriptions = {
            "amusement_park": f"Experience thrilling rides and attractions at {name}",
            "aquarium": f"Explore underwater wonders at {name}",
            "art_gallery": f"Discover beautiful artworks at {name}",
            "bar": f"Enjoy drinks and entertainment at {name}",
            "beach": f"Relax and enjoy the beautiful beach at {name}",
            "book_store": f"Browse and discover books at {name}",
            "cafe": f"Enjoy coffee and snacks at {name}",
            "camping": f"Camp under the stars at {name}",
            "church": f"Visit the historic {name}",
            "hiking_area": f"Trek through beautiful trails at {name}",
            "museum": f"Explore history and culture at {name}",
            "natural_feature": f"Discover natural beauty at {name}",
            "park": f"Enjoy outdoor activities at {name}",
            "restaurant": f"Taste delicious cuisine at {name}",
            "shrine": f"Experience spirituality at {name}",
            "spa": f"Relax and rejuvenate at {name}",
            "tourist_attraction": f"Visit the popular destination {name}",
            "zoo": f"See amazing animals at {name}",
        }
        
        for place_type in place_types:
            if place_type in descriptions:
                return descriptions[place_type]
        
        return f"Experience the amazing destination {name} with world-class facilities and services."

# Create singleton instance
google_places_service = GooglePlacesService()

def get_google_places_service() -> GooglePlacesService:
    """Get Google Places service instance"""
    return google_places_service
