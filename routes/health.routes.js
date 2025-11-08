const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controller/health.controller');

/**
 * Health check route
 * No authentication required - used by monitoring services
 * GET /healthz
 */
router.get('/healthz', healthCheck);

module.exports = router;
