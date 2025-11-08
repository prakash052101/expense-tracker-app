const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const premiumController = require('../controllers/premium.controller');

/**
 * Premium Routes
 * All routes require authentication
 * Leaderboard route requires premium subscription
 */

/**
 * @route   POST /api/premium/purchase
 * @desc    Create Razorpay order for premium purchase
 * @access  Private (authenticated users)
 */
router.post('/purchase', authenticate, premiumController.purchasePremium);

/**
 * @route   POST /api/premium/verify
 * @desc    Verify payment and activate premium subscription
 * @access  Private (authenticated users)
 */
router.post('/verify', authenticate, premiumController.verifyPremium);

/**
 * @route   GET /api/premium/leaderboard
 * @desc    Get leaderboard of top spenders
 * @access  Private (premium users only)
 * @note    Premium check is handled within the controller
 */
router.get('/leaderboard', authenticate, premiumController.getLeaderboard);

module.exports = router;
