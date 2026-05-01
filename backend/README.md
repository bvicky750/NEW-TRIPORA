# Travel Planning API - Backend Setup Guide

## Overview
This is a FastAPI backend service that fetches real-world travel place details from Google Places API with fallback to Unsplash for images.

## Features
- ✅ Google Places API integration (Text Search, Place Details, Photos, Reviews)
- ✅ Unsplash API fallback for images
- ✅ Built-in caching system (in-memory, Redis-ready)
- ✅ Comprehensive error handling
- ✅ CORS middleware configured
- ✅ Batch API endpoints for multiple places
- ✅ Production-ready code structure

## Prerequisites
- Python 3.8+
- Google Places API Key (from Google Cloud Console)
- Unsplash API Access Key (from unsplash.com/developers)
- Redis (optional, for production caching)

## Installation

### 1. Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your API keys
# GOOGLE_PLACES_API_KEY=your_key_here
# UNSPLASH_ACCESS_KEY=your_key_here
```

## Getting API Keys

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "Places API" and "Maps JavaScript API"
4. Create an API key
5. Add to `.env` as `GOOGLE_PLACES_API_KEY`

### Unsplash API
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Sign up and create an application
3. Copy your Access Key
4. Add to `.env` as `UNSPLASH_ACCESS_KEY`

## Running the Server

### Development
```bash
python main.py
# or
uvicorn main:app --reload --port 8000
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at `http://localhost:8000`

### API Documentation
- **Interactive Docs (Swagger)**: `http://localhost:8000/docs`
- **Alternative Docs (ReDoc)**: `http://localhost:8000/redoc`

## API Endpoints

### 1. Get Place Details
```
GET /place-details?query=Paragliding+Billing&vibe=Adventure
```

**Parameters:**
- `query` (required): Search query for the place
- `vibe` (optional): Activity type (default: "Adventure")
- `emoji` (optional): Emoji representation
- `include_photos` (optional): Include photos (default: true)
- `include_reviews` (optional): Include reviews (default: true)
- `max_photos` (optional): Maximum photos to return (default: 5)
- `max_reviews` (optional): Maximum reviews to return (default: 5)

**Response Example:**
```json
{
  "name": "Billing, Himachal Pradesh",
  "location": "Billing, Himachal Pradesh, India",
  "description": "Experience the thrill of soaring through the skies",
  "rating": 4.8,
  "review_count": 324,
  "price": "₹3,500",
  "currency": "₹",
  "vibe": "Adventure",
  "emoji": "🪂",
  "photos": [
    {
      "url": "https://maps.googleapis.com/maps/api/place/photo?...",
      "height": 1200,
      "width": 1600,
      "attribution": "Google Places"
    }
  ],
  "reviews": [
    {
      "author": "John Doe",
      "rating": 5.0,
      "text": "Best paragliding experience ever!",
      "time": "a month ago"
    }
  ]
}
```

### 2. Search Multiple Places
```
GET /places/search?queries=Paragliding+Billing,Scuba+Diving+Andaman&vibe=Adventure
```

### 3. Batch Place Details
```
POST /places/batch
```

**Request Body:**
```json
[
  {
    "query": "Paragliding Billing",
    "include_reviews": true,
    "include_photos": true,
    "max_photos": 5,
    "max_reviews": 5
  },
  {
    "query": "Scuba Diving Andaman",
    "include_reviews": true,
    "include_photos": true,
    "max_photos": 5,
    "max_reviews": 5
  }
]
```

### 4. Health Check
```
GET /health
```

## Project Structure
```
backend/
├── main.py                    # FastAPI app with endpoints
├── config.py                  # Configuration management
├── schemas.py                 # Pydantic models
├── cache.py                   # Caching implementation
├── google_places_service.py   # Google Places API integration
├── unsplash_service.py        # Unsplash API integration
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── .env                       # Actual environment (git-ignored)
```

## Caching Strategy

The backend implements two-tier caching:

1. **In-Memory Cache** (default)
   - Fast, no external dependencies
   - Data stored per server instance
   - Good for development

2. **Redis Cache** (production-ready)
   - Distributed caching
   - Shared across multiple instances
   - Set `REDIS_URL` in `.env`

**Cache Keys:**
- Text Search: `md5(args=['query'])`
- Place Details: `md5(args=['place_id'])`
- Unsplash Search: `md5(args=['query', 'page', 'per_page'])`

**TTL:** 24 hours (configurable via `CACHE_TTL`)

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status_code": 400
}
```

**Common Errors:**
- `404`: Place not found
- `403`: Invalid API key or quota exceeded
- `500`: Server error

## Rate Limiting
Google Places API has rate limits:
- Free tier: 1000 requests/day
- Paid tier: based on usage

Caching helps reduce API calls significantly.

## Best Practices

1. **Use Caching**
   - Leverage built-in caching to reduce API calls
   - Cache TTL is 24 hours by default

2. **Batch Requests**
   - Use batch endpoint for multiple places
   - More efficient than individual requests

3. **Error Handling**
   - Always check response status codes
   - Implement fallback logic (e.g., Unsplash images)

4. **Rate Limiting**
   - Monitor API usage
   - Implement request throttling if needed

5. **Security**
   - Never commit `.env` file
   - Use environment variables for sensitive data
   - Validate input parameters

## Troubleshooting

### "Invalid API Key" Error
- Verify `GOOGLE_PLACES_API_KEY` in `.env`
- Check API is enabled in Google Cloud Console
- Ensure billing is enabled

### "Place Not Found"
- Try different search queries
- Check if place name is correct
- Use city/country for better results

### Empty Photos/Reviews
- May indicate limited data from Google Places
- Fallback to Unsplash will provide images
- Some places have fewer reviews

### Rate Limit Exceeded
- Cache is working but you've hit daily limit
- Upgrade to paid tier or wait 24 hours
- Implement request queuing

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production
```bash
export GOOGLE_PLACES_API_KEY=your_production_key
export UNSPLASH_ACCESS_KEY=your_production_key
export REDIS_URL=redis://production-redis:6379
export CORS_ORIGINS=https://yourdomain.com
```

## Testing

### Test individual endpoint
```bash
curl "http://localhost:8000/place-details?query=Paragliding%20Billing"
```

### Test with custom parameters
```bash
curl "http://localhost:8000/place-details?query=Scuba%20Diving%20Andaman&max_photos=3&max_reviews=3"
```

## Support & Documentation

- FastAPI Docs: `http://localhost:8000/docs`
- Google Places API: https://developers.google.com/maps/documentation/places/web-service/overview
- Unsplash API: https://unsplash.com/developers

## License
MIT License - feel free to use for your projects!
