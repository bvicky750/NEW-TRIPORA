from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import logging
from schemas import PlaceDetailsSchema, PlaceSearchSchema, ErrorResponseSchema, PhotoSchema
from opentripmap_service import get_opentripmap_service
from unsplash_service import get_unsplash_service
from mock_reviews import MockReviewGenerator
from config import get_settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Travel Planning API",
    description="API for fetching real-world travel place details with images and mock reviews",
    version="1.0.0"
)

# Get settings
settings = get_settings()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency injection
def get_opentripmap():
    return get_opentripmap_service()

def get_unsplash():
    return get_unsplash_service()

# Routes
@app.get("/", tags=["Health"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Travel Planning API is running",
        "version": "1.0.0",
        "apis": {
            "places": "OpenTripMap (Free)",
            "images": "Unsplash",
            "reviews": "Generated (Mock)"
        }
    }

@app.get(
    "/place-details",
    response_model=PlaceDetailsSchema,
    tags=["Places"],
    summary="Get detailed information about a place",
    responses={
        200: {"description": "Successfully retrieved place details"},
        404: {"model": ErrorResponseSchema, "description": "Place not found"},
        500: {"model": ErrorResponseSchema, "description": "Internal server error"}
    }
)
def get_place_details(
    query: str = Query(..., description="Search query for the place (e.g., 'Paragliding Billing')"),
    vibe: str = Query("Adventure", description="Activity type/vibe"),
    emoji: Optional[str] = Query(None, description="Emoji representation"),
    include_photos: bool = Query(True, description="Include photos in response"),
    include_reviews: bool = Query(True, description="Include reviews in response"),
    max_photos: int = Query(5, ge=1, le=20, description="Maximum number of photos"),
    max_reviews: int = Query(5, ge=1, le=20, description="Maximum number of reviews"),
    opentripmap = Depends(get_opentripmap),
    unsplash = Depends(get_unsplash)
):
    """
    Fetch detailed information about a place including images, reviews, and ratings.
    
    - **query**: Search query for the place
    - **vibe**: Activity type (Adventure, Relaxation, Spiritual, etc.)
    - **emoji**: Emoji representation of the activity
    - **include_photos**: Whether to include photos
    - **include_reviews**: Whether to include reviews
    - **max_photos**: Maximum number of photos to return
    - **max_reviews**: Maximum number of reviews to return
    """
    
    try:
        logger.info(f"Fetching place details for query: {query}")
        
        # Search for places using OpenTripMap
        places = opentripmap.search_places(query, limit=1)
        
        if not places:
            logger.warning(f"No places found for query: {query}")
            # Create a fallback result based on the query
            place = _create_fallback_place(query, vibe, emoji)
        else:
            place = places[0]
        
        # Get images from Unsplash
        photos = []
        if include_photos:
            unsplash_photos = unsplash.search_photos(query, per_page=max_photos)
            photos = unsplash_photos if unsplash_photos else []
        
        # Generate mock reviews
        reviews = []
        if include_reviews:
            reviews = MockReviewGenerator.generate_reviews(place.get("name", query), max_reviews)
        
        # Calculate average rating from reviews
        avg_rating = MockReviewGenerator.calculate_average_rating(reviews)
        
        # Build response
        result = PlaceDetailsSchema(
            name=place.get("name", query),
            place_id=place.get("id"),
            location=place.get("location", _extract_location_from_query(query)),
            description=place.get("description", _create_fallback_description(query)),
            rating=avg_rating,
            review_count=len(reviews),
            photos=photos,
            reviews=reviews,
            vibe=vibe,
            emoji=emoji or _get_default_emoji(vibe)
        )
        
        logger.info(f"Successfully fetched place details for: {query}")
        return result
    
    except Exception as e:
        logger.error(f"Error fetching place details: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching place details: {str(e)}"
        )

@app.get(
    "/places/search",
    response_model=List[PlaceDetailsSchema],
    tags=["Places"],
    summary="Search multiple places",
    responses={
        200: {"description": "Successfully retrieved places"},
        500: {"model": ErrorResponseSchema, "description": "Internal server error"}
    }
)
def search_places(
    queries: str = Query(..., description="Comma-separated list of place queries"),
    vibe: str = Query("Adventure", description="Activity type/vibe"),
    include_photos: bool = Query(True, description="Include photos in response"),
    include_reviews: bool = Query(True, description="Include reviews in response"),
    max_photos: int = Query(3, ge=1, le=10),
    max_reviews: int = Query(3, ge=1, le=10),
    opentripmap = Depends(get_opentripmap),
    unsplash = Depends(get_unsplash)
):
    """
    Search for multiple places and return detailed information for each.
    
    - **queries**: Comma-separated list of place queries
    - **vibe**: Activity type
    - **include_photos**: Whether to include photos
    - **include_reviews**: Whether to include reviews
    """
    
    try:
        place_list = [q.strip() for q in queries.split(",") if q.strip()]
        if not place_list:
            raise HTTPException(status_code=400, detail="No queries provided")
        
        results = []
        for query in place_list:
            # Search for places
            places = opentripmap.search_places(query, limit=1)
            
            if not places:
                place = _create_fallback_place(query, vibe)
            else:
                place = places[0]
            
            # Get images
            photos = []
            if include_photos:
                unsplash_photos = unsplash.search_photos(query, per_page=max_photos)
                photos = unsplash_photos if unsplash_photos else []
            
            # Generate reviews
            reviews = []
            if include_reviews:
                reviews = MockReviewGenerator.generate_reviews(place.get("name", query), max_reviews)
            
            avg_rating = MockReviewGenerator.calculate_average_rating(reviews)
            
            result = PlaceDetailsSchema(
                name=place.get("name", query),
                place_id=place.get("id"),
                location=place.get("location", _extract_location_from_query(query)),
                description=place.get("description", _create_fallback_description(query)),
                rating=avg_rating,
                review_count=len(reviews),
                photos=photos,
                reviews=reviews,
                vibe=vibe
            )
            results.append(result)
        
        if not results:
            raise HTTPException(status_code=404, detail="No places found")
        
        return results
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error searching places: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post(
    "/places/batch",
    response_model=List[PlaceDetailsSchema],
    tags=["Places"],
    summary="Fetch details for multiple predefined places"
)
def batch_place_details(
    places: List[PlaceSearchSchema],
    opentripmap = Depends(get_opentripmap),
    unsplash = Depends(get_unsplash)
):
    """
    Fetch details for multiple places in a single request.
    
    Useful for populating the Explore page with multiple activities.
    """
    
    try:
        results = []
        
        for place_request in places:
            # Search for places
            found_places = opentripmap.search_places(place_request.query, limit=1)
            
            if not found_places:
                place = _create_fallback_place(
                    place_request.query,
                    getattr(place_request, 'vibe', 'Adventure')
                )
            else:
                place = found_places[0]
            
            # Get images
            photos = []
            if place_request.include_photos:
                unsplash_photos = unsplash.search_photos(
                    place_request.query,
                    per_page=place_request.max_photos
                )
                photos = unsplash_photos if unsplash_photos else []
            
            # Generate reviews
            reviews = []
            if place_request.include_reviews:
                reviews = MockReviewGenerator.generate_reviews(
                    place.get("name", place_request.query),
                    place_request.max_reviews
                )
            
            avg_rating = MockReviewGenerator.calculate_average_rating(reviews)
            
            result = PlaceDetailsSchema(
                name=place.get("name", place_request.query),
                place_id=place.get("id"),
                location=place.get("location", _extract_location_from_query(place_request.query)),
                description=place.get("description", _create_fallback_description(place_request.query)),
                rating=avg_rating,
                review_count=len(reviews),
                photos=photos,
                reviews=reviews,
                vibe=getattr(place_request, 'vibe', 'Adventure'),
                emoji=getattr(place_request, 'emoji', None)
            )
            results.append(result)
        
        return results
    
    except Exception as e:
        logger.error(f"Error in batch place details: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health", tags=["Health"])
def get_health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "api": "Travel Planning API",
        "version": "1.0.0",
        "services": {
            "opentripmap": "operational (free)",
            "unsplash": "configured" if settings.unsplash_access_key != "your_unsplash_key_here" else "not_configured",
            "mock_reviews": "operational"
        }
    }

