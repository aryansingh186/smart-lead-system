import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

const LeadsTable = ({ leads, filter, onFilterChange, onDelete }) => {
  const [deleting, setDeleting] = useState(null);

  const filteredLeads = (leads || []).filter(lead => {
    if (filter === 'all') return true;
    return lead.status === filter;
  });

  const handleDelete = async (leadId, leadName) => {
    if (!window.confirm(`Are you sure you want to delete "${leadName}"?`)) return;
    
    setDeleting(leadId);
    try {
      await onDelete(leadId);
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Leads</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onFilterChange('all')}
            style={{
              padding: '8px 16px',
              border: filter === 'all' ? '2px solid #667eea' : '2px solid #e5e7eb',
              background: filter === 'all' ? '#ede9fe' : 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('Verified')}
            style={{
              padding: '8px 16px',
              border: filter === 'Verified' ? '2px solid #10b981' : '2px solid #e5e7eb',
              background: filter === 'Verified' ? '#d1fae5' : 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Verified
          </button>
          <button
            onClick={() => onFilterChange('To Check')}
            style={{
              padding: '8px 16px',
              border: filter === 'To Check' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
              background: filter === 'To Check' ? '#fef3c7' : 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            To Check
          </button>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          No leads found. Add some names to get started!
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Country</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Confidence</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Synced</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, idx) => (
                <tr key={lead._id || idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{lead.name}</td>
                  <td style={{ padding: '12px' }}>{lead.country}</td>
                  <td style={{ padding: '12px' }}>
                    {(() => {
                      const raw = Number(lead.probability) || 0;
                      const p = raw > 1 ? raw / 100 : raw;
                      const pct = (p * 100).toFixed(1);
                      const isHigh = p >= 0.6;
                      return (
                        <span style={{
                          background: isHigh ? '#d1fae5' : '#fef3c7',
                          color: isHigh ? '#065f46' : '#92400e',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {pct}%
                        </span>
                      );
                    })()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: lead.status === 'Verified' ? '#d1fae5' : '#fef3c7',
                      color: lead.status === 'Verified' ? '#065f46' : '#92400e',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {lead.status === 'Verified' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {lead.synced ? (
                      <span style={{ color: '#10b981', fontWeight: '500' }}>✓ Yes</span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Pending</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleDelete(lead._id, lead.name)}
                      disabled={deleting === lead._id}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: deleting === lead._id ? '#9ca3af' : '#ef4444',
                        cursor: deleting === lead._id ? 'not-allowed' : 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (deleting !== lead._id) {
                          e.currentTarget.style.background = '#fef2f2';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Delete lead"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;