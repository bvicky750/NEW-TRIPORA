import React, { useState } from 'react';
import './Home.css';
import ManaliImg from '../../../images/Manali.jpeg';
import BaliImg from '../../../images/Bali.jpeg';
import GoaImg from '../../../images/goa.jpeg';
import SwitzerlandImg from '../../../images/Swizerland.jpeg';
import introVideo from '../../../images/intro.mp4';

const vibes = [
  { icon: '🏔️', name: 'Adventure', desc: 'Thrill & Nature' },
  { icon: '🧘', name: 'Relaxation', desc: 'Calm & Peaceful' },
  { icon: '🛕', name: 'Spiritual', desc: 'Culture & Faith' },
  { icon: '🍜', name: 'Foodie', desc: 'Eat & Explore' },
  { icon: '🌿', name: 'Nature', desc: 'Outdoors & Wild' },
  { icon: '🎉', name: 'Nightlife', desc: 'Party & Fun' },
];

const destinations = [
  { name: 'Manali' },
  { name: 'Bali' },
  { name: 'Goa' },
  { name: 'Switzerland' },
];

const destinationDetails = {
  Manali: { image: ManaliImg, emoji: '🏔️', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', loc: 'Himachal Pradesh, India', rating: '4.8', desc: 'A picturesque hill station nestled in the Himalayas, known for adventure activities and stunning landscapes.' },
  Bali: { image: BaliImg, emoji: '🌴', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', loc: 'Bali, Indonesia', rating: '4.9', desc: 'A tropical paradise with beautiful beaches, rice terraces, and vibrant culture.' },
  Goa: { image: GoaImg, emoji: '🏖️', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', loc: 'Goa, India', rating: '4.7', desc: 'A coastal state famous for beaches, Portuguese architecture, and vibrant nightlife.' },
  Switzerland: { image: SwitzerlandImg, emoji: '🏔️', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', loc: 'Switzerland, Europe', rating: '4.9', desc: 'A stunning alpine country with breathtaking mountains, lakes, and charming villages.' },
};

export default function Home({ onVibeSelect, onDestinationSelect }) {
  const [activeVibes, setActiveVibes] = useState([]);
  const [selectedDestModal, setSelectedDestModal] = useState(null);

  const toggleVibe = (name) => {
    setActiveVibes(prev =>
      prev.includes(name) ? prev.filter(v => v !== name) : [...prev, name]
    );
  };

  const handleVibeClick = (name) => {
    toggleVibe(name);
    if (onVibeSelect) {
      onVibeSelect(name);
    }
  };

  const handleDestinationClick = (destName) => {
    setSelectedDestModal(destName);
  };

  const handleViewItinerary = (destName) => {
    if (onDestinationSelect) {
      onDestinationSelect(destName);
    }
    setSelectedDestModal(null);
  };

  return (
    <div className="page-wrapper">
      {/* TOPBAR */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Welcome Back, Arjun! 👋</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Where do you want to go next?</div>
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

      {/* HERO */}
      <div className="hero">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={introVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-tag">
            <span>✨</span> AI-Powered Trip Planning
          </div>
          <h1>Plan Smarter.<br /><span>Travel Better.</span></h1>
          <p>Tell us your vibe, we'll build the perfect trip for you.</p>
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search destinations, trips..." />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

      {/* VIBE GRID */}
      <div className="section-header">
        <div className="section-title">Pick Your Vibe</div>
        <span className="view-all">See All</span>
      </div>
      <div className="vibe-grid">
        {vibes.map(v => (
          <div
            key={v.name}
            className={`vibe-card${activeVibes.includes(v.name) ? ' active' : ''}`}
            onClick={() => handleVibeClick(v.name)}
          >
            <div className="vibe-icon">{v.icon}</div>
            <div className="vibe-name">{v.name}</div>
            <div className="vibe-desc">{v.desc}</div>
          </div>
        ))}
      </div>

      {/* DESTINATIONS */}
      <div className="section-header">
        <div className="section-title">Trending Destinations</div>
        <span className="view-all">View All</span>
      </div>
      <div className="dest-grid">
        {destinations.map(d => {
          const details = destinationDetails[d.name];
          return (
            <div key={d.name} className="dest-card" onClick={() => handleDestinationClick(d.name)} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
              <img src={details.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div className="dest-overlay"></div>
              <div className="dest-info">
                <div className="dest-name">{d.name}</div>
                <div className="dest-loc">{details.loc}</div>
              </div>
              <div className="dest-rating">⭐ {details.rating}</div>
            </div>
          );
        })}
      </div>

      {/* DESTINATION DETAILS MODAL */}
      {selectedDestModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedDestModal(null)}>
          <div style={{ background: 'white', borderRadius: 16, width: '90%', maxWidth: 500, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            {/* Image Section */}
            <div style={{ width: '100%', height: 250, background: destinationDetails[selectedDestModal].gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, position: 'relative', overflow: 'hidden' }}>
              <img src={destinationDetails[selectedDestModal].image} alt={selectedDestModal} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button onClick={() => setSelectedDestModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 50, width: 40, height: 40, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* Content Section */}
            <div style={{ padding: 24 }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 28, fontWeight: 800, color: '#1f2937' }}>{selectedDestModal}</h2>
              <p style={{ margin: '0 0 16px 0', fontSize: 12, color: '#6b7280' }}>⭐ {destinationDetails[selectedDestModal].rating} • {destinationDetails[selectedDestModal].loc}</p>
              <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>{destinationDetails[selectedDestModal].desc}</p>

              {/* Button */}
              <button onClick={() => handleViewItinerary(selectedDestModal)} style={{ width: '100%', padding: '14px 20px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(0.98)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                View Itinerary →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
