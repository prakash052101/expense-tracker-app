const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ispremiumuser: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  totalamount: {
    type: Number,
    default: 0,
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    monthlyBudget: {
      type: Number,
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
