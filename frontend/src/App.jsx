import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import StatsCards from './components/StatsCards';
import LeadInput from './components/LeadInput';
import LeadsTable from './components/LeadsTable';
import { processBatch, getAllLeads, getStats } from './services/api';
import './App.css';

function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, toCheck: 0, synced: 0 });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeads();
    fetchStats();
    const interval = setInterval(() => {
      fetchLeads();
      fetchStats();
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await getAllLeads();
      setLeads(response && response.data ? response.data : []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response && response.data ? response.data : { total: 0, verified: 0, toCheck: 0, synced: 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleProcessBatch = async (names) => {
    setLoading(true);
    setMessage('Processing names...');
    try {
      await processBatch(names);
      await fetchLeads();
      await fetchStats();
      setMessage(`✓ Successfully processed ${names.length} names!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error processing batch:', error);
      setMessage('✗ Error processing names');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>
            <Users size={40} />
            Smart Lead Automation
          </h1>
          <p>Intelligent Lead Enrichment & CRM Sync</p>
        </div>

        {message && (
          <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <StatsCards stats={stats} />
        <LeadInput onSubmit={handleProcessBatch} loading={loading} />
        <LeadsTable leads={leads} filter={filter} onFilterChange={setFilter} />
      </div>
    </div>
  );
}

export default App;