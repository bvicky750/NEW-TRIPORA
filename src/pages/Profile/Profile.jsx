import React, { useState } from 'react';
import './Profile.css';

const profileTabs = ['Profile', 'Preferences', 'Notifications', 'Security'];

const defaultSettings = [
  { label: 'Language', val: 'English →' },
  { label: 'Currency', val: 'INR (₹) →' },
  { label: 'Theme', val: 'Light →' },
  { label: 'Default Travelers', val: '2 People →' },
];

const badges = [
  { emoji: '✈️', label: 'Frequent Flyer', bg: '#F3F0FF', locked: false },
  { emoji: '🌍', label: 'Explorer', bg: '#FEF3C7', locked: false },
  { emoji: '⛰️', label: 'Adventurer', bg: '#D1FAE5', locked: false },
  { emoji: '📸', label: 'Photographer', bg: '#DBEAFE', locked: false },
  { emoji: '🍜', label: 'Foodie', bg: '#FCE7F3', locked: false },
  { emoji: '?', label: 'Locked', bg: '#F3F4F6', locked: true },
  { emoji: '?', label: 'Locked', bg: '#F3F4F6', locked: true },
  { emoji: '?', label: 'Locked', bg: '#F3F4F6', locked: true },
];

const avatarColors = [
  'linear-gradient(135deg, #F59E0B, #EF4444)',
  'linear-gradient(135deg, #6366F1, #8B5CF6)',
  'linear-gradient(135deg, #10B981, #3B82F6)',
  'linear-gradient(135deg, #EC4899, #F59E0B)',
  'linear-gradient(135deg, #14B8A6, #6366F1)',
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: false,
  });

  const [profile, setProfile] = useState({
    name: 'Ananya Singh',
    email: 'ananya.singh@email.com',
    phone: '+91 98765-43210',
    bio: 'Passionate traveler exploring the world one trip at a time. ✈️',
    location: 'Mumbai, India',
    avatarColor: 0,
    trips: 23,
    countries: 8,
    badgesCount: 5,
  });

  // Draft state for edit modal
  const [draft, setDraft] = useState({ ...profile });

  const openEdit = () => {
    setDraft({ ...profile });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    setProfile({ ...draft });
    setShowEditModal(false);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
  };

  const avatarLetter = profile.name ? profile.name.trim()[0].toUpperCase() : 'A';
  const draftAvatarLetter = draft.name ? draft.name.trim()[0].toUpperCase() : 'A';

  return (
    <div className="page-wrapper">
      {/* ── Topbar ── */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Profile &amp; Settings</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Manage your account and preferences.</div>
        </div>
        <div className="topbar-actions">
          <div className="icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div className="avatar" style={{ background: avatarColors[profile.avatarColor] }}>{avatarLetter}</div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        {profileTabs.map(t => (
          <div key={t} className={`profile-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* ── Left column ── */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="profile-avatar-section">
              <div
                className="profile-avatar"
                style={{ background: avatarColors[profile.avatarColor] }}
              >
                {avatarLetter}
              </div>
              <div>
                <div className="profile-name">{profile.name}</div>
                <div className="profile-email">{profile.email}</div>
                <div className="profile-email">📞 {profile.phone}</div>
                {profile.location && (
                  <div className="profile-email">📍 {profile.location}</div>
                )}
              </div>
            </div>

            {profile.bio && (
              <div className="profile-bio">{profile.bio}</div>
            )}

            <div style={{ display: 'flex', gap: 24, padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
              {[[profile.trips, 'Trips'], [profile.countries, 'Countries'], [profile.badgesCount, 'Badges']].map(([val, label]) => (
                <div key={label} className="profile-stat">
                  <div className="profile-stat-val">{val}</div>
                  <div className="profile-stat-label">{label}</div>
                </div>
              ))}
            </div>

            <button className="btn btn-outline btn-full btn-sm" onClick={openEdit}>✏️ Edit Profile</button>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Account Settings</div>
            {defaultSettings.map((s, i) => (
              <div key={i} className="settings-row">
                <div className="settings-label">{s.label}</div>
                <div className="settings-val">{s.val}</div>
              </div>
            ))}
            {[
              ['Email Notifications', 'email'],
              ['SMS Notifications', 'sms'],
              ['Marketing Emails', 'marketing'],
            ].map(([label, key], i, arr) => (
              <div key={label} className="settings-row" style={i === arr.length - 1 ? { border: 'none' } : {}}>
                <div className="settings-label">{label}</div>
                <div
                  className={`toggle-switch${notifications[key] ? ' on' : ''}`}
                  onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div>
          <div className="premium-card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>👑</div>
            <h3>Go Premium</h3>
            <ul className="premium-features">
              <li>Up to 30% off on bookings</li>
              <li>Priority customer support</li>
              <li>Exclusive travel deals</li>
              <li>Advanced trip planning</li>
            </ul>
            <button className="btn" style={{ background: 'white', color: '#D97706', width: '100%', justifyContent: 'center', fontSize: 13 }}>Upgrade Now</button>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>🏅 Travel Badges</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {badges.map((b, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 12, background: b.bg, borderRadius: 12, border: b.locked ? '2px dashed var(--border)' : 'none' }}>
                  <div style={{ fontSize: 24, opacity: b.locked ? 0.3 : 1 }}>{b.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, color: b.locked ? 'var(--text-muted)' : 'inherit' }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div className="ep-overlay" onClick={cancelEdit}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="ep-header">
              <div>
                <div className="ep-title">Edit Profile</div>
                <div className="ep-subtitle">Update your personal details</div>
              </div>
              <button className="ep-close" onClick={cancelEdit}>✕</button>
            </div>

            {/* Avatar picker */}
            <div className="ep-avatar-row">
              <div
                className="ep-avatar-preview"
                style={{ background: avatarColors[draft.avatarColor] }}
              >
                {draftAvatarLetter}
              </div>
              <div>
                <div className="ep-avatar-label">Avatar Colour</div>
                <div className="ep-color-swatches">
                  {avatarColors.map((c, i) => (
                    <div
                      key={i}
                      className={`ep-swatch${draft.avatarColor === i ? ' selected' : ''}`}
                      style={{ background: c }}
                      onClick={() => setDraft(d => ({ ...d, avatarColor: i }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="ep-form">
              <div className="ep-field">
                <label className="ep-label">Full Name *</label>
                <input
                  className="ep-input"
                  type="text"
                  placeholder="Your full name"
                  value={draft.name}
                  onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                />
              </div>

              <div className="ep-field">
                <label className="ep-label">Email Address *</label>
                <input
                  className="ep-input"
                  type="email"
                  placeholder="you@email.com"
                  value={draft.email}
                  onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                />
              </div>

              <div className="ep-field">
                <label className="ep-label">Phone Number</label>
                <input
                  className="ep-input"
                  type="tel"
                  placeholder="+91 00000-00000"
                  value={draft.phone}
                  onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
                />
              </div>

              <div className="ep-field">
                <label className="ep-label">Location</label>
                <input
                  className="ep-input"
                  type="text"
                  placeholder="City, Country"
                  value={draft.location}
                  onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
                />
              </div>

              <div className="ep-field ep-field--full">
                <label className="ep-label">Bio</label>
                <textarea
                  className="ep-input ep-textarea"
                  placeholder="Tell travellers a bit about yourself…"
                  rows={3}
                  value={draft.bio}
                  onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                />
              </div>

              <div className="ep-stats-row">
                <div className="ep-field">
                  <label className="ep-label">Trips</label>
                  <input
                    className="ep-input"
                    type="number"
                    min={0}
                    value={draft.trips}
                    onChange={e => setDraft(d => ({ ...d, trips: Number(e.target.value) }))}
                  />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Countries</label>
                  <input
                    className="ep-input"
                    type="number"
                    min={0}
                    value={draft.countries}
                    onChange={e => setDraft(d => ({ ...d, countries: Number(e.target.value) }))}
                  />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Badges</label>
                  <input
                    className="ep-input"
                    type="number"
                    min={0}
                    value={draft.badgesCount}
                    onChange={e => setDraft(d => ({ ...d, badgesCount: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="ep-footer">
              <button className="btn btn-outline" onClick={cancelEdit}>Cancel</button>
              <button
                className="btn"
                style={{ background: 'var(--primary)', color: 'white' }}
                onClick={saveEdit}
                disabled={!draft.name.trim() || !draft.email.trim()}
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
