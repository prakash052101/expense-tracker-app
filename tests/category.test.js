const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');

// Import models
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Expense = require('../models/expense.model');

// Import routes
const categoryRoutes = require('../routes/category.routes');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

// Test data
let testUser;
let authToken;

describe('Category API Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker-test';
    await mongoose.connect(mongoUri);

    // Create test user
    testUser = await User.create({
      name: 'Test User',
      email: 'category-test@example.com',
      password: 'hashedpassword123',
      totalamount: 0
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
    await User.deleteMany({ email: 'category-test@example.com' });
    
    // Close database connection
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up categories after each test
    await Category.deleteMany({ userId: testUser._id });
  });

  describe('POST /api/categories', () => {
    it('should create a new category with valid data', async () => {
      const categoryData = {
        name: 'Food & Dining',
        color: '#EF4444',
        icon: '🍔'
      };

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(categoryData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe('Food & Dining');
      expect(response.body.data.color).toBe('#EF4444');
      expect(response.body.data.icon).toBe('🍔');
    });

    it('should return 401 without auth token', async () => {
      const categoryData = {
        name: 'Test Category'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 with missing name', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ color: '#FF0000' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 409 for duplicate category name', async () => {
      // Create first category
      await Category.create({
        name: 'Shopping',
        userId: testUser._id
      });

      // Try to create duplicate
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Shopping' });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CATEGORY_EXISTS');
    });
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      // Create test categories
      await Category.create([
        {
          name: 'Food',
          userId: testUser._id,
          color: '#FF0000',
          isDefault: true
        },
        {
          name: 'Transport',
          userId: testUser._id,
          color: '#00FF00',
          isDefault: false
        }
      ]);
    });

    it('should get all categories for authenticated user', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('expenseCount');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/categories/:id', () => {
    let testCategory;

    beforeEach(async () => {
      testCategory = await Category.create({
        name: 'Original Name',
        userId: testUser._id,
        color: '#FF0000'
      });
    });

    it('should update category', async () => {
      const updateData = {
        name: 'Updated Name',
        color: '#00FF00'
      };

      const response = await request(app)
        .put(`/api/categories/${testCategory._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.color).toBe('#00FF00');
    });

    it('should return 404 for non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/categories/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    let testCategory;

    beforeEach(async () => {
      testCategory = await Category.create({
        name: 'Test Category',
        userId: testUser._id
      });
    });

    it('should delete category without expenses', async () => {
      const response = await request(app)
        .delete(`/api/categories/${testCategory._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify category is deleted
      const deletedCategory = await Category.findById(testCategory._id);
      expect(deletedCategory).toBeNull();
    });

    it('should delete category and set expenses to null', async () => {
      // Create expense with this category
      await Expense.create({
        amount: 100,
        description: 'Test expense',
        date: new Date(),
        userId: testUser._id,
        category: testCategory._id
      });

      const response = await request(app)
        .delete(`/api/categories/${testCategory._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.expensesUpdated).toBe(1);

      // Verify expense category is set to null
      const expense = await Expense.findOne({ userId: testUser._id });
      expect(expense.category).toBeNull();
    });

    it('should return 404 for non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/categories/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
