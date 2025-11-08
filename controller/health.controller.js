const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Health check endpoint
 * Returns system status and database connectivity
 * Must respond within 500ms
 */
const healthCheck = async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
    
    // Quick ping to verify database is responsive
    if (dbState === 1) {
      await mongoose.connection.db.admin().ping();
    }
    
    const responseTime = Date.now() - startTime;
    
    // Ensure response is within 500ms requirement
    if (responseTime > 500) {
      logger.warn('Health check exceeded 500ms threshold', { responseTime });
    }
    
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      responseTime: `${responseTime}ms`
    };
    
    return res.status(200).json(healthStatus);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    logger.error('Health check failed', {
      error: error.message,
      stack: error.stack,
      responseTime
    });
    
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'error',
      error: error.message,
      responseTime: `${responseTime}ms`
    });
  }
};

module.exports = {
  healthCheck
};
