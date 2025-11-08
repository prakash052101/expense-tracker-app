require('dotenv').config();
const app = require('./app');
const connectToMongo = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 4000;
let server;

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`, {
    timestamp: new Date().toISOString()
  });

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed', {
        timestamp: new Date().toISOString()
      });

      // Close database connection
      const mongoose = require('mongoose');
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed', {
          timestamp: new Date().toISOString()
        });
        console.log('Graceful shutdown completed');
        process.exit(0);
      });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout', {
        timestamp: new Date().toISOString()
      });
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString()
  });
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Connect to MongoDB and start server
connectToMongo()
  .then(() => {
    server = app.listen(PORT, () => {
      logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
      });
      console.log(`Server started at port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
