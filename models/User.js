const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  utid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  rationCard: {
    type: String,
    required: true
  },
  shopId: {
    type: String,
    required: true
  },
  allocationKg: {
    type: Number,
    required: true
  },
  secretKey: {
  type: String,
  required: true
}

});

const User = mongoose.model('User', userSchema);

module.exports = User;
