const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

// Import models
const User = require('../models/user.model');
const Expense = require('../models/expense.model');
const Category = require('../models/category.model');

// Import routes
const expenseRoutes = require('../routes/expense.routes');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/expenses', expenseRoutes);

// Test data
let testUser;
let testCategory;
let authToken;

describe('Expense API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker-test';
    await mongoose.connect(mongoUri);

    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      totalamount: 0
    });

    // Create test category
    testCategory = await Category.create({
      name: 'Test Category',
      userId: testUser._id,
      color: '#FF0000'
    });

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || 'yourkey',
      { expiresIn: '24h' }
    );
  });

  afterAll(async () => {
    // Clean up test data
    await Expense.deleteMany({ userId: testUser._id });
    await Category.deleteMany({ userId: testUser._id });
    await User.deleteMany({ email: 'test@example.com' });
    
    // Close database connection
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up expenses after each test
    await Expense.deleteMany({ userId: testUser._id });
  });

  describe('POST /api/expenses', () => {
    it('should create a new expense with valid data', async () => {
      const expenseData = {
        amount: 100.50,
        description: 'Test expense',
        date: new Date().toISOString(),
        category: testCategory._id.toString()
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.amount).toBe(100.50);
      expect(response.body.data.description).toBe('Test expense');
    });

    it('should return 401 without auth token', async () => {
      const expenseData = {
        amount: 100,
        description: 'Test expense',
        date: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/expenses')
        .send(expenseData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 with missing required fields', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 100 }); // Missing description and date

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 with invalid amount', async () => {
      const expenseData = {
        amount: -50, // Negative amount
        description: 'Test expense',
        date: new Date().toISOString()
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/expenses', () => {
    beforeEach(async () => {
      // Create test expenses
      await Expense.create([
        {
          amount: 50,
          description: 'Expense 1',
          date: new Date('2024-01-01'),
          userId: testUser._id,
          category: testCategory._id
        },
        {
          amount: 75,
          description: 'Expense 2',
          date: new Date('2024-01-02'),
          userId: testUser._id,
          category: testCategory._id
        },
        {
          amount: 100,
          description: 'Expense 3',
          date: new Date('2024-01-03'),
          userId: testUser._id
        }
      ]);
    });

    it('should get all expenses for authenticated user', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.expenses).toHaveLength(3);
      expect(response.body.data.pagination).toHaveProperty('totalExpenses', 3);
    });

    it('should filter expenses by date range', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          startDate: '2024-01-02',
          endDate: '2024-01-03'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.expenses).toHaveLength(2);
    });

    it('should filter expenses by category', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ category: testCategory._id.toString() });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.expenses).toHaveLength(2);
    });

    it('should paginate expenses', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.expenses).toHaveLength(2);
      expect(response.body.data.pagination.hasNextPage).toBe(true);
    });
  });

  describe('GET /api/expenses/:id', () => {
    let testExpense;

    beforeEach(async () => {
      testExpense = await Expense.create({
        amount: 50,
        description: 'Test expense',
        date: new Date(),
        userId: testUser._id,
        category: testCategory._id
      });
    });

    it('should get expense by ID', async () => {
      const response = await request(app)
        .get(`/api/expenses/${testExpense._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testExpense._id.toString());
      expect(response.body.data.amount).toBe(50);
    });

    it('should return 404 for non-existent expense', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/expenses/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/expenses/:id', () => {
    let testExpense;

    beforeEach(async () => {
      testExpense = await Expense.create({
        amount: 50,
        description: 'Original description',
        date: new Date(),
        userId: testUser._id
      });
    });

    it('should update expense', async () => {
      const updateData = {
        amount: 75,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/expenses/${testExpense._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(75);
      expect(response.body.data.description).toBe('Updated description');
    });

    it('should return 404 for non-existent expense', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/expenses/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ amount: 100 });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/expenses/:id', () => {
    let testExpense;

    beforeEach(async () => {
      testExpense = await Expense.create({
        amount: 50,
        description: 'Test expense',
        date: new Date(),
        userId: testUser._id
      });
    });

    it('should delete expense', async () => {
      const response = await request(app)
        .delete(`/api/expenses/${testExpense._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify expense is deleted
      const deletedExpense = await Expense.findById(testExpense._id);
      expect(deletedExpense).toBeNull();
    });

    it('should return 404 for non-existent expense', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/expenses/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
