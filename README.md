# 🌍 Tripora — React Travel Planning App

**Plan Smarter. Travel Better.**

A modern, production-ready travel planning web application using **React** (frontend) and **FastAPI** (backend) that integrates real-world data from **OpenTripMap**, **Unsplash**, and **mock reviews** - all with **zero paid APIs**.

![Status](https://img.shields.io/badge/status-production%20ready-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![React](https://img.shields.io/badge/react-18%2B-61dafb)

## ✨ Features

### 🎯 Core Features
- ✅ **Real Tourist Places** - OpenTripMap API (free, no key required)
- ✅ **Beautiful Images** - Unsplash (free tier)
- ✅ **Realistic Reviews** - Procedurally generated reviews with ratings
- ✅ **Smart Filtering** - By activity type (Adventure, Relaxation, Spiritual, etc.)
- ✅ **Advanced Search** - Full-text search across places
- ✅ **Zero Cost APIs** - No subscription, no billing

### 🚀 Technical Highlights
- ✅ **Production Grade** - Error handling, retry logic, caching
- ✅ **Scalable** - Batch requests, parallel processing
- ✅ **Fast Performance** - In-memory caching with optional Redis
- ✅ **API Documentation** - Interactive Swagger UI
- ✅ **Comprehensive Testing** - Examples and test suite

## 📋 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+

### Step 1: Backend Setup (1 min)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
✅ API running at: `http://localhost:8000`

### Step 2: Frontend Setup (1 min)
```bash
npm install
npm run dev
```
✅ App running at: `http://localhost:5173`

### Step 3: Test It! (1 min)
1. Open http://localhost:5173
2. Go to **Explore** page
3. See places with images, reviews, and ratings

**For detailed setup:** See [QUICK_START.md](./QUICK_START.md)

## 📡 API Endpoints

### Get Place Details
```bash
GET /place-details?query=paragliding%20billing&vibe=Adventure
```
Returns: Name, location, images, reviews, rating

### Batch Places
```bash
POST /places/batch
```
Body: Array of place requests

### Interactive Docs
```
http://localhost:8000/docs
```

## 🏗️ Project Structure

```
tripora/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── index.jsx           # Entry point
    ├── App.jsx             # Root component + router
    ├── styles/
    │   └── globals.css     # Shared CSS variables & utility classes
    ├── components/
    │   ├── Sidebar.jsx     # Navigation sidebar
    │   └── Sidebar.css
    └── pages/
        ├── Home/
        │   ├── Home.jsx    # Dashboard, hero, vibe grid, destinations
        │   └── Home.css
        ├── Plan/
        │   ├── Plan.jsx    # Multi-step trip planner
        │   └── Plan.css
        ├── Itinerary/
        │   ├── Itinerary.jsx  # Day-by-day itinerary view
        │   └── Itinerary.css
        ├── MapView/
        │   ├── MapView.jsx    # Visual route map + stops
        │   └── MapView.css
        ├── Bookings/
        │   ├── Bookings.jsx   # Flight, hotel, transport bookings
        │   └── Bookings.css
        ├── Budget/
        │   ├── Budget.jsx     # Donut chart + expense tracker
        │   └── Budget.css
        ├── Checklists/
        │   ├── Checklists.jsx # Interactive packing checklist
        │   └── Checklists.css
        ├── Explore/
        │   ├── Explore.jsx    # Discover destinations & activities
        │   └── Explore.css
        └── Profile/
            ├── Profile.jsx    # User profile, settings, badges
            └── Profile.css
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool & dev server
- **CSS Modules (plain CSS)** — Scoped per-page styles
- **Google Fonts** — Nunito + Poppins
