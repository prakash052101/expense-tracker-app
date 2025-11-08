import api from './api';

/**
 * Premium Service
 * Handles all premium-related API calls
 */

/**
 * Create Razorpay order for premium purchase
 * @returns {Promise} Order details and Razorpay key
 */
export const purchasePremium = async () => {
  const response = await api.post('/premium/purchase');
  return response.data;
};

/**
 * Verify payment and activate premium subscription
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.order_id - Razorpay order ID
 * @param {string} paymentData.payment_id - Razorpay payment ID
 * @param {string} paymentData.signature - Razorpay signature
 * @returns {Promise} Verification result
 */
export const verifyPremium = async (paymentData) => {
  const response = await api.post('/premium/verify', paymentData);
  return response.data;
};

/**
 * Get leaderboard of top spenders (premium users only)
 * @returns {Promise} Leaderboard data
 */
export const getLeaderboard = async () => {
  const response = await api.get('/premium/leaderboard');
  return response.data;
};

export default {
  purchasePremium,
  verifyPremium,
  getLeaderboard,
};
