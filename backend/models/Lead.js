const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  probability: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Verified', 'To Check'],
    required: true
  },
  synced: {
    type: Boolean,
    default: false
  },
  syncedAt: {
    type: Date
  }
}, {
  timestamps: true
});

leadSchema.index({ status: 1, synced: 1 });

module.exports = mongoose.model('Lead', leadSchema);