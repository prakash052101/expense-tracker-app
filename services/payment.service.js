const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Payment Service
 * Handles Razorpay integration for premium subscriptions
 */

/**
 * Initialize Razorpay client
 */
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

/**
 * Create a Razorpay order for premium purchase
 * @param {Number} amount - Amount in smallest currency unit (paise for INR)
 * @param {String} currency - Currency code (default: INR)
 * @param {Object} notes - Additional notes for the order
 * @returns {Promise<Object>} - Razorpay order object
 */
const createOrder = async (amount, currency = 'INR', notes = {}) => {
  try {
    const razorpay = getRazorpayInstance();
    
    const orderOptions = {
      amount: amount, // Amount in smallest currency unit
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: notes
    };

    const order = await razorpay.orders.create(orderOptions);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {String} orderId - Razorpay order ID
 * @param {String} paymentId - Razorpay payment ID
 * @param {String} signature - Razorpay signature
 * @returns {Boolean} - True if signature is valid
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay key secret not configured');
    }

    // Create expected signature
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Compare signatures
    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Get Razorpay key ID for client-side integration
 * @returns {String} - Razorpay key ID
 */
const getRazorpayKeyId = () => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error('Razorpay key ID not configured');
  }
  return process.env.RAZORPAY_KEY_ID;
};

module.exports = {
  createOrder,
  verifyPaymentSignature,
  getRazorpayKeyId
};
