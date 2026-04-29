import React, { useState, useEffect } from 'react';
import './Explore.css';

const filters = ['All', 'Adventure', 'Relaxation', 'Spiritual', 'Foodie', 'Nature', 'Nightlife'];

const cards = [
  { emoji: '🪂', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', name: 'Paragliding', place: 'Billing, Himachal', rating: '4.8', price: '₹3,500', vibe: 'Adventure' },
  { emoji: '🤿', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', name: 'Scuba Diving', place: 'Andaman, Islands', rating: '4.9', price: '₹5,000', vibe: 'Adventure' },
  { emoji: '🥾', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', name: 'Trekking', place: 'Kedarnath, Uttarakhand', rating: '4.7', price: '₹3,500', vibe: 'Nature' },
  { emoji: '🦁', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', name: 'Safari', place: 'Ranthambore, Rajasthan', rating: '4.6', price: '₹2,800', vibe: 'Nature' },
  { emoji: '🚣', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)', name: 'Rishikesh Rafting', place: 'Rishikesh, Uttarakhand', rating: '4.8', price: '₹1,500', vibe: 'Adventure' },
  { emoji: '🎉', gradient: 'linear-gradient(135deg,#a8edea,#fed6e3)', name: 'Goa Beach Party', place: 'Goa, India', rating: '4.5', price: '₹1,500', vibe: 'Nightlife' },
  { emoji: '🛥️', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', name: 'Houseboat Stay', place: 'Alleppey, Kerala', rating: '4.7', price: '₹6,000', vibe: 'Relaxation' },
  { emoji: '⛺', gradient: 'linear-gradient(135deg,#f6d365,#fda085)', name: 'Desert Camping', place: 'Jaisalmer, Rajasthan', rating: '4.9', price: '₹2,500', vibe: 'Nature' },
  { emoji: '🏄', gradient: 'linear-gradient(135deg,#c3cfe2,#c3cfe2)', name: 'Surfing Lessons', place: 'Varkala, Kerala', rating: '4.5', price: '₹2,000', vibe: 'Adventure' },
  { emoji: '🧘', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)', name: 'Yoga Retreat', place: 'Rishikesh, Uttarakhand', rating: '4.9', price: '₹4,500', vibe: 'Relaxation' },
  { emoji: '🕉️', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', name: 'Temple Tour', place: 'Varanasi, India', rating: '4.7', price: '₹2,000', vibe: 'Spiritual' },
  { emoji: '🍜', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', name: 'Food Tasting Tour', place: 'Delhi, India', rating: '4.8', price: '₹1,800', vibe: 'Foodie' },
  { emoji: '🍢', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', name: 'Cooking Class', place: 'Goa, India', rating: '4.6', price: '₹2,500', vibe: 'Foodie' },
  { emoji: '🎭', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', name: 'Cultural Show', place: 'Jaipur, Rajasthan', rating: '4.8', price: '₹1,200', vibe: 'Spiritual' },
  { emoji: '🏖️', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)', name: 'Beach Resort', place: 'Maldives', rating: '4.9', price: '₹8,000', vibe: 'Relaxation' },
];

export default function Explore({ selectedVibe }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Update active filter when selected vibe changes from Home page
  useEffect(() => {
    if (selectedVibe) {
      setActiveFilter(selectedVibe);
    }
  }, [selectedVibe]);

  // Filter cards based on active filter and search
  const filteredCards = cards.filter(c => {
    const matchesFilter = activeFilter === 'All' || c.vibe === activeFilter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.place.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">Explore</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Discover amazing places and experiences.</div>
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

      <div className="explore-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          placeholder="Search destinations, activities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-chips">
        {filters.map(f => (
          <div
            key={f}
            className={`filter-chip${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >{f}</div>
        ))}
      </div>

      <div className="explore-grid">
        {filteredCards.map((c, i) => (
          <div key={i} className="explore-card">
            <div className="explore-img" style={{ background: c.gradient }}>{c.emoji}</div>
            <div className="explore-body">
              <div className="explore-name">{c.name}</div>
              <div className="explore-place">{c.place}</div>
              <div className="explore-foot">
                <div className="stars">⭐ {c.rating}</div>
                <div className="explore-price">{c.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
