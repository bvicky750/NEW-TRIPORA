# Travel Planning App - API Integration Guide

## 🎯 Overview

You now have a complete backend and frontend setup for real-world travel data integration using:
- **FastAPI Backend** - Fetches real data from Google Places API
- **React Frontend** - Displays dynamic place data with images and reviews
- **Built-in Caching** - Reduces API calls and improves performance
- **Error Handling** - Graceful fallbacks and user-friendly messages

## 📁 Project Structure

```
tripora/
├── backend/                          # FastAPI backend
│   ├── main.py                      # Main FastAPI application
│   ├── config.py                    # Configuration management
│   ├── schemas.py                   # Pydantic models
│   ├── cache.py                     # Caching utilities
│   ├── google_places_service.py     # Google Places API integration
│   ├── unsplash_service.py          # Unsplash API (fallback)
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variables template
│   └── README.md                    # Backend setup guide
│
├── src/
│   ├── api/
│   │   └── placeClient.js           # API client utility
│   │
│   ├── hooks/
│   │   └── usePlaces.js             # Custom React hooks
│   │
│   └── pages/Explore/
│       ├── Explore.jsx              # Updated Explore component
│       └── Explore.css              # Updated styles with loading states
│
└── .env.example                      # Frontend environment template
```

## 🚀 Quick Start

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
# GOOGLE_PLACES_API_KEY=your_key_here
# UNSPLASH_ACCESS_KEY=your_key_here
```

### Step 2: Get API Keys

**Google Places API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Places API" and "Maps JavaScript API"
4. Create an API key in "Credentials"
5. Add to `.env`: `GOOGLE_PLACES_API_KEY=your_key`

**Unsplash API (Optional Fallback):**
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an application
3. Copy your Access Key
4. Add to `.env`: `UNSPLASH_ACCESS_KEY=your_key`

### Step 3: Start Backend

```bash
# From backend directory
python main.py
# or
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
API Docs at `http://localhost:8000/docs`

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory
cd tripora

# Make sure you have .env file with
VITE_API_BASE_URL=http://localhost:8000

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev
```

## 🔌 API Integration Details

### Architecture Overview

```
┌─────────────────────┐
│   React Frontend    │
│   (Explore.jsx)     │
└──────────┬──────────┘
           │ useBatchPlaceDetails()
           ▼
┌─────────────────────┐
│   placeClient.js    │
│  (API HTTP calls)   │
└──────────┬──────────┘
           │ POST/GET requests
           ▼
┌─────────────────────┐
│  FastAPI Backend    │
│   (main.py)         │
└──────────┬──────────┘
           │
      ┌────┴────┐
      ▼         ▼
┌──────────┐ ┌──────────┐
│  Google  │ │ Unsplash │
│ Places   │ │  (backup)│
│   API    │ │   API    │
└──────────┘ └──────────┘
```

### Frontend Data Flow

1. **Component Mounts** → `useBatchPlaceDetails()` hook called
2. **API Client** → Makes requests to backend
3. **Backend Processes** → Fetches from Google Places API + caching
4. **Response Received** → Rich place data with images/reviews
5. **Component Renders** → Displays real cards with actual data
6. **User Clicks Card** → Modal opens showing full details

### Hook Usage Example

```javascript
// In Explore component
const { data: apiPlaces, loading, error } = useBatchPlaceDetails(
  defaultPlaces,
  {
    includePhotos: true,
    includeReviews: true,
    maxPhotos: 3,
    maxReviews: 3,
  }
);

// Data structure:
// {
//   name: "Paragliding Billing",
//   location: "Billing, Himachal Pradesh, India",
//   rating: 4.8,
//   review_count: 324,
//   price: "₹3,500",
//   photos: [
//     { url: "https://...", height: 1200, width: 1600 }
//   ],
//   reviews: [
//     { author: "John", rating: 5, text: "Amazing!" }
//   ]
// }
```

### Backend Endpoints

**Get Single Place Details**
```
GET /place-details?query=Paragliding+Billing&vibe=Adventure&max_photos=3&max_reviews=3
```

**Search Multiple Places**
```
GET /places/search?queries=Paragliding+Billing,Scuba+Diving+Andaman&vibe=Adventure
```

**Batch Details**
```
POST /places/batch
Body: [
  { query: "Paragliding Billing", ... }
]
```

**Health Check**
```
GET /health
```

## 🔄 Caching Strategy

### How Caching Works

1. **First Request**: 
   - Frontend calls backend
   - Backend queries Google Places API
   - Response cached for 24 hours
   - Frontend receives data

2. **Subsequent Requests** (within 24 hours):
   - Backend returns cached data instantly
   - No Google API call made
   - Saves quota and improves speed

### Cache Keys Generated From:
- Query string (e.g., "Paragliding Billing")
- Place ID (from Google)
- Request parameters

### Clear Cache (if needed):
```python
# In backend, call
from cache import get_cache
cache = get_cache()
cache.clear()
```

## 📊 Example API Response

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
      "rating": 5,
      "text": "Best paragliding experience ever!",
      "time": "a month ago"
    }
  ]
}
```

