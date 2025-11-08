require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const connectToMongo = require('./config/db');
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// Security Middleware - Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
      imgSrc: ["'self'", "data:", "https:", "https://storage.googleapis.com"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      frameSrc: ["'self'", "https://api.razorpay.com"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Disable X-Powered-By header
app.disable('x-powered-by');

// CORS configuration with environment-configurable whitelist
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression middleware for all responses
app.use(compression());


// New API routes
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const categoryRoutes = require('./routes/category.routes');
const reportRoutes = require('./routes/report.routes');
const premiumRoutes = require('./routes/premium.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');
const healthRoutes = require('./routes/health.routes');

// Body parsing middleware (built-in Express)
app.use(express.urlencoded({extended: false}));
app.use(express.json());



// Mount health check route (no authentication required)
app.use(healthRoutes);

// Mount new API routes under /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/expenses', apiLimiter, expenseRoutes);
app.use('/api/categories', apiLimiter, categoryRoutes);
app.use('/api/reports', apiLimiter, reportRoutes);
app.use('/api/premium', apiLimiter, premiumRoutes);
app.use('/api/profile', apiLimiter, profileRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);

// Serve React build in production mode
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build with cache headers
  app.use(express.static(path.join(__dirname, 'client', 'dist'), {
    maxAge: '1y', // Cache static assets for 1 year
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Don't cache HTML files (for SPA routing)
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      // Cache JS, CSS, and other assets aggressively
      else if (filePath.match(/\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/healthz')) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Route not found',
          code: 'NOT_FOUND'
        }
      });
    }
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Global error handler middleware (must be last)
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?._id?.toString(),
    timestamp: new Date().toISOString()
  });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});

// Export app for use in server.js
module.exports = app;




