# Tripora — React App

**Plan Smarter. Travel Better.**

## Project Structure

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
