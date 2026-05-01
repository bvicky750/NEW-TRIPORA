# 🚀 Quick Start - Real-World Data Integration

Get your travel planning app running with live data in 5 minutes!

## ⚡ What's New?

✅ **OpenTripMap API Integration** - Real tourist places (FREE)  
✅ **Unsplash Images** - Beautiful high-quality photos (FREE tier)  
✅ **Mock Reviews** - Realistic user reviews & ratings  
✅ **Zero Cost** - No paid APIs, no billing required  
✅ **Production Ready** - Error handling, caching, retries  

---

## 🎯 Quick Start

### Step 1: Backend Setup (2 min)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

✅ API running at: `http://localhost:8000`

### Step 2: Test the API (1 min)

Open browser: http://localhost:8000/docs

Try the `/place-details` endpoint with:
```
query: "paragliding billing"
vibe: "Adventure"
```

You should see:
- Real places from OpenTripMap
- Beautiful images from Unsplash
- Generated realistic reviews

### Step 3: Frontend Setup (2 min)

```bash
npm install
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

### Step 4: See It Working (1 min)

1. Open http://localhost:5173
2. Go to **Explore** page
3. See places loading with:
   - Images from Unsplash
   - Real location data from OpenTripMap
   - Generated realistic reviews

---

## 📋 Configuration (Optional)

### Add Unsplash Images (Recommended)

1. Go to: https://unsplash.com/developers
2. Sign up free
3. Create app → Copy "Access Key"
4. Add to `backend/.env`:
   ```env
   UNSPLASH_ACCESS_KEY=your_key_here
   ```
5. Restart backend

**Note**: App works fine without this (will just show emojis instead of images)

---

## 📡 API Endpoints

### Get Place Details
```bash
GET http://localhost:8000/place-details?query=paragliding%20billing&vibe=Adventure
```

**Response includes:**
- Place name & location
- Descriptions
- 5-star ratings
- 3-5 mock reviews
- 3-5 images from Unsplash

### Batch Get Places
```bash
POST http://localhost:8000/places/batch
```

**Body:**
```json
[
  {"query": "Paragliding Billing", "vibe": "Adventure"},
  {"query": "Yoga Retreat Rishikesh", "vibe": "Relaxation"}
]
```

---

## 🗂️ What Changed?

### Backend
- ✨ `opentripmap_service.py` - New! Free place data
- ✨ `mock_reviews.py` - New! Realistic reviews
- 🔄 `main.py` - Updated to use new services
- ✏️ `config.py` - Removed Google Places requirement

### Frontend
- 🔄 `api/placeClient.js` - Added retry logic & error handling
- 🔄 `.env.local` - New configuration file
- ✅ Everything else stays the same!

---

## 🎨 Default Places

The app comes with 15 pre-configured places:

```javascript
[
  "Paragliding Billing" 🪂
  "Scuba Diving Andaman" 🤿
  "Trekking Kedarnath" 🥾
  "Safari Ranthambore" 🦁
  "Rafting Rishikesh" 🚣
  "Beach Party Goa" 🎉
  "Houseboat Alleppey" 🛥️
  "Desert Camping Jaisalmer" ⛺
  "Surfing Varkala" 🏄
  "Yoga Retreat Rishikesh" 🧘
  "Temple Tour Varanasi" 🕉️
  "Food Tasting Delhi" 🍜
  "Cooking Class Goa" 🍢
  "Cultural Show Jaipur" 🎭
  "Beach Resort Maldives" 🏖️
]
```

---

## 🔍 Testing

### Test 1: Check Backend Health
```bash
curl http://localhost:8000/health
```

### Test 2: Get Single Place
```bash
curl "http://localhost:8000/place-details?query=paragliding%20billing"
```

### Test 3: Check API Docs
```
http://localhost:8000/docs
```

---

## 🆘 Troubleshooting

**Q: Backend won't start?**
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Q: Frontend can't reach API?**
```bash
# Check .env.local exists with:
VITE_API_BASE_URL=http://localhost:8000

# Restart frontend dev server
npm run dev
```

**Q: No images showing?**
- Images need Unsplash API key (optional)
- Get free key: https://unsplash.com/developers
- Add to `backend/.env`: `UNSPLASH_ACCESS_KEY=your_key`

**Q: Slow loading?**
- First load takes time (API calls)
- Subsequent loads are cached (24 hours)
- Check network in browser DevTools

---

## 📚 Full Documentation

For detailed setup, architecture, and troubleshooting:
→ See `INTEGRATION_SETUP_GUIDE.md`

---

## 🎓 What You've Got

✅ **Backend** - FastAPI with 3 services  
✅ **Frontend** - React with hooks & error handling  
✅ **Real Data** - OpenTripMap + Unsplash + Mock Reviews  
✅ **Production Ready** - Caching, retries, error handling  
✅ **Zero Cost** - All free APIs  
✅ **Ready to Deploy** - Docker, Heroku, Vercel compatible  

---

## 🚀 Next Steps

1. ✅ Start backend: `python -m uvicorn main:app --reload`
2. ✅ Start frontend: `npm run dev`
3. ✅ Open http://localhost:5173
4. ✅ Test Explore page
5. ✅ Add more places to `defaultPlaces` array
6. ✅ Deploy to production

---

## 💡 Tips & Tricks

### Add Your Own Place
Edit `src/pages/Explore/Explore.jsx`:
```javascript
const defaultPlaces = [
  // ... existing
  { 
    query: 'Skydiving Dubai', 
    emoji: '✈️', 
    vibe: 'Adventure'
  },
];
```

### Customize Reviews
Edit `backend/mock_reviews.py`:
- Change names in `FIRST_NAMES` and `LAST_NAMES`
- Update review templates in `REVIEWS_TEMPLATES`
- Adjust rating distribution

### Adjust Image Count
```javascript
// In Explore.jsx
const { data } = useBatchPlaceDetails(defaultPlaces, {
  maxPhotos: 5,  // Change this
  maxReviews: 5, // Change this
});
```

---

## 📞 Support

**API Docs**: http://localhost:8000/docs  
**Frontend Error Logs**: Browser DevTools → Console  
**Backend Logs**: Terminal where you ran `uvicorn`

---

## 📝 Files Created/Modified

**New Files:**
- `backend/opentripmap_service.py`
- `backend/mock_reviews.py`
- `INTEGRATION_SETUP_GUIDE.md`
- `.env.local`

**Modified Files:**
- `backend/main.py` - Complete rewrite
- `backend/config.py` - Updated config
- `backend/requirements.txt` - Removed redis
- `backend/.env` - Updated example
- `src/api/placeClient.js` - Added retry logic

---

**Happy traveling! 🌍✈️**
