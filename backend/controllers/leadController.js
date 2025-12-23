const Lead = require('../models/Lead');
const enrichmentService = require('../services/enrichmentService');

exports.processBatch = async (req, res) => {
  try {
    const { names } = req.body;

    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ error: 'Names array is required' });
    }

    const enrichedData = await enrichmentService.enrichBatch(names);

    const leads = names.map((name, index) => ({
      name: name.trim(),
      ...enrichedData[index]
    }));

    const savedLeads = await Lead.insertMany(leads);

    res.status(201).json({
      success: true,
      count: savedLeads.length,
      data: savedLeads
    });
  } catch (error) {
    console.error('Error processing batch:', error);
    res.status(500).json({ error: 'Failed to process leads' });
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const verified = await Lead.countDocuments({ status: 'Verified' });
    const toCheck = await Lead.countDocuments({ status: 'To Check' });
    const synced = await Lead.countDocuments({ synced: true });

    res.json({
      success: true,
      data: { total, verified, toCheck, synced }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};