## ⚠️ Error Handling

### Frontend Error Handling
- **Loading State**: Shows skeleton cards while fetching
- **Error Banner**: Displays error message if API fails
- **Fallback UI**: Shows emoji if image fails to load
- **Graceful Degradation**: App still functional with limited data

### Backend Error Handling
- **Invalid API Key**: Returns 403 status
- **Place Not Found**: Returns 404 + tries fallback to Unsplash
- **Rate Limiting**: Caching prevents quota issues
- **Network Errors**: Proper error messages returned

### Common Issues & Solutions

**Issue**: "Invalid API key"
- Solution: Verify API key in `.env` and check Google Cloud Console

**Issue**: "Place not found"
- Solution: Try different search query (e.g., "Paragliding Billing Himachal Pradesh")

**Issue**: Backend connection error
- Solution: Ensure backend is running on correct port (8000)
- Check `VITE_API_BASE_URL` in `.env`

**Issue**: No images in popup
- Solution: Some places have limited data; Unsplash fallback provides images

## 🎨 UI/UX Features

### Loading States
- Skeleton loader cards while fetching
- Disabled filter chips during load
- Loading message in header

### Modal Features
- Image carousel with navigation
- Image counter (e.g., "1 / 3")
- Real reviews with ratings
- Responsive design
- Smooth animations

### Search & Filtering
- Search by activity name or location
- Filter by vibe (Adventure, Relaxation, etc.)
- Dynamic results update

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   ```bash
   # Add to .gitignore
   .env
   backend/.env
   ```

2. **API Keys**
   - Store in environment variables
   - Use different keys for dev/production
   - Rotate keys regularly

3. **CORS Configuration**
   - Configured for localhost development
   - Update in production with actual domain

4. **Request Validation**
   - Pydantic models validate all inputs
   - Rate limiting can be added

## 📈 Performance Optimization

### Current Optimizations
- ✅ Caching (24-hour TTL)
- ✅ Lazy loading images
- ✅ Batch API requests
- ✅ Fallback to Unsplash for images

### Future Optimizations
- Add Redis for distributed caching
- Implement request throttling
- Compress images on backend
- Add CDN for images
- Implement pagination for large result sets

## 🧪 Testing the Integration

### Test Flow

1. **Backend Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Test Single Place**
   ```bash
   curl "http://localhost:8000/place-details?query=Paragliding%20Billing"
   ```

3. **Open Frontend**
   - Navigate to Explore page
   - Should see loading skeletons initially
   - Cards populated after 5-10 seconds
   - Click card to see modal with images and reviews

4. **Test Error Handling**
   - Stop backend server
   - Check if error banner appears
   - Verify graceful fallback

## 📚 Additional Resources

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Unsplash API Docs](https://unsplash.com/developers)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Hooks Guide](https://react.dev/reference/react)

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process and restart
```

### Frontend can't connect to backend
```bash
# Check VITE_API_BASE_URL in .env
# Make sure backend is running
# Check browser console for CORS errors
```

### No images showing
```bash
# Check if images are loading in Network tab
# Verify Unsplash API key if Google images fail
# Check image URLs in API response
```

### Quota exceeded error
```bash
# This means you've hit API daily limit
# Solution: Wait 24 hours (midnight UTC)
# OR: Upgrade to paid Google Cloud tier
# Solution: Caching already reduces calls significantly
```

## 🎉 Next Steps

1. **Customize Place Queries**
   - Edit `defaultPlaces` in `Explore.jsx`
   - Add more activities

2. **Add Booking System**
   - Implement "Book Now" button handler
   - Connect to payment gateway

3. **Add User Reviews**
   - Let users submit their own reviews
   - Store in database

4. **Enhance Search**
   - Add location-based search
   - Add date range filtering
   - Add price filtering

5. **Production Deployment**
   - Deploy backend to cloud (Heroku, AWS, etc.)
   - Deploy frontend to Vercel/Netlify
   - Setup proper SSL certificates
   - Configure production environment variables

## ✅ Checklist

- [ ] Backend running on port 8000
- [ ] Frontend connects to backend successfully
- [ ] Google Places API key added
- [ ] Explore page loads with real data
- [ ] Modal opens when clicking cards
- [ ] Images and reviews display correctly
- [ ] Error handling works (stop backend and test)
- [ ] Filtering and search work correctly

## 📞 Support

For issues or questions:
1. Check backend logs: `http://localhost:8000/docs`
2. Check browser console for JavaScript errors
3. Verify API keys are valid
4. Ensure backend and frontend URLs match

---

**Happy coding! 🚀**
