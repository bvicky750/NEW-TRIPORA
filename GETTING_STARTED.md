# ✅ Getting Started Checklist

## Pre-Setup Verification

- [ ] **Python installed** - Check: `python --version` (3.8+ required)
- [ ] **Node.js installed** - Check: `node --version` (14+ required)
- [ ] **npm installed** - Check: `npm --version`
- [ ] **Git installed** - Check: `git --version` (optional)

---

## Backend Setup (5 minutes)

### Step 1: Navigate to Backend
```bash
cd backend
```
- [ ] Terminal shows: `backend$` or `backend>`

### Step 2: Create Virtual Environment (Optional but Recommended)
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```
- [ ] Terminal shows `(venv)` prefix

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```
- [ ] No errors during installation
- [ ] Packages installed: FastAPI, Uvicorn, Requests, Pydantic

### Step 4: Start Backend Server
```bash
python -m uvicorn main:app --reload
```
- [ ] Output shows: `Uvicorn running on http://127.0.0.1:8000`
- [ ] API is ready

### Step 5: Test Backend (In New Terminal)
```bash
curl http://localhost:8000/health
```
- [ ] Returns: `{"status":"healthy",...}`

---

## Frontend Setup (3 minutes)

### Step 1: Navigate to Root Directory
```bash
cd ..  # Go back to root if in backend
```
- [ ] Terminal shows root directory

### Step 2: Install Dependencies
```bash
npm install
```
- [ ] No major errors
- [ ] node_modules folder created
- [ ] package-lock.json updated

### Step 3: Create .env.local (If Not Exists)
```bash
# Windows:
type nul > .env.local

# macOS/Linux:
touch .env.local
```

Add this line to `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

- [ ] `.env.local` file exists
- [ ] Contains `VITE_API_BASE_URL` variable

### Step 4: Start Frontend Server
```bash
npm run dev
```
- [ ] Output shows: `VITE vX.X.X ready in XXX ms`
- [ ] URL shown: `http://localhost:5173`

---

## First Run Verification

### Check Backend Health
```bash
curl http://localhost:8000/health
```
Response should include:
```json
{
  "status": "healthy",
  "services": {
    "opentripmap": "operational",
    "unsplash": "configured" or "not_configured",
    "mock_reviews": "operational"
  }
}
```
- [ ] Status is "healthy"
- [ ] OpenTripMap is "operational"
- [ ] Mock reviews is "operational"

### Open Frontend
1. Open browser to: `http://localhost:5173`
   - [ ] Page loads without errors
   - [ ] Header shows "Tripora"

2. Navigate to **Explore** page
   - [ ] Click Explore in sidebar/menu
   - [ ] Page loads

3. View Places
   - [ ] Cards appear with place names
   - [ ] Loading indicators show initially
   - [ ] Images display (or emojis if no Unsplash key)
   - [ ] Ratings show (⭐ numbers)

4. Click a Place Card
   - [ ] Modal popup opens
   - [ ] Shows place details
   - [ ] Shows image carousel (if images loaded)
   - [ ] Shows reviews section
   - [ ] Each review has: author name, rating, comment, time

### Success Indicators
- [ ] 15 places visible
- [ ] Images loading from Unsplash
- [ ] Reviews generating correctly
- [ ] Ratings showing 4.0-5.0 stars
- [ ] No console errors (check DevTools)
- [ ] No backend error logs

---

## Optional: Add Unsplash Images

### Step 1: Get API Key
1. Go to: https://unsplash.com/developers
2. Sign up (free)
3. Create application
4. Copy "Access Key"
- [ ] Key copied

### Step 2: Configure Backend
1. Edit `backend/.env`
2. Find: `UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here`
3. Replace with your key: `UNSPLASH_ACCESS_KEY=your_actual_key_here`
- [ ] Key added to .env

### Step 3: Restart Backend
```bash
# Stop current backend (Ctrl+C)
# Then start again:
python -m uvicorn main:app --reload
```
- [ ] Backend restarted
- [ ] No errors in output

### Step 4: Test Images
1. Refresh frontend browser (Ctrl+R or Cmd+R)
2. Go to Explore page
3. Click a place
- [ ] Real Unsplash images now load
- [ ] "Photo by..." attribution visible

---

## Testing the API

### Run Examples
```bash
cd backend
python examples.py
```
- [ ] 6 examples run successfully
- [ ] All output shows correctly

### Run Test Suite
```bash
cd backend
python test_api.py
```
- [ ] Tests run
- [ ] Most/all tests pass (✅)
- [ ] Test summary shows success rate

### Manual Testing with cURL
```bash
# Single place
curl "http://localhost:8000/place-details?query=paragliding%20billing"

# Health check
curl http://localhost:8000/health
```
- [ ] Requests return valid JSON
- [ ] No error status codes

### API Documentation
1. Open: `http://localhost:8000/docs`
   - [ ] Swagger UI loads
   - [ ] Shows all 4 endpoints
   - [ ] Can see request/response schemas

