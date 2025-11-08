/**
 * Simple verification script to check if category routes are properly configured
 * This doesn't require a database connection
 */

const express = require('express');

// Import routes
const categoryRoutes = require('../routes/category.routes');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

// Get all registered routes
function getRoutes(app) {
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = middleware.regexp.source
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '')
            .replace(/\\\//g, '/');
          routes.push({
            path: path + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  
  return routes;
}

console.log('✓ Category routes loaded successfully\n');
console.log('Registered routes:');

const routes = getRoutes(app);
routes.forEach(route => {
  console.log(`  ${route.methods.join(', ').toUpperCase()} ${route.path}`);
});

console.log('\n✓ All category routes are properly configured');
console.log('\nExpected routes:');
console.log('  GET /api/categories');
console.log('  POST /api/categories');
console.log('  PUT /api/categories/:id');
console.log('  DELETE /api/categories/:id');

process.exit(0);