# Helper functions
def _create_fallback_place(query: str, vibe: str = "Adventure", emoji: str = None) -> dict:
    """Create a fallback place object when API doesn't return results"""
    return {
        "id": f"fallback_{query.replace(' ', '_')}",
        "name": query,
        "location": _extract_location_from_query(query),
        "description": _create_fallback_description(query),
        "category": vibe.lower(),
        "coordinates": {"lat": 0, "lon": 0}
    }

def _extract_location_from_query(query: str) -> str:
    """Extract location from query string"""
    parts = query.split()
    # Get the last 1-2 words as location
    if len(parts) > 1:
        return " ".join(parts[-2:])
    return query

def _create_fallback_description(query: str) -> str:
    """Create a fallback description based on query"""
    descriptions = {
        "paragliding": "Experience the thrill of soaring through the skies with professional guides.",
        "scuba": "Explore the underwater world and discover amazing marine life.",
        "trekking": "Challenge yourself with stunning mountain trails and breathtaking views.",
        "safari": "Witness incredible wildlife in their natural habitat.",
        "rafting": "Feel the rush of navigating through exciting river rapids.",
        "beach": "Relax and enjoy pristine sandy shores with crystal clear waters.",
        "houseboat": "Experience a unique stay on traditional houseboats with scenic views.",
        "desert": "Camp under the stars and experience the beauty of desert landscapes.",
        "surfing": "Ride the waves and enjoy the thrill of the ocean.",
        "yoga": "Find inner peace and wellness through guided yoga sessions.",
        "temple": "Explore sacred spiritual sites and ancient architecture.",
        "food": "Taste authentic local cuisine and culinary delights.",
        "cooking": "Learn to cook traditional dishes from expert chefs.",
        "cultural": "Immerse yourself in vibrant local culture and traditions.",
    }
    
    # Find matching description
    for key, desc in descriptions.items():
        if key in query.lower():
            return desc
    
    return f"An amazing {query} experience awaits you. Discover the best attractions and create lasting memories."

def _get_default_emoji(vibe: str) -> str:
    """Get default emoji based on vibe"""
    emoji_map = {
        "Adventure": "🎉",
        "Relaxation": "😌",
        "Spiritual": "🕉️",
        "Foodie": "🍽️",
        "Nature": "🌿",
        "Nightlife": "🌙",
    }
    return emoji_map.get(vibe, "✨")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "error": exc.detail,
        "code": f"HTTP_{exc.status_code}",
        "status_code": exc.status_code
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
