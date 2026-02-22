const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  rationCard: {
    type: String,
    required: true
  },
  shopId: {
    type: String,
    required: true
  },
  expectedKg: {
    type: Number,
    required: true
  },
  receivedKg: {
    type: Number,
    required: true
  },
  differenceKg: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
