import requests
import logging
from typing import List, Dict, Optional, Any, Tuple
from config import get_settings
from cache import get_cache

logger = logging.getLogger(__name__)
settings = get_settings()
cache = get_cache()

class OpenTripMapService:
    """
    Service to interact with OpenTripMap API for tourist places.
    Free API - no authentication required
    """
    
    def __init__(self):
        self.base_url = "https://api.opentripmap.com/0.1"
        self.cache_ttl = settings.cache_ttl
    
    def _get_coordinates(self, query: str) -> Optional[Tuple[float, float]]:
        """
        Get coordinates from location name using OpenTripMap's geoname endpoint
        Returns tuple of (lon, lat)
        """
        cache_key = cache.generate_key("opentripmap_coords", query)
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for coordinates: {query}")
            return cached_result
        
        try:
            url = f"{self.base_url}/geonames"
            params = {
                "name": query,
                "featuretype": "settlement",
                "limit": 1
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            if data.get("features"):
                feature = data["features"][0]
                coords = (
                    feature["geometry"]["coordinates"][0],  # lon
                    feature["geometry"]["coordinates"][1]   # lat
                )
                cache.set(cache_key, coords, self.cache_ttl)
                return coords
            return None
        
        except Exception as e:
            logger.error(f"Error getting coordinates for {query}: {e}")
            return None
    
    def search_places(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search for tourist places by query name
        Returns list of places with name, description, coordinates, and category
        """
        cache_key = cache.generate_key("opentripmap_search", query, limit)
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for places search: {query}")
            return cached_result
        
        # Extract location from query (e.g., "Paragliding Billing" -> get coords for "Billing")
        query_parts = query.split()
        location_query = query_parts[-1] if len(query_parts) > 1 else query
        
        coords = self._get_coordinates(location_query)
        if not coords:
            logger.warning(f"Could not find coordinates for: {location_query}")
            return []
        
        lon, lat = coords
        radius = 1000  # 1km radius
        
        try:
            url = f"{self.base_url}/places/radius"
            params = {
                "lon": lon,
                "lat": lat,
                "radius": radius,
                "limit": limit
            }
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            places = []
            
            for place in data.get("features", [])[:limit]:
                place_data = {
                    "id": place.get("id"),
                    "name": place.get("properties", {}).get("name", "Unknown"),
                    "category": place.get("properties", {}).get("kinds", ""),
                    "coordinates": {
                        "lat": place["geometry"]["coordinates"][1],
                        "lon": place["geometry"]["coordinates"][0]
                    },
                    "distance": place.get("properties", {}).get("distance")
                }
                places.append(place_data)
            
            cache.set(cache_key, places, self.cache_ttl)
            return places
        
        except Exception as e:
            logger.error(f"Error searching places for {query}: {e}")
            return []
    
    def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a specific place from OpenTripMap
        """
        cache_key = cache.generate_key("opentripmap_details", place_id)
        cached_result = cache.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for place details: {place_id}")
            return cached_result
        
        try:
            url = f"{self.base_url}/places/xid/{place_id}"
            params = {"format": "json"}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            place_details = {
                "id": data.get("xid"),
                "name": data.get("name"),
                "description": data.get("wikipedia_extracts", {}).get("text", "") or data.get("info", {}).get("descr", ""),
                "rate": data.get("rate"),
                "kinds": data.get("kinds"),
                "wikidata": data.get("wikidata"),
                "image": data.get("image"),
                "url": data.get("url")
            }
            
            cache.set(cache_key, place_details, self.cache_ttl)
            return place_details
        
        except Exception as e:
            logger.error(f"Error getting place details for {place_id}: {e}")
            return None


# Create singleton instance
opentripmap_service = OpenTripMapService()

def get_opentripmap_service() -> OpenTripMapService:
    """Get OpenTripMap service instance"""
    return opentripmap_service
