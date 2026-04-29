import React, { useState } from 'react';
import './Plan.css';

const vibes = [
  { icon: '🏔️', label: 'Adventure' },
  { icon: '🧘', label: 'Relaxation' },
  { icon: '🛕', label: 'Spiritual' },
  { icon: '🍜', label: 'Foodie' },
  { icon: '🌿', label: 'Nature' },
  { icon: '🎉', label: 'Nightlife' },
];

const destTypes = ['Any', 'Beach', 'Mountains', 'City', 'Culture'];

const cities = [
  'Paris', 'London', 'Tokyo', 'New York', 'Dubai', 'Barcelona', 
  'Bangkok', 'Rome', 'Amsterdam', 'Singapore', 'Las Vegas', 'Venice',
  'Madrid', 'Berlin', 'Sydney', 'Miami', 'Bali', 'Istanbul',
  'Cairo', 'Mexico City', 'Toronto', 'Hong Kong', 'Seoul', 'Vienna','India','Goa'
];

export default function Plan({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVibes, setSelectedVibes] = useState(['Adventure']);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [destType, setDestType] = useState('Any');
  const [days, setDays] = useState(5);
  const [travelDate, setTravelDate] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [budget, setBudget] = useState('');
  const [travelers, setTravelers] = useState(1);

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleVibe = (label) => {
    setSelectedVibes(prev =>
      prev.includes(label) ? prev.filter(v => v !== label) : [...prev, label]
    );
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Trip planned:', { selectedCity, selectedVibes, destType, days, travelDate, travelTime, budget, travelers });
    if (typeof onNavigate === 'function') {
      onNavigate('itinerary');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">Plan Your Trip</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tell us your preferences, we'll build the perfect trip!</div>
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

      <div className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Step Bar */}
        <div className="step-bar">
          <div className={`step ${currentStep >= 1 ? 'active' : 'inactive'}`}>
            <div className="step-num">1</div>
            <div className="step-label">Preferences</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : 'inactive'}`}>
            <div className="step-num">2</div>
            <div className="step-label">Budget</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : 'inactive'}`}>
            <div className="step-num">3</div>
            <div className="step-label">Travelers</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 4 ? 'active' : 'inactive'}`}>
            <div className="step-num">4</div>
            <div className="step-label">Review</div>
          </div>
        </div>

        {/* Step 1: Preferences */}
        {currentStep === 1 && (
          <>
            <div className="card-title">What's your vibe?</div>
            <div className="card-subtitle" style={{ marginBottom: 20 }}>Select all that inspire you</div>

            <div className="vibe-select-grid">
              {vibes.map(v => (
                <div
                  key={v.label}
                  className={`vibe-select-card${selectedVibes.includes(v.label) ? ' selected' : ''}`}
                  onClick={() => toggleVibe(v.label)}
                >
                  <div className="vibe-big-icon">{v.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{v.label}</div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }}></div>

            <div className="trip-option" style={{ marginBottom: 20, position: 'relative' }}>
              <label>Destination City</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => setShowCityDropdown(true)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    background: '#ffffff',
                    color: '#000',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
                {selectedCity && (
                  <div style={{
                    marginTop: 8,
                    padding: '10px 16px',
                    background: 'var(--accent)',
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    ✓ Selected: {selectedCity}
                  </div>
                )}
                {showCityDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: '#ffffff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedCity(city);
                            setSearchInput(city);
                            setShowCityDropdown(false);
                          }}
                          style={{
                            padding: '14px 16px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0',
                            fontSize: '14px',
                            transition: 'background 0.2s',
                            width: '100%',
                            textAlign: 'left',
                            color: '#000'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >
                          {city}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '14px 16px', color: '#999', fontSize: '14px', textAlign: 'center' }}>
                        No cities found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="trip-option">
                <label>Destination Type</label>
                <div className="chips">
                  {destTypes.map(d => (
                    <div
                      key={d}
                      className={`chip${destType === d ? ' active' : ''}`}
                      onClick={() => setDestType(d)}
                    >{d}</div>
                  ))}
                </div>
              </div>

              <div className="trip-option">
                <label>Trip Duration (days)</label>
                <div className="duration-input">
                  <div className="duration-btn" onClick={() => setDays(d => Math.max(1, d - 1))}>−</div>
                  <span className="duration-val">{days} Days</span>
                  <div className="duration-btn" onClick={() => setDays(d => d + 1)}>+</div>
                </div>
              </div>

              <div className="trip-option">
                <label>Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    background: '#ffffff',
                    color: '#000',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div className="trip-option">
                <label>Travel Time</label>
                <input
                  type="time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    background: '#ffffff',
                    color: '#000',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Budget */}
        {currentStep === 2 && (
          <>
            <div className="card-title">What's your budget?</div>
            <div className="card-subtitle" style={{ marginBottom: 20 }}>Help us find the perfect options for you</div>

            <div className="trip-option-row" style={{ flexDirection: 'column', gap: 15 }}>
              {['Budget Friendly', 'Moderate', 'Luxury', 'Ultra Luxury'].map(option => (
                <div
                  key={option}
                  className={`chip${budget === option ? ' active' : ''}`}
                  onClick={() => setBudget(option)}
                  style={{ padding: '12px 16px', cursor: 'pointer', textAlign: 'left' }}
                >
                  {option}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 3: Travelers */}
        {currentStep === 3 && (
          <>
            <div className="card-title">How many travelers?</div>
            <div className="card-subtitle" style={{ marginBottom: 20 }}>Who will be joining the adventure?</div>

            <div className="duration-input" style={{ justifyContent: 'center', gap: 20 }}>
              <div className="duration-btn" onClick={() => setTravelers(t => Math.max(1, t - 1))}>−</div>
              <span className="duration-val">{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</span>
              <div className="duration-btn" onClick={() => setTravelers(t => t + 1)}>+</div>
            </div>
          </>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <>
            <div className="card-title">Review Your Trip</div>
            <div className="card-subtitle" style={{ marginBottom: 20 }}>Confirm your trip details</div>

            <div style={{ display: 'grid', gap: 15 }}>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Vibes</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{selectedVibes.join(', ')}</div>
              </div>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Destination City</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{selectedCity || 'Not selected'}</div>
              </div>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Destination Type</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{destType}</div>
              </div>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trip Duration</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{days} Days</div>
              </div>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Travel Date</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{travelDate || 'Not selected'}</div>
              </div>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Travel Time</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{travelTime || 'Not selected'}</div>
              </div>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Budget</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{budget}</div>
              </div>
              <div style={{ padding: 15, background: 'var(--bg-hover)', borderRadius: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Travelers</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 5 }}>{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</div>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          {currentStep > 1 && (
            <button className="btn" style={{ padding: 14, fontSize: 14, flex: 1 }} onClick={handlePrevStep}>
              ← Previous
            </button>
          )}
          {currentStep < 4 && (
            <button className="btn btn-primary" style={{ padding: 14, fontSize: 14, flex: 1 }} onClick={handleNextStep}>
              Next Step →
            </button>
          )}
          {currentStep === 4 && (
            <button className="btn btn-primary" style={{ padding: 14, fontSize: 14, flex: 1 }} onClick={handleSubmit}>
              Complete Trip Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
