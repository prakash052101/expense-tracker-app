const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  paymentid: {
    type: String,
  },
  orderid: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
