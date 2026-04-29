import React from 'react';
import './Budget.css';

export default function Budget({ tripData }) {
  // Calculate budget based on trip parameters
  const days = tripData?.days || 5;
  const destType = tripData?.destType || 'Any';
  
  // Base daily budget per person (in rupees)
  let dailyBudget = 3000;
  
  // Adjust based on destination type
  const destTypeMultiplier = {
    'Any': 1,
    'Beach': 1.3,
    'Mountains': 1.1,
    'City': 1.4,
    'Culture': 1.2,
  };
  
  dailyBudget = dailyBudget * (destTypeMultiplier[destType] || 1);
  
  // Calculate total budget
  const totalBudget = Math.round(dailyBudget * days);
  
  // Budget breakdown percentages
  const breakdown = {
    transport: Math.round(totalBudget * 0.24),
    accommodation: Math.round(totalBudget * 0.36),
    food: Math.round(totalBudget * 0.18),
    activities: Math.round(totalBudget * 0.15),
    shopping: Math.round(totalBudget * 0.07),
  };
  
  const circumference = 282.7;
  const transport_dash = (breakdown.transport / totalBudget) * circumference;
  const accommodation_dash = (breakdown.accommodation / totalBudget) * circumference;
  const food_dash = (breakdown.food / totalBudget) * circumference;
  const activities_dash = (breakdown.activities / totalBudget) * circumference;
  const shopping_dash = (breakdown.shopping / totalBudget) * circumference;

  const legend = [
    { color: '#3B82F6', label: 'Transport', val: `₹${breakdown.transport.toLocaleString()} (${Math.round((breakdown.transport / totalBudget) * 100)}%)` },
    { color: '#8B5CF6', label: 'Accommodation', val: `₹${breakdown.accommodation.toLocaleString()} (${Math.round((breakdown.accommodation / totalBudget) * 100)}%)` },
    { color: '#F59E0B', label: 'Food', val: `₹${breakdown.food.toLocaleString()} (${Math.round((breakdown.food / totalBudget) * 100)}%)` },
    { color: '#10B981', label: 'Activities', val: `₹${breakdown.activities.toLocaleString()} (${Math.round((breakdown.activities / totalBudget) * 100)}%)` },
    { color: '#EF4444', label: 'Shopping', val: `₹${breakdown.shopping.toLocaleString()} (${Math.round((breakdown.shopping / totalBudget) * 100)}%)` },
  ];

  const spent = Math.round(totalBudget * 0.38);
  const remaining = totalBudget - spent;
  const dailySavings = Math.round(remaining / days);

  const transactions = [
    { name: 'Hotel Accommodation', date: `Day 1-${days}`, amt: `−₹${breakdown.accommodation.toLocaleString()}`, neg: true },
    { name: 'Activities & Tours', date: `Day 2-${days}`, amt: `−₹${breakdown.activities.toLocaleString()}`, neg: true },
    { name: 'Meals & Dining', date: `Daily`, amt: `−₹${breakdown.food.toLocaleString()}`, neg: true },
  ];

  return (
    <div className="page-wrapper">
      <div className="topbar">
        <div>
          <div className="topbar-title">Trip Budget</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{days} Days • {destType} • Est. ₹{totalBudget.toLocaleString()}</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-outline btn-sm">↗ Export</button>
          <div className="avatar">A</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-title">Budget Overview</div>
          <div style={{ margin: '20px 0' }}>
            <div className="donut-chart">
              <svg className="donut-svg" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="60" fill="none" stroke="#3B82F6" strokeWidth="22" strokeDasharray={`${transport_dash} ${circumference}`} strokeDashoffset="0"/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#8B5CF6" strokeWidth="22" strokeDasharray={`${accommodation_dash} ${circumference}`} strokeDashoffset={`-${transport_dash}`}/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#F59E0B" strokeWidth="22" strokeDasharray={`${food_dash} ${circumference}`} strokeDashoffset={`-${transport_dash + accommodation_dash}`}/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#10B981" strokeWidth="22" strokeDasharray={`${activities_dash} ${circumference}`} strokeDashoffset={`-${transport_dash + accommodation_dash + food_dash}`}/>
                <circle cx="80" cy="80" r="60" fill="none" stroke="#EF4444" strokeWidth="22" strokeDasharray={`${shopping_dash} ${circumference}`} strokeDashoffset={`-${transport_dash + accommodation_dash + food_dash + activities_dash}`}/>
              </svg>
              <div className="donut-center">
                <div className="donut-total">₹{totalBudget.toLocaleString()}</div>
                <div className="donut-label">Total Budget</div>
              </div>
            </div>
          </div>
          <div className="budget-legend">
            {legend.map(l => (
              <div key={l.label} className="legend-item">
                <div className="legend-dot" style={{ background: l.color }}></div>
                <span>{l.label}</span>
                <span className="legend-val">{l.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Expense Summary</div>
            <div className="summary-box">
              <div className="summary-label">Spent So Far</div>
              <div className="summary-val">₹{spent.toLocaleString()}</div>
            </div>
            <div className="summary-box" style={{ background: '#FEF3C7' }}>
              <div className="summary-label">Remaining Budget</div>
              <div className="summary-val">₹{remaining.toLocaleString()}</div>
            </div>
            <div className="summary-box" style={{ background: '#D1FAE5' }}>
              <div className="summary-label">Daily Savings</div>
              <div className="summary-val" style={{ color: 'var(--green)' }}>₹{dailySavings.toLocaleString()}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Estimated Expenses</div>
            {transactions.map((t, i) => (
              <div key={i} className="expense-item">
                <div>
                  <div className="expense-name">{t.name}</div>
                  <div className="expense-date">{t.date}</div>
                </div>
                <div className={`expense-amt${t.neg ? ' negative' : ' positive'}`}>{t.amt}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>💡 Budget Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['🎫', 'Book activities in advance', 'Save up to 20%'],
                ['👥', 'Travel in group', 'Share cabs & stay to save more'],
                ['🍽️', 'Eat local', 'Try local food & save big'],
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12 }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
