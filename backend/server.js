require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const syncJob = require('./jobs/syncJob');

const app = express();

//  Allow your frontend URLs
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://smart-lead-system-qgya.vercel.app/'
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB
connectDB();

// API routes
app.use('/api', leadRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Lead API is running',
    status: 'OK',
    endpoints: {
      process: '/api/process',
      leads: '/api/leads',
      stats: '/api/stats'
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  // Start background job
  syncJob.start();
});

//  Export for serverless platforms (Vercel)
module.exports = app;
