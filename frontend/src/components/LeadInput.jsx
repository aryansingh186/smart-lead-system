import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const LeadInput = ({ onSubmit, loading }) => {
  const [names, setNames] = useState('');

  const handleSubmit = () => {
    if (!names.trim()) {
      alert('Please enter at least one name');
      return;
    }

    const nameList = names.split(',').map(n => n.trim()).filter(n => n);
    onSubmit(nameList);
    setNames('');
  };

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
        Add New Leads
      </h2>
      <textarea
        value={names}
        onChange={(e) => setNames(e.target.value)}
        placeholder="Enter names separated by commas (e.g., Peter, Aditi, Ravi, Satoshi)"
        style={{
          width: '100%',
          padding: '15px',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '16px',
          fontFamily: 'inherit',
          resize: 'vertical',
          minHeight: '100px',
          marginBottom: '15px',
          boxSizing: 'border-box'
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Upload size={20} />
        {loading ? 'Processing...' : 'Process Leads'}
      </button>
    </div>
  );
};

export default LeadInput;