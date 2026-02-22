const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  rationCard: {
    type: String,
    required: true
  },
  shopId: {
    type: String,
    required: true
  },
  quantityGiven: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
