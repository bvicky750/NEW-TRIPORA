from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReviewSchema(BaseModel):
    author: str = Field(..., description="Review author name")
    rating: float = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    text: str = Field(..., description="Review text")
    time: Optional[str] = Field(None, description="Review timestamp")

class PhotoSchema(BaseModel):
    url: str = Field(..., description="Photo URL")
    height: Optional[int] = None
    width: Optional[int] = None
    attribution: Optional[str] = None

class PlaceDetailsSchema(BaseModel):
    name: str = Field(..., description="Place name")
    place_id: Optional[str] = None
    location: str = Field(..., description="Place location/address")
    description: str = Field(..., description="Place description")
    rating: float = Field(..., ge=1, le=5, description="Average rating")
    review_count: int = Field(..., description="Total number of reviews")
    price: Optional[str] = None
    currency: Optional[str] = "₹"
    photos: List[PhotoSchema] = Field(default_factory=list, description="List of place photos")
    reviews: List[ReviewSchema] = Field(default_factory=list, description="List of reviews")
    website: Optional[str] = None
    phone: Optional[str] = None
    opening_hours: Optional[dict] = None
    types: Optional[List[str]] = None
    vibe: str = Field(default="Adventure", description="Activity type/vibe")
    emoji: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Paragliding Billing",
                "location": "Billing, Himachal Pradesh",
                "description": "Experience the thrill of soaring through the skies",
                "rating": 4.8,
                "review_count": 324,
                "price": "₹3,500",
                "currency": "₹",
                "vibe": "Adventure",
                "emoji": "🪂"
            }
        }

class PlaceSearchSchema(BaseModel):
    query: str = Field(..., description="Search query for place")
    include_reviews: bool = Field(default=True, description="Include reviews in response")
    include_photos: bool = Field(default=True, description="Include photos in response")
    max_photos: int = Field(default=5, description="Maximum photos to return")
    max_reviews: int = Field(default=5, description="Maximum reviews to return")
    vibe: str = Field(default="Adventure", description="Activity type/vibe")
    emoji: Optional[str] = Field(default=None, description="Emoji representation")

class ErrorResponseSchema(BaseModel):
    error: str = Field(..., description="Error message")
    code: str = Field(..., description="Error code")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
