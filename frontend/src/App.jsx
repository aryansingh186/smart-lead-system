import React, { useState, useEffect } from 'react';

import { processBatch, getAllLeads, getStats } from './services/api';


import LeadInput from './components/LeadInput';
import StatsCards from './components/StatsCards';
import LeadsTable from './components/LeadsTable';

function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, toCheck: 0, synced: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchStats();
    
    const interval = setInterval(() => {
      fetchStats();
      fetchLeads();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await getAllLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (nameList) => {
    setLoading(true);
    try {
      await processBatch(nameList);
      await fetchLeads();
      await fetchStats();
      alert('Leads processed successfully!');
    } catch (error) {
      console.error('Error processing batch:', error);
      alert('Failed to process leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await api.delete(`/leads/${leadId}`);
      await fetchLeads();
      await fetchStats();
      alert('Lead deleted successfully!');
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '40px 20px' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '40px' 
        }}>
          🌍 Smart Lead System
        </h1>

        <LeadInput onSubmit={handleSubmit} loading={loading} />
        <StatsCards stats={stats} />
        <LeadsTable 
          leads={leads} 
          filter={filter} 
          onFilterChange={setFilter}
          onDelete={handleDeleteLead}
        />
      </div>
    </div>
  );
}

export default App;