2. Try endpoint in UI:
   - [ ] Click on `/place-details`
   - [ ] Click "Try it out"
   - [ ] Enter query: `"paragliding billing"`
   - [ ] Click "Execute"
   - [ ] Get 200 response with data
   - [ ] Can see photos array
   - [ ] Can see reviews array

---

## Troubleshooting Checklist

### Backend won't start?
- [ ] Python version is 3.8+: `python --version`
- [ ] In backend folder: `ls` or `dir` shows main.py
- [ ] Dependencies installed: `pip list | grep fastapi`
- [ ] Port 8000 not in use: Check firewall

### Frontend won't start?
- [ ] In root folder (not backend)
- [ ] Node modules installed: `ls node_modules` exists
- [ ] .env.local exists with API URL
- [ ] Port 5173 not in use

### No images showing?
- [ ] Check Unsplash key (optional - app works without)
- [ ] Backend restarted after adding key
- [ ] Frontend page refreshed
- [ ] Check DevTools Network tab for image requests

### API returns errors?
- [ ] Backend is running: `curl http://localhost:8000/health`
- [ ] Check backend terminal for error logs
- [ ] Check frontend DevTools Console for errors
- [ ] Try query with simpler text: "yoga" instead of "yoga retreat rishikesh"

### Places not loading?
- [ ] Backend health check passes
- [ ] Frontend console shows no errors
- [ ] API docs endpoint works: `http://localhost:8000/docs`
- [ ] Try direct API call with cURL

---

## Performance Check

### Load Times
- [ ] First load: 1-2 seconds
- [ ] Refresh: <1 second (cached)
- [ ] API docs load: <2 seconds
- [ ] Image carousel: Smooth switching

### No Major Errors
- [ ] Browser console: Clean (no red errors)
- [ ] Backend logs: No error messages
- [ ] Network tab: All requests 200 OK

---

## Next Steps After Verification

### Short Term
- [ ] Explore all 15 default places
- [ ] Add Unsplash API key (optional)
- [ ] Customize place list
- [ ] Test all filters

### Medium Term
- [ ] Read INTEGRATION_SETUP_GUIDE.md
- [ ] Customize review generation
- [ ] Add more places
- [ ] Add custom descriptions

### Long Term
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Add authentication
- [ ] Add real database
- [ ] Add real booking

---

## Documentation Links

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | 5-min setup guide |
| [INTEGRATION_SETUP_GUIDE.md](./INTEGRATION_SETUP_GUIDE.md) | Detailed setup |
| [ARCHITECTURE_REFERENCE.md](./ARCHITECTURE_REFERENCE.md) | System design |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | What's included |

---

## Getting Help

### Check These First
1. Is backend running? `curl http://localhost:8000/health`
2. Is frontend running? Visit `http://localhost:5173`
3. Check browser console (F12 → Console tab)
4. Check backend terminal for errors

### Read Documentation
- Quick issue? → QUICK_START.md
- Setup question? → INTEGRATION_SETUP_GUIDE.md
- API question? → ARCHITECTURE_REFERENCE.md
- What's new? → IMPLEMENTATION_SUMMARY.md

### Run Diagnostics
```bash
# API health
curl http://localhost:8000/health

# API examples
python backend/examples.py

# API tests
python backend/test_api.py
```

---

## Success Metrics

### ✅ All of These Should be True
- [ ] Backend server running without errors
- [ ] Frontend server running without errors
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:8000/docs
- [ ] Explore page shows 15 places
- [ ] Places have ratings (⭐)
- [ ] Places have images (or emojis)
- [ ] Clicking place shows modal
- [ ] Modal shows reviews
- [ ] Each review has author, rating, text, time
- [ ] No red errors in browser console
- [ ] No red errors in backend terminal

### 🎉 If All Are Checked - You're Ready!

---

## Estimated Time

- Backend setup: 5 minutes
- Frontend setup: 3 minutes
- Verification: 2 minutes
- Optional (Unsplash): 5 minutes
- **Total: 15 minutes**

---

## Common Paths

### Just Want to See It Work?
1. ✅ Backend Setup (5 min)
2. ✅ Frontend Setup (3 min)
3. ✅ Open browser to http://localhost:5173
4. ✅ Click Explore

**Time: 10 minutes**

### Want to Understand How It Works?
1. ✅ Follow above (10 min)
2. ✅ Read QUICK_START.md (5 min)
3. ✅ Read ARCHITECTURE_REFERENCE.md (10 min)
4. ✅ Run examples.py (5 min)

**Time: 30 minutes**

### Want to Customize Everything?
1. ✅ Follow above (30 min)
2. ✅ Read INTEGRATION_SETUP_GUIDE.md (15 min)
3. ✅ Modify places/reviews (15 min)
4. ✅ Deploy (30 min)

**Time: 90 minutes**

---

**Ready? Start with Backend Setup above! ⬆️**

**Questions? Check [QUICK_START.md](./QUICK_START.md) 📚**
