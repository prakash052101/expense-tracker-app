const request = require('supertest');
const express = require('express');
const healthRoutes = require('../routes/health.routes');

// Create a test app
const app = express();
app.use(express.json());
app.use(healthRoutes);

describe('Health Check Endpoint', () => {
  describe('GET /healthz', () => {
    it('should return health status with required fields', async () => {
      const response = await request(app).get('/healthz');

      // Should return either 200 (connected) or 503 (error)
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('responseTime');
    });

    it('should respond within 500ms', async () => {
      const startTime = Date.now();
      await request(app).get('/healthz');
      const responseTime = Date.now() - startTime;

      expect(responseTime).toBeLessThan(500);
    });

    it('should include uptime when status is ok', async () => {
      const response = await request(app).get('/healthz');

      if (response.status === 200) {
        expect(response.body).toHaveProperty('uptime');
        expect(typeof response.body.uptime).toBe('number');
      }
    });
  });
});
