import React, { useState } from 'react';
import './MapView.css';

const routeStops = [
  { num: 1, color: '#10B981', name: 'Manali', day: 'Day 1 · Start Point', dist: '0 km' },
  { num: 2, color: '#3B82F6', name: 'Solang Valley', day: 'Day 1 · Adventure', dist: '14 km' },
  { num: 3, color: '#F59E0B', name: 'Rohtang Pass', day: 'Day 2 · Scenic Drive', dist: '51 km' },
  { num: 4, color: '#EF4444', name: 'Hadimba Temple', day: 'Day 2 · Sightseeing', dist: '2 km' },
  { num: 5, color: '#8B5CF6', name: 'Vashisht Temple', day: 'Day 3 · Spiritual', dist: '3 km' },
  { num: 6, color: '#EC4899', name: 'Mall Road', day: 'Day 3 · Evening', dist: '1 km' },
];

const pins = [
  { left: '15%', top: '72%', color: '#10B981', label: 'Manali', num: 1 },
  { left: '27%', top: '56%', color: '#3B82F6', label: 'Solang Valley', num: 2 },
  { left: '42%', top: '42%', color: '#F59E0B', label: 'Rohtang Pass', num: 3 },
  { left: '55%', top: '32%', color: '#EF4444', label: 'Hadimba', num: 4 },
  { left: '68%', top: '22%', color: '#8B5CF6', label: 'Vashisht', num: 5 },
  { left: '82%', top: '16%', color: '#EC4899', label: 'Mall Road', num: 6 },
];

export default function MapView({ destination }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocation, setActiveLocation] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveLocation(searchQuery);
    }
  };

  const mapLocation = activeLocation || destination?.name || 'Manali';
  let currentRouteStops = routeStops;
  if (destination && destination.itinerary) {
    currentRouteStops = [];
    let stopNum = 1;
    destination.itinerary.forEach((day) => {
      day.activities.forEach((act) => {
        if (stopNum <= 6) {
          currentRouteStops.push({
            num: stopNum,
            color: ['#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][stopNum % 6],
            name: act.title,
            day: `Day ${day.day} · ${act.time}`,
            dist: '— km'
          });
          stopNum++;
        }
      });
    });
  }

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">Trip Route</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Visualize your journey, explore with ease.</div>
        </div>
        <div className="topbar-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', padding: '4px 8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search a place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', width: '150px' }}
            />
            <button onClick={handleSearch} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              Search
            </button>
          </div>
          <button className="btn btn-outline btn-sm">≡ List View</button>
          <div className="avatar">A</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          <div className="map-container" style={{ position: 'relative' }}>
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 14 }}>
            {[['Total Distance', '120 km'], ['Total Time', '5h 30m'], ['Best Time', 'May–June']].map(([label, val]) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>Route Stops</div>
          <div className="route-list">
            {currentRouteStops.map((stop, i) => (
              <div key={stop.num} className="route-item" style={i === currentRouteStops.length - 1 ? { border: 'none' } : {}}>
                <div className="route-num" style={{ background: stop.color }}>{stop.num}</div>
                <div className="route-info">
                  <div className="route-name">{stop.name}</div>
                  <div className="route-day">{stop.day}</div>
                </div>
                <div className="route-stat">{stop.dist}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary btn-full">🗺️ Optimize Route</button>
          </div>
        </div>
      </div>
    </div>
  );
}
