const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const forgotPasswordSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - MongoDB will auto-delete expired documents
  }
}, { timestamps: true });

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
