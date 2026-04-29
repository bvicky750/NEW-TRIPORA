import React, { useState } from 'react';
import './Itinerary.css';

// Sample itinerary data structure - each day has its own activities
const sampleItineraryData = {
  1: [
    {
      time: '8:00 AM',
      dotColor: '#10B981',
      title: 'Arrival & Check-in',
      desc: 'Arrive at your destination. Check-in to hotel. Relax and freshen up.',
      tags: [{ cls: 'badge-green', text: '✅ Hotel Check-in' }],
      emoji: '🏨',
      gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    },
    {
      time: '10:30 AM',
      dotColor: '#3B82F6',
      title: 'Explore Local Area',
      desc: 'Take a walk around the neighborhood, discover local cafes and shops.',
      tags: [
        { cls: 'badge-blue', text: '🚶 Walking Tour' },
      ],
      emoji: '🗺️',
      gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    },
    {
      time: '3:00 PM',
      dotColor: '#F59E0B',
      title: 'Local Sightseeing',
      desc: 'Visit main landmarks and attractions in the area.',
      weather: '🌡️ 20°C · Sunny',
      emoji: '🏛️',
      gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    },
    {
      time: '7:00 PM',
      dotColor: '#8B5CF6',
      title: 'Dinner & Rest',
      desc: 'Enjoy local cuisine at a recommended restaurant',
      tags: [{ cls: 'badge-purple', text: '🍽️ Dining' }],
      emoji: '🍽️',
      gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
      last: true,
    },
  ],
  2: [
    {
      time: '7:00 AM',
      dotColor: '#10B981',
      title: 'Breakfast',
      desc: 'Start your day with a hearty breakfast at the hotel.',
      tags: [{ cls: 'badge-green', text: '☕ Breakfast' }],
      emoji: '☕',
      gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    },
    {
      time: '9:00 AM',
      dotColor: '#3B82F6',
      title: 'Adventure Activity',
      desc: 'Engage in an exciting outdoor adventure sport.',
      tags: [
        { cls: 'badge-blue', text: '🎿 Adventure' },
        { cls: 'badge-purple', text: '₹2,000/pp' },
      ],
      emoji: '⛰️',
      gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    },
    {
      time: '2:00 PM',
      dotColor: '#F59E0B',
      title: 'Lunch Break',
      desc: 'Enjoy lunch at a scenic location or local restaurant.',
      weather: '🌡️ 22°C · Partly Cloudy',
      emoji: '🥘',
      gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    },
    {
      time: '6:00 PM',
      dotColor: '#8B5CF6',
      title: 'Evening Stroll & Sunset',
      desc: 'Relax with a evening walk and enjoy the sunset.',
      tags: [{ cls: 'badge-purple', text: '🌅 Photography' }],
      emoji: '🌅',
      gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
      last: true,
    },
  ],
  3: [
    {
      time: '8:00 AM',
      dotColor: '#10B981',
      title: 'Early Start',
      desc: 'Early morning departure for a day trip to nearby attractions.',
      tags: [{ cls: 'badge-green', text: '🚗 Day Trip' }],
      emoji: '🚐',
      gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    },
    {
      time: '10:00 AM',
      dotColor: '#3B82F6',
      title: 'Nature Exploration',
      desc: 'Trek through scenic trails and enjoy nature.',
      tags: [
        { cls: 'badge-blue', text: '🥾 Trekking' },
      ],
      emoji: '🏞️',
      gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    },
    {
      time: '1:00 PM',
      dotColor: '#F59E0B',
      title: 'Picnic Lunch',
      desc: 'Pack lunch and enjoy a picnic in nature.',
      weather: '🌡️ 18°C · Clear',
      emoji: '🧺',
      gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    },
    {
      time: '5:00 PM',
      dotColor: '#8B5CF6',
      title: 'Return & Relax',
      desc: 'Return to hotel and relax for the evening.',
      tags: [{ cls: 'badge-purple', text: '🛀 Spa' }],
      emoji: '🛀',
      gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
      last: true,
    },
  ],
  4: [
    {
      time: '8:00 AM',
      dotColor: '#10B981',
      title: 'Leisure Breakfast',
      desc: 'Enjoy a relaxed breakfast with a view.',
      tags: [{ cls: 'badge-green', text: '☕ Breakfast' }],
      emoji: '☕',
      gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    },
    {
      time: '10:00 AM',
      dotColor: '#3B82F6',
      title: 'Cultural Experience',
      desc: 'Visit local museums, temples, and cultural sites.',
      tags: [
        { cls: 'badge-blue', text: '🎨 Culture' },
      ],
      emoji: '🏛️',
      gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    },
    {
      time: '2:00 PM',
      dotColor: '#F59E0B',
      title: 'Shopping & Markets',
      desc: 'Explore local markets and souvenirs.',
      weather: '🌡️ 24°C · Sunny',
      emoji: '🛍️',
      gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    },
    {
      time: '7:00 PM',
      dotColor: '#8B5CF6',
      title: 'Special Dinner',
      desc: 'Enjoy a special dinner at a fine dining restaurant.',
      tags: [{ cls: 'badge-purple', text: '🍷 Fine Dining' }],
      emoji: '🍽️',
      gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
      last: true,
    },
  ],
  5: [
    {
      time: '9:00 AM',
      dotColor: '#10B981',
      title: 'Leisurely Morning',
      desc: 'Sleep in and enjoy a late breakfast.',
      tags: [{ cls: 'badge-green', text: '☕ Brunch' }],
      emoji: '🥐',
      gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    },
    {
      time: '11:00 AM',
      dotColor: '#3B82F6',
      title: 'Last Minute Shopping',
      desc: 'Pick up any last-minute souvenirs or gifts.',
      tags: [
        { cls: 'badge-blue', text: '🎁 Shopping' },
      ],
      emoji: '🎁',
      gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    },
    {
      time: '2:00 PM',
      dotColor: '#F59E0B',
      title: 'Lunch & Relaxation',
      desc: 'Final lunch and pack for departure.',
      weather: '🌡️ 23°C · Clear',
      emoji: '🍴',
      gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    },
    {
      time: '5:00 PM',
      dotColor: '#8B5CF6',
      title: 'Departure',
      desc: 'Check-out and head to the airport/station.',
      tags: [{ cls: 'badge-purple', text: '✈️ Departure' }],
      emoji: '✈️',
      gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)',
      last: true,
    },
  ],
};

