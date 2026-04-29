import React from 'react';
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

export default function MapView() {
  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">Trip Route</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Visualize your journey, explore with ease.</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-outline btn-sm">≡ List View</button>
          <div className="avatar">A</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          <div className="map-container">
            <div className="map-bg">
              <div className="map-road" style={{ width: 3, height: '60%', left: '30%', top: '20%', transform: 'rotate(15deg)' }}></div>
              <div className="map-road" style={{ width: 3, height: '50%', left: '50%', top: '10%', transform: 'rotate(-10deg)' }}></div>
              <div className="map-road" style={{ width: '60%', height: 3, left: '20%', top: '45%' }}></div>
              <div className="map-road" style={{ width: '40%', height: 3, left: '35%', top: '65%', transform: 'rotate(5deg)' }}></div>

              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 380">
                <polyline points="80,300 120,240 180,180 220,140 280,100 340,80" stroke="#7C3AED" strokeWidth="3" fill="none" strokeDasharray="8,4" opacity="0.8"/>
              </svg>

              {pins.map(pin => (
                <div key={pin.num} className="map-pin" style={{ left: pin.left, top: pin.top }}>
                  <div className="map-pin-icon" style={{ background: pin.color }}>{pin.num}</div>
                  <div className="map-pin-label">{pin.label}</div>
                </div>
              ))}

              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: 28, height: 28, background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', fontWeight: 800 }}>+</div>
                <div style={{ width: 28, height: 28, background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', fontWeight: 800 }}>−</div>
              </div>
            </div>
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
            {routeStops.map((stop, i) => (
              <div key={stop.num} className="route-item" style={i === routeStops.length - 1 ? { border: 'none' } : {}}>
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
