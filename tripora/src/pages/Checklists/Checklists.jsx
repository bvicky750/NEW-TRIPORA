import React, { useState } from 'react';
import './Checklists.css';

const checkTabs = ['Packing List', 'Documents', 'Health', 'Other'];

const initialCategories = [
  {
    icon: '👕', title: 'Clothing', progress: '6/12',
    items: [
      { label: 'Jackets', checked: true },
      { label: 'T-Shirts', checked: false },
      { label: 'Sweaters', checked: false },
      { label: 'Thermals', checked: true },
      { label: 'Socks', checked: false },
      { label: 'Gloves', checked: false },
    ]
  },
  {
    icon: '⚡', title: 'Essentials', progress: '4/8',
    items: [
      { label: 'Power Bank', checked: true },
      { label: 'Camera', checked: false },
      { label: 'Sunglasses', checked: false },
      { label: 'Water Bottle', checked: true },
      { label: 'Bag', checked: true },
      { label: 'Footwear', checked: false },
    ]
  },
  {
    icon: '🧴', title: 'Toiletries', progress: '1/6',
    items: [
      { label: 'Toothbrush', checked: false },
      { label: 'Toothpaste', checked: false },
      { label: 'Shampoo', checked: false },
      { label: 'Sunscreen', checked: true },
      { label: 'Moisturizer', checked: false },
      { label: 'Towel', checked: false },
    ]
  },
];

export default function Checklists() {
  const [activeTab, setActiveTab] = useState('Packing List');
  const [categories, setCategories] = useState(initialCategories);

  const toggleItem = (catIdx, itemIdx) => {
    setCategories(prev => {
      const updated = prev.map((cat, ci) => {
        if (ci !== catIdx) return cat;
        return {
          ...cat,
          items: cat.items.map((item, ii) =>
            ii === itemIdx ? { ...item, checked: !item.checked } : item
          )
        };
      });
      return updated;
    });
  };

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">My Checklists</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Don't forget the essentials!</div>
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

      <div className="check-tabs">
        {checkTabs.map(t => (
          <div key={t} className={`check-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>{t}</div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          {categories.map((cat, ci) => (
            <div key={ci} className="check-cat">
              <div className="check-cat-title">
                <span>{cat.icon} {cat.title}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.progress}</span>
              </div>
              {cat.items.map((item, ii) => (
                <div key={ii} className="check-item" onClick={() => toggleItem(ci, ii)}>
                  <div className={`checkbox${item.checked ? ' checked' : ''}`}></div>
                  <div className={`check-label${item.checked ? ' checked' : ''}`}>{item.label}</div>
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <button className="btn btn-outline btn-full btn-sm">+ Add Custom Item</button>
          </div>
        </div>

        <div>
          <div className="pack-smart">
            <div className="bag-icon">🎒</div>
            <h3>Pack Smart</h3>
            <p>Never miss an essential again!</p>
            <button className="btn" style={{ background: 'white', color: 'var(--primary)', fontSize: 13, width: '100%', justifyContent: 'center' }}>View Packing Tips</button>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>📊 Packing Progress</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ fontWeight: 700 }}>Overall Progress</span>
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>11/26 items</span>
            </div>
            <div style={{ height: 8, background: '#F3F0FF', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '42%', height: '100%', background: 'var(--gradient)', borderRadius: 4 }}></div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>42% packed · 15 items remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
