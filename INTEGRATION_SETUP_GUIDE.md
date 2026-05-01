# Travel Planning App - Real-World Data Integration Guide

## 🎯 Overview

This guide explains how to integrate real-world data into your travel planning app using:
- **OpenTripMap API** (Free) - Tourist places and locations
- **Unsplash API** (Free tier) - High-quality images
- **Mock Reviews** (Generated) - Realistic user reviews

**No paid APIs required!**

---

## 📋 Prerequisites

### Backend
- Python 3.8+
- FastAPI
- Requests library

### Frontend
- Node.js 14+
- React 18+
- Vite

---

## 🚀 Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create or update `backend/.env`:

```env
# OpenTripMap API (FREE - No key required)
# Will fetch real tourist places and locations

# Unsplash API Configuration (Optional - Free tier available)
# Get your key at: https://unsplash.com/developers
UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# Redis Configuration (Optional - uses in-memory cache by default)
USE_REDIS=false
REDIS_URL=redis://localhost:6379

# Cache TTL (in seconds)
CACHE_TTL=86400

# Server configuration
API_PORT=8000
API_HOST=0.0.0.0
```

### 3. Get Unsplash API Key (Optional)

1. Visit: https://unsplash.com/developers
2. Sign up for a free developer account
3. Create an application
4. Copy the "Access Key"
5. Add it to your `.env` file

**Note**: The app will work without Unsplash key but won't show images. You can optionally configure it later.

### 4. Run the Backend

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### 5. Test the API

Visit: http://localhost:8000/docs

You'll see the interactive API documentation where you can test endpoints.

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create or update `.env.local` in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Update Vite Config (if needed)

Make sure `vite.config.js` has:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

### 4. Run the Frontend

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## 📡 API Endpoints

### Main Endpoint: Get Place Details

```bash
GET /place-details?query=paragliding%20billing&vibe=Adventure&include_photos=true&include_reviews=true
```

**Parameters:**
- `query` (required): Place/activity name (e.g., "Paragliding Billing")
- `vibe` (optional): Activity type (Adventure, Relaxation, Spiritual, Foodie, Nature, Nightlife)
- `emoji` (optional): Emoji representation
- `include_photos` (optional): Include images (default: true)
- `include_reviews` (optional): Include reviews (default: true)
- `max_photos` (optional): Number of images (1-20, default: 5)
- `max_reviews` (optional): Number of reviews (1-20, default: 5)

**Response:**
```json
{
  "name": "Paragliding Billing",
  "location": "Billing Himachal Pradesh",
  "description": "Experience the thrill of soaring through the skies...",
  "rating": 4.8,
  "review_count": 5,
  "photos": [
    {
      "url": "https://images.unsplash.com/...",
      "height": 1080,
      "width": 1920,
      "attribution": "Photo by John Doe on Unsplash"
    }
  ],
  "reviews": [
    {
      "author": "Rajesh Singh",
      "rating": 5,
      "text": "Absolutely amazing experience! Highly recommend.",
      "time": "2 weeks ago"
    }
  ],
  "vibe": "Adventure",
  "emoji": "🪂"
}
```

### Batch Endpoint: Get Multiple Places

```bash
POST /places/batch
```

**Request Body:**
```json
[
  {
    "query": "Paragliding Billing",
    "vibe": "Adventure",
    "emoji": "🪂",
    "include_photos": true,
    "include_reviews": true,
    "max_photos": 3,
    "max_reviews": 3
  }
]
```

### Health Check

```bash
GET /health
```

---

## 🔄 How It Works

### Data Flow

```
Frontend (React)
    ↓
API Client (placeClient.js)
    ↓
FastAPI Backend (main.py)
    ↓
OpenTripMap Service ──→ Get tourist places & locations
    ↓
Unsplash Service ──→ Fetch high-quality images
    ↓
Mock Review Generator ──→ Generate realistic reviews
    ↓
Response to Frontend
    ↓
Display in Explore Page
```

### Component Integration

#### Explore Component (`src/pages/Explore/Explore.jsx`)

```javascript
import { useBatchPlaceDetails } from '../../hooks/usePlaces';

// Define places to fetch
const defaultPlaces = [
  { query: 'Paragliding Billing Himachal', emoji: '🪂', vibe: 'Adventure' },
  { query: 'Yoga Retreat Rishikesh', emoji: '🧘', vibe: 'Relaxation' },
];

// Fetch all places
const { data: apiPlaces, loading, error } = useBatchPlaceDetails(defaultPlaces, {
  includePhotos: true,
  includeReviews: true,
  maxPhotos: 3,
  maxReviews: 5,
});
```

#### Modal Component

The Modal shows:
- Dynamic image carousel (from Unsplash)
- Generated mock reviews with ratings
- Place rating and description
- Book Now button

---

## 🏗️ Architecture

### Backend Services

#### `opentripmap_service.py`
- Searches for tourist places by location name
- Returns place data with coordinates and categories
- Uses caching for performance

