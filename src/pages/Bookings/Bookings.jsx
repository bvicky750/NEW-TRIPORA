import React, { useState } from 'react';
import './Bookings.css';

const tabs = ['All', 'Flights', 'Hotels', 'Transport', 'Activities'];

const bookings = [
  {
    emoji: '✈️',
    title: 'Delhi (DEL) → Manali (KUU)',
    detail: 'May 20, 2024 · 6:30 AM · Air India – AI 247',
    status: 'Confirmed',
    price: '₹6,500',
  },
  {
    emoji: '🏨',
    title: 'Hotel Snow View',
    detail: 'Manali, Himachal Pradesh · May 20 – 24, 2024 · 4 nights',
    status: 'Confirmed',
    price: '₹8,400',
  },
  {
    emoji: '🚐',
    title: 'Tempo Traveler',
    detail: 'Local Sightseeing · 3 Days · May 20 – 22, 2024',
    status: 'Confirmed',
    price: '₹3,000',
  },
  {
    emoji: '🪂',
    title: 'Solang Valley Activities',
    detail: 'Paragliding, Zipline, Ropeway · May 21, 2024 · 10:00 AM',
    status: 'Confirmed',
    price: '₹2,500',
  },
];

export default function Bookings() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">My Bookings</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>All your bookings in one place.</div>
        </div>
        <div className="topbar-actions">
          <div className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div className="avatar">A</div>
        </div>
      </div>

      <div className="booking-tabs">
        {tabs.map(t => (
          <div key={t} className={`booking-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          {bookings.map((b, i) => (
            <div key={i} className="booking-card">
              <div className="booking-img">{b.emoji}</div>
              <div className="booking-info">
                <div className="booking-title">{b.title}</div>
                <div className="booking-detail">{b.detail}</div>
              </div>
              <div className="booking-actions">
                <div className="badge badge-green">{b.status}</div>
                <div className="booking-price">{b.price}</div>
                <button className="btn btn-outline btn-sm">View Details</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="offer-card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, marginBottom: 6 }}>EXCLUSIVE OFFERS</div>
            <h3>Get up to 30% off on your next booking</h3>
            <p>Our travel experts are here for you</p>
            <button className="offer-btn">Explore Offers</button>
          </div>

          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>Need Help? 🤝</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Our travel experts are here for you</p>
            <button className="btn btn-primary btn-full btn-sm">💬 Chat with Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}