export default function Itinerary({ tripData, destination }) {
  const days = destination?.itinerary.length || tripData?.days || 5;
  const [activeDay, setActiveDay] = useState(1);

  // Generate day tabs based on destination itinerary or tripData days
  const dayTabs = Array.from({ length: days }, (_, i) => i + 1);

  // Get itinerary items for active day
  let itineraryItems = [];
  
  if (destination && destination.itinerary) {
    // Get activities for the selected day from destination itinerary
    const dayData = destination.itinerary.find(d => d.day === activeDay);
    if (dayData) {
      // Convert destination activities format to itinerary items format
      itineraryItems = dayData.activities.map((activity, index) => ({
        time: activity.time,
        title: activity.title,
        desc: activity.desc,
        emoji: activity.emoji,
        dotColor: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'][index % 5],
        gradient: ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#f093fb,#f5576c)', 'linear-gradient(135deg,#43e97b,#38f9d7)', 'linear-gradient(135deg,#ffecd2,#fcb69f)'][index % 5],
        last: index === dayData.activities.length - 1,
      }));
    }
  } else {
    // Fallback to generic itinerary
    itineraryItems = sampleItineraryData[activeDay] || sampleItineraryData[1];
  }

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">My Itinerary</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {destination ? `${destination.name} • ${days} Days` : `${days} Days / ${Math.max(days - 1, 0)} Nights`}
          </div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-outline btn-sm">⬇ Download</button>
          <button className="btn btn-primary btn-sm">Share</button>
          <div className="avatar">A</div>
        </div>
      </div>

      <div className="day-tabs">
        {dayTabs.map(d => (
          <div
            key={d}
            className={`day-tab${activeDay === d ? ' active' : ''}`}
            onClick={() => setActiveDay(d)}
          >
            Day {d}
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          <div className="card">
            <div className="itinerary-list">
              {itineraryItems.map((item, i) => (
                <div key={i} className="itin-item" style={item.last ? { borderBottom: 'none' } : {}}>
                  <div className="itin-time">{item.time}</div>
                  <div className="itin-dot-line">
                    <div className="itin-dot" style={{ background: item.dotColor }}></div>
                    {!item.last && <div className="itin-line"></div>}
                  </div>
                  <div className="itin-content">
                    <div className="itin-title">{item.title}</div>
                    <div className="itin-desc">{item.desc}</div>
                    {item.tags && (
                      <div className="itin-tags">
                        {item.tags.map((t, j) => (
                          <span key={j} className={`itin-tag ${t.cls}`}>{t.text}</span>
                        ))}
                      </div>
                    )}
                    {item.weather && (
                      <div className="weather-tag" style={{ marginTop: 6 }}>
                        <span>🌡️</span><span>15°C</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Partly Cloudy</span>
                      </div>
                    )}
                  </div>
                  <div style={{ width: 80, height: 70, borderRadius: 10, background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                    {item.emoji}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title">Trip Overview</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{destination?.location || 'Your Destination'}</div>
            <div style={{ width: '100%', height: 120, borderRadius: 12, background: destination?.gradient || 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, marginBottom: 14 }}>
              {destination?.emoji || '🗺️'}
            </div>
            <div className="quick-info-card">
              <div className="quick-row">
                <span className="quick-label">📅 Duration</span>
                <span className="quick-val">{days} Days</span>
              </div>
              <div className="quick-row">
                <span className="quick-label">⭐ Rating</span>
                <span className="quick-val">{destination?.rating || tripData?.selectedVibes?.join(', ') || 'Adventure'}</span>
              </div>
              <div className="quick-row" style={{ border: 'none' }}>
                <span className="quick-label">📍 Location</span>
                <span className="quick-val">{destination ? destination.location.split(',')[0] : tripData?.destType || 'Any'}</span>
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-full">✏️ Edit Plan</button>
        </div>
      </div>
    </div>
  );
}