#### `unsplash_service.py`
- Fetches high-quality images by search query
- Returns image URLs with metadata
- Handles attribution automatically

#### `mock_reviews.py`
- Generates realistic mock reviews
- Creates names from predefined lists
- Generates ratings (4.5 average - realistic)
- Adds timestamps
- Matches reviews to activity type

#### `main.py`
- FastAPI application with three endpoints
- Orchestrates data from different services
- Fallback handling if one service fails
- Error handling and logging

### Frontend Components

#### `hooks/usePlaces.js`
- `usePlaceDetails()` - Fetch single place
- `useSearchPlaces()` - Search multiple places
- `useBatchPlaceDetails()` - Fetch predefined batch

#### `api/placeClient.js`
- HTTP client with retry logic
- Error handling
- Parameter validation
- Timeout handling

#### `pages/Explore/Explore.jsx`
- Grid layout of places
- Filter by vibe/category
- Search functionality
- Modal popup with full details
- Loading states and error handling

---

## 🔧 Customization

### Adding New Places

Edit `src/pages/Explore/Explore.jsx`:

```javascript
const defaultPlaces = [
  // ... existing places
  { 
    query: 'New Activity City', 
    emoji: '🎯', 
    vibe: 'Adventure', 
    name: 'Custom Name' 
  },
];
```

### Changing Review Generation

Modify `backend/mock_reviews.py`:
- Update `FIRST_NAMES` and `LAST_NAMES` lists
- Customize review templates in `REVIEWS_TEMPLATES`
- Adjust rating distribution in `generate_reviews()`

### Custom Descriptions

Edit `backend/main.py` - Update `_create_fallback_description()` function:

```python
descriptions = {
    "your_keyword": "Your custom description",
}
```

---

## 📊 Performance Optimization

### Caching

The app uses in-memory caching (24 hours TTL):
- OpenTripMap results cached
- Unsplash image searches cached
- Mock reviews regenerated per request

To enable Redis caching:

```env
USE_REDIS=true
REDIS_URL=redis://localhost:6379
```

### Image Optimization

Images are optimized at:
- Unsplash size: `landscape` orientation
- Max resolution: handled by Unsplash
- Lazy loading in frontend

---

## 🐛 Troubleshooting

### API Connection Issues

**Error**: `NETWORK_ERROR`

**Solution**:
```bash
# Check backend is running
curl http://localhost:8000/health

# Check CORS headers
# Frontend must be on localhost:5173
```

### No Images Showing

**Error**: Images not loading

**Solution**:
1. Check Unsplash API key in `.env`
2. Try without images first (optional)
3. Verify Unsplash API quota

### No Reviews Showing

Mock reviews should always show. If not:
1. Check backend logs
2. Verify `include_reviews=true` in request
3. Check `max_reviews` parameter

### Slow Performance

**Solution**:
1. Enable Redis caching
2. Reduce `max_photos` and `max_reviews`
3. Check network latency
4. Use browser DevTools Network tab

---

## 🚀 Deployment

### Backend Deployment (Heroku Example)

```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
npm run build
vercel --prod
```

### Update API URL

Change `VITE_API_BASE_URL` to your production URL:

```env
VITE_API_BASE_URL=https://your-api.herokuapp.com
```

---

## 📚 API Documentation

Full interactive API documentation available at:

```
http://localhost:8000/docs        # Swagger UI
http://localhost:8000/redoc       # ReDoc
```

---

## 🤝 Testing

### Test with cURL

```bash
# Get place details
curl "http://localhost:8000/place-details?query=paragliding%20billing&vibe=Adventure"

# Health check
curl http://localhost:8000/health

# Batch places
curl -X POST http://localhost:8000/places/batch \
  -H "Content-Type: application/json" \
  -d '[{"query":"Paragliding Billing","vibe":"Adventure"}]'
```

### Test Frontend

```bash
# Run tests (if configured)
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📝 Notes

- **OpenTripMap API**: Completely free, no rate limiting for basic requests
- **Unsplash API**: 50 requests/hour on free tier (sufficient for most use cases)
- **Mock Reviews**: Generated deterministically - same query = same reviews
- **Caching**: Reduces API calls significantly
- **CORS**: Already configured for localhost

---

## 🎓 Learning Resources

- [OpenTripMap API Docs](https://opentripmap.com/api)
- [Unsplash API Docs](https://unsplash.com/developers)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Hooks Docs](https://react.dev/reference/react)

---

## ✅ Checklist for Production

- [ ] Update CORS origins to production domain
- [ ] Configure Redis for caching
- [ ] Add Unsplash API key
- [ ] Update frontend API URL
- [ ] Add error monitoring (e.g., Sentry)
- [ ] Add logging
- [ ] Test all endpoints
- [ ] Configure rate limiting
- [ ] Add database for persistent data (optional)
- [ ] Set up CI/CD pipeline

---

**Built with ❤️ using free APIs and open-source tools!**
