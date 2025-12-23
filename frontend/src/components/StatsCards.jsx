import React from 'react';
import { Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    { icon: Users, label: 'Total Leads', value: stats.total, color: '#667eea' },
    { icon: CheckCircle, label: 'Verified', value: stats.verified, color: '#10b981' },
    { icon: AlertCircle, label: 'To Check', value: stats.toCheck, color: '#f59e0b' },
    { icon: RefreshCw, label: 'Synced', value: stats.synced, color: '#8b5cf6' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      {cards.map((card, idx) => (
        <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <card.icon size={24} style={{ color: card.color }} />
            <span style={{ fontSize: '14px', color: '#666' }}>{card.label}</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;