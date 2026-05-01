import React, { useState, useEffect } from 'react';
import './Explore.css';
import { useBatchPlaceDetails } from '../../hooks/usePlaces';

const filters = ['All', 'Adventure', 'Relaxation', 'Spiritual', 'Foodie', 'Nature', 'Nightlife'];

// Default place queries with metadata
const defaultPlaces = [
  { query: 'Paragliding Billing Himachal', emoji: '🪂', vibe: 'Adventure', name: 'Paragliding' },
  { query: 'Scuba Diving Andaman Islands', emoji: '🤿', vibe: 'Adventure', name: 'Scuba Diving' },
  { query: 'Trekking Kedarnath Uttarakhand', emoji: '🥾', vibe: 'Nature', name: 'Trekking' },
  { query: 'Safari Ranthambore Rajasthan', emoji: '🦁', vibe: 'Nature', name: 'Safari' },
  { query: 'Rafting Rishikesh Uttarakhand', emoji: '🚣', vibe: 'Adventure', name: 'Rafting' },
  { query: 'Beach Party Goa India', emoji: '🎉', vibe: 'Nightlife', name: 'Beach Party' },
  { query: 'Houseboat Alleppey Kerala', emoji: '🛥️', vibe: 'Relaxation', name: 'Houseboat' },
  { query: 'Desert Camping Jaisalmer Rajasthan', emoji: '⛺', vibe: 'Nature', name: 'Desert Camping' },
  { query: 'Surfing Varkala Kerala', emoji: '🏄', vibe: 'Adventure', name: 'Surfing' },
  { query: 'Yoga Retreat Rishikesh', emoji: '🧘', vibe: 'Relaxation', name: 'Yoga' },
  { query: 'Temple Tour Varanasi India', emoji: '🕉️', vibe: 'Spiritual', name: 'Temple Tour' },
  { query: 'Food Tasting Delhi India', emoji: '🍜', vibe: 'Foodie', name: 'Food Tour' },
  { query: 'Cooking Class Goa India', emoji: '🍢', vibe: 'Foodie', name: 'Cooking Class' },
  { query: 'Cultural Show Jaipur Rajasthan', emoji: '🎭', vibe: 'Spiritual', name: 'Cultural Show' },
  { query: 'Beach Resort Maldives', emoji: '🏖️', vibe: 'Relaxation', name: 'Beach Resort' },
];

function Modal({ card, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!card) return null;

  const images = card.photos?.length > 0 ? card.photos : [];
  const displayImage = images[currentImageIndex]?.url || '';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (images.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (images.length || 1)) % (images.length || 1));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="modal-title-section">
            <span className="modal-emoji">{card.emoji}</span>
            <div>
              <h2 className="modal-title">{card.name}</h2>
              <p className="modal-place">{card.location}</p>
            </div>
          </div>
          <div className="modal-stats">
            <div className="stat">⭐ {card.rating}</div>
            {card.price && <div className="stat price">{card.price}</div>}
          </div>
        </div>

        {images.length > 0 ? (
          <div className="modal-image-section">
            <div className="image-container">
              <img src={displayImage} alt={`${card.name} ${currentImageIndex + 1}`} />
            </div>
            <button className="nav-btn prev" onClick={prevImage}>❮</button>
            <button className="nav-btn next" onClick={nextImage}>❯</button>
            <div className="image-counter">{currentImageIndex + 1} / {images.length}</div>
          </div>
        ) : (
          <div className="modal-image-section modal-no-images">
            <p>No images available</p>
          </div>
        )}

        <p className="modal-description">{card.description}</p>

        <div className="reviews-section">
          <h3 className="reviews-title">
            Customer Reviews ({card.reviews?.length || 0})
          </h3>
          {card.reviews && card.reviews.length > 0 ? (
            <div className="reviews-list">
              {card.reviews.map((review, idx) => (
                <div key={idx} className="review-item">
                  <div className="review-header">
                    <div className="review-author">{review.author}</div>
                    <div className="review-rating">⭐ {review.rating}</div>
                  </div>
                  <p className="review-text">{review.text}</p>
                  {review.time && <p className="review-time">{review.time}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews available yet</p>
          )}
        </div>

        <button className="book-btn">Book Now</button>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="explore-card loading-card">
      <div className="explore-img skeleton-img"></div>
      <div className="explore-body">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    </div>
  );
}

export default function Explore({ selectedVibe }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  // Fetch place details from API
  const { data: apiPlaces, loading: placesLoading, error: placesError } = useBatchPlaceDetails(
    defaultPlaces,
    {
      includePhotos: true,
      includeReviews: true,
      maxPhotos: 3,
      maxReviews: 3,
    }
  );

  // Use API data, fallback to default structure for display
  const cards = apiPlaces.length > 0 ? apiPlaces : [];

  // Update active filter when selected vibe changes from Home page
  useEffect(() => {
    if (selectedVibe) {
      setActiveFilter(selectedVibe);
    }
  }, [selectedVibe]);

  // Filter cards based on active filter and search
  const filteredCards = cards.filter((c) => {
    const matchesFilter = activeFilter === 'All' || c.vibe === activeFilter;
    const matchesSearch = 
      (c.name?.toLowerCase().includes(search.toLowerCase()) || 
       c.location?.toLowerCase().includes(search.toLowerCase())) ?? true;
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">Explore</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {placesLoading ? 'Loading amazing places...' : 'Discover amazing places and experiences.'}
          </div>
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
          disabled={placesLoading}
        />
      </div>

      <div className="filter-chips">
        {filters.map(f => (
          <div
            key={f}
            className={`filter-chip${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
            style={{ opacity: placesLoading ? 0.6 : 1 }}
          >{f}</div>
        ))}
      </div>

      {placesError && (
        <div className="error-banner">
          <p>⚠️ Error loading places: {placesError.message}</p>
          <small>Make sure the backend API is running and configured properly.</small>
        </div>
      )}

      <div className="explore-grid">
        {placesLoading ? (
          // Show loading skeletons
          Array(6).fill(0).map((_, i) => <LoadingCard key={i} />)
        ) : filteredCards.length > 0 ? (
          // Show loaded cards
          filteredCards.map((card, i) => (
            <div 
              key={i} 
              className="explore-card" 
              onClick={() => setSelectedCard(card)}
            >
              {card.photos && card.photos.length > 0 ? (
                <img 
                  src={card.photos[0].url} 
                  alt={card.name}
                  className="explore-img-real"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.classList.add('show');
                  }}
                />
              ) : null}
              <div 
                className="explore-img" 
                style={{ display: card.photos && card.photos.length > 0 ? 'none' : 'flex' }}
              >
                {card.emoji || '📍'}
              </div>
              <div className="explore-body">
                <div className="explore-name">{card.name}</div>
                <div className="explore-place">{card.location}</div>
                <div className="explore-foot">
                  <div className="stars">⭐ {card.rating}</div>
                  {card.price && <div className="explore-price">{card.price}</div>}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show no results message
          <div className="no-results">
            <p>No places found matching your criteria</p>
          </div>
        )}
      </div>

      {selectedCard && <Modal card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  );
}
