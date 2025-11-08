const Order = require('../models/order.model');
const User = require('../models/user.model');
const paymentService = require('../services/payment.service');
const { generateAccessToken } = require('../utils/token');
const logger = require('../utils/logger');

/**
 * Premium Controller
 * Handles premium subscription purchases and premium features
 */

/**
 * Create Razorpay order for premium purchase
 * POST /api/premium/purchase
 */
const purchasePremium = async (req, res) => {
  try {
    // Premium price: 4500 paise = ₹45
    const amount = 4500;
    const currency = 'INR';

    // Create Razorpay order
    const order = await paymentService.createOrder(amount, currency, {
      userId: req.user._id.toString(),
      type: 'premium_subscription'
    });

    // Create order record in database
    const newOrder = new Order({
      orderid: order.id,
      status: 'pending',
      amount: amount,
      currency: currency,
      userId: req.user._id
    });
    await newOrder.save();

    // Return order details and Razorpay key for client-side integration
    res.status(201).json({
      success: true,
      data: {
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency
        },
        key_id: paymentService.getRazorpayKeyId()
      }
    });
  } catch (error) {
    logger.error('Error creating premium order', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create premium order',
        code: 'ORDER_CREATION_FAILED'
      }
    });
  }
};

/**
 * Verify payment and update user to premium
 * POST /api/premium/verify
 */
const verifyPremium = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    // Validate required fields
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Missing required payment verification fields',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Verify payment signature
    const isValid = paymentService.verifyPaymentSignature(order_id, payment_id, signature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid payment signature',
          code: 'INVALID_SIGNATURE'
        }
      });
    }

    // Find order
    const order = await Order.findOne({ orderid: order_id });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        }
      });
    }

    // Check if order belongs to the authenticated user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Unauthorized to verify this order',
          code: 'UNAUTHORIZED'
        }
      });
    }

    // Update order status
    order.paymentid = payment_id;
    order.status = 'success';
    await order.save();

    // Update user to premium
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    user.ispremiumuser = true;
    await user.save();

    // Log successful payment completion
    logger.info('Payment completed successfully', {
      userId: user._id.toString(),
      email: user.email,
      orderId: order_id,
      paymentId: payment_id,
      amount: order.amount,
      timestamp: new Date().toISOString()
    });

    // Generate new token with premium status
    const token = generateAccessToken(user._id, true);

    res.status(200).json({
      success: true,
      data: {
        message: 'Premium subscription activated successfully',
        isPremium: true,
        token: token
      }
    });
  } catch (error) {
    logger.error('Error verifying payment', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to verify payment',
        code: 'VERIFICATION_FAILED'
      }
    });
  }
};

/**
 * Get leaderboard of top spenders (premium users only)
 * GET /api/premium/leaderboard
 */
const getLeaderboard = async (req, res) => {
  try {
    // Check if user is premium
    if (!req.user.ispremiumuser) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Premium subscription required to access leaderboard',
          code: 'PREMIUM_REQUIRED'
        }
      });
    }

    // Get all users sorted by total amount (descending)
    const users = await User.find({}, 'name totalamount')
      .sort({ totalamount: -1 })
      .limit(100); // Limit to top 100 users

    // Format leaderboard data
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalExpenses: user.totalamount || 0
    }));

    res.status(200).json({
      success: true,
      data: {
        leaderboard: leaderboard,
        count: leaderboard.length
      }
    });
  } catch (error) {
    logger.error('Error fetching leaderboard', {
      error: error.message,
      stack: error.stack,
      userId: req.user._id.toString(),
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch leaderboard',
        code: 'LEADERBOARD_FETCH_FAILED'
      }
    });
  }
};

module.exports = {
  purchasePremium,
  verifyPremium,
  getLeaderboard
};
