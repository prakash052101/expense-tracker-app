# Design Document

## Overview

This design document outlines the architecture for modernizing the expense tracker application from a traditional server-rendered application to a modern full-stack application with React frontend and enhanced Node.js backend. The system will maintain backward compatibility with existing MongoDB data while introducing new features, security enhancements, and deployment infrastructure.

### Design Goals

1. **Separation of Concerns**: Decouple frontend (React SPA) from backend (REST API)
2. **Backward Compatibility**: Preserve existing API endpoints and data structures
3. **Security First**: Implement industry-standard security practices
4. **Deployment Ready**: Docker containerization and cloud platform support
5. **Developer Experience**: Clear project structure, testing, and CI/CD
6. **Performance**: Optimized bundle sizes, lazy loading, and caching strategies

### Technology Stack

**Frontend:**
- React 18 with Vite build tool
- Tailwind CSS for styling
- React Router v6 for client-side routing
- Axios for HTTP requests
- Recharts for data visualization
- React Context API for state management

**Backend:**
- Node.js 20 LTS
- Express.js 4.x
- Mongoose ODM for MongoDB
- JWT for authentication
- Helmet for security headers
- Express-rate-limit for rate limiting
- Compression middleware

**Infrastructure:**
- Docker with multi-stage builds
- GitHub Actions for CI/CD
- Render for deployment (or similar PaaS)
- MongoDB Atlas for database
- Firebase Cloud Storage for file uploads
- Firestore for file metadata

## Architecture

### High-Level Architecture


```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React SPA (Vite + Tailwind)                           │ │
│  │  - Components (Dashboard, Expenses, Auth, Profile)     │ │
│  │  - React Router (Client-side routing)                  │ │
│  │  - Context API (Auth, Theme, User state)               │ │
│  │  - Axios HTTP Client                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js Middleware Stack                           │ │
│  │  - Helmet (Security headers)                           │ │
│  │  - CORS (Cross-origin control)                         │ │
│  │  - Rate Limiter (DDoS protection)                      │ │
│  │  - Compression (Response optimization)                 │ │
│  │  - Body Parser (JSON/URL-encoded)                      │ │
│  │  - JWT Authentication Middleware                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │ Controllers  │  │  Services    │      │
│  │              │  │              │  │              │      │
│  │ - Auth       │→ │ - Auth       │→ │ - Email      │      │
│  │ - Expenses   │  │ - Expenses   │  │ - S3 Upload  │      │
│  │ - Premium    │  │ - Premium    │  │ - Payment    │      │
│  │ - Admin      │  │ - Admin      │  │ - CSV Export │      │
│  │ - Health     │  │ - Reports    │  │ - Analytics  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Mongoose Models                                       │ │
│  │  - User (auth, profile, premium status)                │ │
│  │  - Expense (amount, category, date, receipt)           │ │
│  │  - Category (name, user, color)                        │ │
│  │  - Order (payment tracking)                            │ │
│  │  - ForgotPassword (reset tokens)                       │ │
│  │  - FilesDownloaded (audit trail)                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  MongoDB     │  │   Firebase   │  │  Razorpay    │      │
│  │   Atlas      │  │Cloud Storage │  │  (Payments)  │      │
│  └──────────────┘  │  (Receipts)  │  └──────────────┘      │
│  ┌──────────────┐  │  Firestore   │                        │
│  │   SendGrid   │  │  (Metadata)  │                        │
│  │   (Email)    │  └──────────────┘                        │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

**Option 1: Combined Deployment (Recommended for MVP)**
```
Render Web Service
├── Express Server (Port 3000)
│   ├── Serves API routes (/api/*)
│   ├── Serves React build (static files)
│   └── Fallback to index.html (SPA routing)
```

**Option 2: Separate Deployment (Scalable)**
```
Render Static Site          Render Web Service
├── React Build            ├── Express API Server
│   (CDN-optimized)        │   (Port 3000)
│                          │
└── Calls API via CORS ────┘
```

## Components and Interfaces

### Frontend Component Structure


```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx              # Navigation, user menu, logout
│   │   │   ├── Sidebar.jsx             # Desktop navigation menu
│   │   │   ├── MobileNav.jsx           # Mobile hamburger menu
│   │   │   └── Footer.jsx              # Footer with links
│   │   ├── dashboard/
│   │   │   ├── KPICard.jsx             # Metric display card
│   │   │   ├── ExpenseChart.jsx        # Pie/bar chart component
│   │   │   ├── RecentExpenses.jsx      # List of recent items
│   │   │   ├── BudgetWidget.jsx        # Budget progress bar
│   │   │   └── QuickAddFAB.jsx         # Floating action button
│   │   ├── expenses/
│   │   │   ├── ExpenseList.jsx         # Paginated expense table
│   │   │   ├── ExpenseItem.jsx         # Single expense row
│   │   │   ├── ExpenseModal.jsx        # Add/Edit modal form
│   │   │   ├── ExpenseFilters.jsx      # Date/category filters
│   │   │   └── ReceiptUpload.jsx       # File upload component
│   │   ├── categories/
│   │   │   ├── CategoryManager.jsx     # CRUD interface
│   │   │   ├── CategoryBadge.jsx       # Display component
│   │   │   └── CategorySelect.jsx      # Dropdown selector
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx           # Login page
│   │   │   ├── RegisterForm.jsx        # Registration page
│   │   │   ├── ForgotPassword.jsx      # Password reset request
│   │   │   └── ResetPassword.jsx       # Password reset form
│   │   ├── profile/
│   │   │   ├── ProfileSettings.jsx     # User info editor
│   │   │   ├── PreferencesForm.jsx     # Currency/timezone
│   │   │   └── PasswordChange.jsx      # Password update
│   │   ├── premium/
│   │   │   ├── PremiumBanner.jsx       # Upgrade CTA
│   │   │   ├── PaymentModal.jsx        # Razorpay integration
│   │   │   └── Leaderboard.jsx         # Premium feature
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx      # Admin analytics
│   │   │   ├── UserStats.jsx           # User metrics
│   │   │   └── RevenueChart.jsx        # Revenue visualization
│   │   └── common/
│   │       ├── Button.jsx              # Reusable button
│   │       ├── Input.jsx               # Form input
│   │       ├── Modal.jsx               # Modal wrapper
│   │       ├── Spinner.jsx             # Loading indicator
│   │       ├── Toast.jsx               # Notification
│   │       └── ErrorBoundary.jsx       # Error handling
│   ├── contexts/
│   │   ├── AuthContext.jsx             # User auth state
│   │   ├── ThemeContext.jsx            # Dark/light mode
│   │   └── ExpenseContext.jsx          # Expense data cache
│   ├── hooks/
│   │   ├── useAuth.js                  # Auth operations
│   │   ├── useExpenses.js              # Expense CRUD
│   │   ├── useCategories.js            # Category management
│   │   └── useDebounce.js              # Input debouncing
│   ├── services/
│   │   ├── api.js                      # Axios instance config
│   │   ├── authService.js              # Auth API calls
│   │   ├── expenseService.js           # Expense API calls
│   │   ├── categoryService.js          # Category API calls
│   │   ├── premiumService.js           # Payment API calls
│   │   └── exportService.js            # CSV download
│   ├── utils/
│   │   ├── formatters.js               # Date/currency formatting
│   │   ├── validators.js               # Form validation
│   │   └── constants.js                # App constants
│   ├── pages/
│   │   ├── Dashboard.jsx               # Main dashboard page
│   │   ├── Expenses.jsx                # Expense management page
│   │   ├── Reports.jsx                 # Reports and export page
│   │   ├── Profile.jsx                 # User profile page
│   │   ├── Premium.jsx                 # Premium upgrade page
│   │   ├── Admin.jsx                   # Admin dashboard page
│   │   └── NotFound.jsx                # 404 page
│   ├── App.jsx                         # Root component
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Tailwind imports
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### Backend API Structure


```
server/ (root directory)
├── config/
│   ├── db.js                           # MongoDB connection
│   ├── firebase.js                     # Firebase Admin SDK config
│   ├── razorpay.js                     # Razorpay client config
│   └── email.js                        # Email service config
├── middleware/
│   ├── auth.js                         # JWT verification
│   ├── adminAuth.js                    # Admin role check
│   ├── rateLimiter.js                  # Rate limiting config
│   ├── errorHandler.js                 # Global error handler
│   ├── validator.js                    # Request validation
│   └── fileUpload.js                   # Multer config
├── models/
│   ├── user.model.js                   # User schema (enhanced)
│   ├── expense.model.js                # Expense schema (enhanced)
│   ├── category.model.js               # NEW: Category schema
│   ├── order.model.js                  # Payment order schema
│   ├── forgotpassword.model.js         # Password reset tokens
│   └── filesdownloaded.model.js        # Download audit log
├── controllers/
│   ├── auth.controller.js              # Register, login, reset
│   ├── expense.controller.js           # CRUD operations
│   ├── category.controller.js          # NEW: Category CRUD
│   ├── premium.controller.js           # Payment processing
│   ├── report.controller.js            # CSV export, analytics
│   ├── admin.controller.js             # NEW: Admin dashboard
│   └── health.controller.js            # NEW: Health check
├── services/
│   ├── email.service.js                # Send emails
│   ├── firebase.service.js             # Firebase Storage upload/delete
│   ├── payment.service.js              # Razorpay operations
│   ├── csv.service.js                  # CSV generation
│   └── analytics.service.js            # Data aggregation
├── routes/
│   ├── auth.routes.js                  # /api/auth/*
│   ├── expense.routes.js               # /api/expenses/*
│   ├── category.routes.js              # NEW: /api/categories/*
│   ├── premium.routes.js               # /api/premium/*
│   ├── report.routes.js                # /api/reports/*
│   ├── admin.routes.js                 # NEW: /api/admin/*
│   └── health.routes.js                # NEW: /healthz
├── utils/
│   ├── token.js                        # JWT generation/verify
│   ├── logger.js                       # NEW: Winston logger
│   └── helpers.js                      # Utility functions
├── tests/
│   ├── unit/
│   │   ├── expense.test.js             # Expense controller tests
│   │   └── auth.test.js                # Auth controller tests
│   ├── integration/
│   │   └── api.test.js                 # API endpoint tests
│   └── setup.js                        # Test configuration
├── scripts/
│   └── seed.js                         # NEW: Sample data seeder
├── app.js                              # Express app setup
├── server.js                           # NEW: Server entry point
├── Dockerfile                          # NEW: Container config
├── .dockerignore                       # NEW: Docker ignore
├── Procfile                            # NEW: Render config
└── package.json
```

### API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/register              # Create new user
POST   /api/auth/login                 # Authenticate user
POST   /api/auth/forgot-password       # Request password reset
POST   /api/auth/reset-password        # Reset password with token
GET    /api/auth/verify                # Verify JWT token
```

#### Expense Endpoints
```
GET    /api/expenses                   # List expenses (paginated, filtered)
GET    /api/expenses/:id               # Get single expense
POST   /api/expenses                   # Create expense (with optional file)
PUT    /api/expenses/:id               # Update expense
DELETE /api/expenses/:id               # Delete expense
```

#### Category Endpoints (NEW)
```
GET    /api/categories                 # List user categories
POST   /api/categories                 # Create category
PUT    /api/categories/:id             # Update category
DELETE /api/categories/:id             # Delete category
```

#### Premium Endpoints
```
POST   /api/premium/purchase           # Create Razorpay order
POST   /api/premium/verify             # Verify payment
GET    /api/premium/leaderboard        # Get top spenders (premium only)
```

#### Report Endpoints
```
GET    /api/reports/dashboard          # Dashboard analytics
GET    /api/reports/export             # Download CSV
GET    /api/reports/monthly            # Monthly summary
```

#### Profile Endpoints
```
GET    /api/profile                    # Get user profile
PUT    /api/profile                    # Update profile
PUT    /api/profile/password           # Change password
PUT    /api/profile/preferences        # Update currency/timezone
```

#### Admin Endpoints (NEW)
```
GET    /api/admin/dashboard            # Admin analytics
GET    /api/admin/users                # List all users
GET    /api/admin/revenue              # Revenue statistics
```

#### Health Endpoint (NEW)
```
GET    /healthz                        # Health check
```

## Data Models

### Enhanced User Model


```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  ispremiumuser: Boolean (default: false),
  isAdmin: Boolean (default: false),              // NEW
  totalamount: Number (default: 0),
  preferences: {                                   // NEW
    currency: String (default: 'USD'),
    timezone: String (default: 'UTC'),
    monthlyBudget: Number (optional)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Enhanced Expense Model
```javascript
{
  _id: ObjectId,
  amount: Number (required, min: 0),
  description: String (required),                  // RENAMED from etype
  category: ObjectId (ref: 'Category'),            // NEW: reference to Category
  date: Date (required),
  receiptUrl: String (optional),                   // NEW: Firebase Storage public URL
  receiptPath: String (optional),                  // NEW: Firebase Storage path
  receiptFirestoreId: String (optional),           // NEW: Firestore document ID for metadata
  userId: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Category Model (NEW)
```javascript
{
  _id: ObjectId,
  name: String (required),
  color: String (default: '#3B82F6'),              // Hex color for UI
  icon: String (optional),                         // Icon name/emoji
  userId: ObjectId (ref: 'User', required),
  isDefault: Boolean (default: false),             // System categories
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

// Indexes
userId + name: unique compound index
```

### Order Model (Enhanced)
```javascript
{
  _id: ObjectId,
  paymentid: String,
  orderid: String (required),
  status: String (enum: ['pending', 'success', 'failed']),
  amount: Number (required),                       // NEW
  currency: String (default: 'INR'),               // NEW
  userId: ObjectId (ref: 'User', required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### ForgotPassword Model (Enhanced)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  token: String (required, unique),
  isActive: Boolean (default: true),
  expiresAt: Date (required),                      // NEW: 1 hour from creation
  createdAt: Date (auto)
}

// Indexes
token: unique index
expiresAt: TTL index (auto-delete expired tokens)
```

## Error Handling

### Error Response Format
```javascript
{
  success: false,
  error: {
    message: String,        // User-friendly message
    code: String,           // Error code (e.g., 'AUTH_FAILED')
    details: Object         // Optional additional info
  }
}
```

### Error Categories
1. **Validation Errors (400)**: Invalid input data
2. **Authentication Errors (401)**: Invalid/missing token
3. **Authorization Errors (403)**: Insufficient permissions
4. **Not Found Errors (404)**: Resource doesn't exist
5. **Conflict Errors (409)**: Duplicate resource
6. **Rate Limit Errors (429)**: Too many requests
7. **Server Errors (500)**: Internal server errors

### Global Error Handler Middleware
```javascript
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?._id
  });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational 
    ? err.message 
    : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});
```

## Testing Strategy

### Unit Tests
- **Controllers**: Test business logic with mocked dependencies
- **Services**: Test utility functions and external service wrappers
- **Models**: Test schema validation and methods
- **Middleware**: Test authentication, authorization, validation

### Integration Tests
- **API Endpoints**: Test complete request/response cycles
- **Database Operations**: Test CRUD operations with test database
- **File Uploads**: Test S3 integration with mock/test bucket
- **Payment Flow**: Test Razorpay with test mode keys

### Test Structure
```javascript
// Example: expense.controller.test.js
describe('Expense Controller', () => {
  describe('POST /api/expenses', () => {
    it('should create expense with valid data', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', validToken)
        .send({
          amount: 100,
          description: 'Test expense',
          category: categoryId,
          date: new Date()
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(100);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send({ amount: 100 });
      
      expect(response.status).toBe(401);
    });
  });
});
```

### Test Coverage Goals
- Controllers: 80%+ coverage
- Services: 90%+ coverage
- Critical paths (auth, payment): 100% coverage

## Security Implementation

### Authentication Flow


```
1. User Registration
   ├── Validate email format and password strength
   ├── Check email uniqueness
   ├── Hash password with bcrypt (10 rounds)
   ├── Create user record
   └── Send welcome email

2. User Login
   ├── Find user by email
   ├── Compare password with bcrypt
   ├── Generate JWT token (24h expiry)
   ├── Return token + user data (exclude password)
   └── Client stores token in localStorage

3. Protected Route Access
   ├── Client sends token in Authorization header
   ├── Middleware verifies JWT signature
   ├── Middleware loads user from database
   ├── Attach user to req.user
   └── Continue to route handler

4. Password Reset
   ├── User requests reset with email
   ├── Generate unique reset token (UUID)
   ├── Store token with 1-hour expiry
   ├── Send reset email with token link
   ├── User clicks link, submits new password
   ├── Verify token validity and expiry
   ├── Hash new password
   ├── Update user password
   └── Invalidate reset token
```

### Security Middleware Stack
```javascript
// app.js security configuration
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});
app.use('/api/', apiLimiter);

// Disable X-Powered-By header
app.disable('x-powered-by');

// Compression
const compression = require('compression');
app.use(compression());
```

### File Upload Security
```javascript
// middleware/fileUpload.js
const multer = require('multer');
const path = require('path');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF allowed.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter
});

module.exports = upload;
```

### Firebase Configuration
```javascript
// config/firebase.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : require('../firebase-service-account.json'); // Fallback for local dev

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

module.exports = { admin, bucket, firestore };
```

### Firebase Storage Service
```javascript
// services/firebase.service.js
const { bucket, firestore } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

/**
 * Upload file to Firebase Cloud Storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} originalName - Original filename
 * @param {String} mimetype - File MIME type
 * @param {String} userId - User ID for organizing files
 * @returns {Object} - { url, path, firestoreId }
 */
async function uploadFile(fileBuffer, originalName, mimetype, userId) {
  const fileExtension = originalName.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `receipts/${userId}/${fileName}`;
  
  const file = bucket.file(filePath);
  
  // Upload to Cloud Storage
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimetype,
      metadata: {
        originalName: originalName,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      }
    },
    public: true // Make file publicly accessible
  });
  
  // Get public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  
  // Store metadata in Firestore
  const metadataRef = await firestore.collection('file_metadata').add({
    userId: userId,
    fileName: fileName,
    originalName: originalName,
    filePath: filePath,
    publicUrl: publicUrl,
    mimetype: mimetype,
    size: fileBuffer.length,
    uploadedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return {
    url: publicUrl,
    path: filePath,
    firestoreId: metadataRef.id
  };
}

/**
 * Delete file from Firebase Cloud Storage and Firestore
 * @param {String} filePath - Firebase Storage path
 * @param {String} firestoreId - Firestore document ID
 */
async function deleteFile(filePath, firestoreId) {
  try {
    // Delete from Cloud Storage
    if (filePath) {
      await bucket.file(filePath).delete();
    }
    
    // Delete metadata from Firestore
    if (firestoreId) {
      await firestore.collection('file_metadata').doc(firestoreId).delete();
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error if file doesn't exist
    if (error.code !== 404) {
      throw error;
    }
  }
}

/**
 * Get file metadata from Firestore
 * @param {String} firestoreId - Firestore document ID
 * @returns {Object} - File metadata
 */
async function getFileMetadata(firestoreId) {
  const doc = await firestore.collection('file_metadata').doc(firestoreId).get();
  if (!doc.exists) {
    throw new Error('File metadata not found');
  }
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  uploadFile,
  deleteFile,
  getFileMetadata
};
```

### Input Validation
```javascript
// middleware/validator.js
const { body, param, query, validationResult } = require('express-validator');

const validateExpense = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be 1-200 characters'),
  body('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }
    next();
  }
];

module.exports = { validateExpense };
```

## Performance Optimization

### Backend Optimizations
1. **Database Indexing**
   - User: email (unique)
   - Expense: userId + date (compound)
   - Category: userId + name (compound, unique)
   - Order: userId + status

2. **Query Optimization**
   - Use lean() for read-only queries
   - Select only required fields
   - Implement pagination (limit/skip)
   - Use aggregation pipeline for analytics

3. **Caching Strategy**
   - Cache dashboard analytics (5 minutes)
   - Cache category list per user
   - Use ETag headers for static assets

4. **Response Compression**
   - Gzip compression for all responses
   - Minify JSON responses in production

### Frontend Optimizations
1. **Code Splitting**
   - Lazy load routes with React.lazy()
   - Lazy load chart library (Recharts)
   - Separate vendor bundle

2. **Asset Optimization**
   - Vite automatic code splitting
   - Tree shaking unused code
   - Image optimization (WebP format)
   - Font subsetting

3. **Bundle Size Targets**
   - Initial bundle: < 200KB gzipped
   - Total bundle: < 500KB gzipped
   - Lazy chunks: < 50KB each

4. **Runtime Performance**
   - Debounce search inputs (300ms)
   - Virtualize long lists (react-window)
   - Memoize expensive calculations
   - Use React.memo for pure components

## Deployment Configuration

### Environment Variables
```bash
# Required for all environments
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY=<json-string-of-service-account>
FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com

# Razorpay
RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>

# Email (SendGrid or SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=<sendgrid-api-key>
SMTP_FROM=noreply@expensetracker.com

# Optional
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
SENTRY_DSN=<sentry-dsn>
SEED=false
```

### Dockerfile
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build client if exists
RUN if [ -d "client" ]; then \
      cd client && \
      npm ci && \
      npm run build; \
    fi

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and built app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["node", "app.js"]
```

### Docker Compose (Development)
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/expense-tracker
    depends_on:
      - mongo
    volumes:
      - .:/app
      - /app/node_modules

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### GitHub Actions CI/CD
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        env:
          MONGODB_URI: ${{ secrets.TEST_MONGODB_URI }}
          JWT_SECRET: test-secret
      
      - name: Build client
        run: |
          cd client
          npm ci
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

## Firebase Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Firebase Storage and Firestore Database

### 2. Generate Service Account Key
1. Go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. For production: Store the JSON content as environment variable `FIREBASE_SERVICE_ACCOUNT_KEY`
5. For local development: Save as `firebase-service-account.json` in project root (add to .gitignore)

### 3. Configure Storage Bucket
1. Go to Firebase Storage in console
2. Set up security rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{userId}/{fileName} {
      // Allow authenticated users to read their own files
      allow read: if request.auth != null && request.auth.uid == userId;
      // Server-side uploads only (via Admin SDK)
      allow write: if false;
    }
  }
}
```

### 4. Configure Firestore
1. Go to Firestore Database in console
2. Create database in production mode
3. Set up security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /file_metadata/{document} {
      // Only allow server-side access (via Admin SDK)
      allow read, write: if false;
    }
  }
}
```

### 5. Update .env.example
Remove AWS S3 variables and add Firebase configuration:
```bash
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

## Migration Strategy

### Migrating from AWS S3 to Firebase Storage
If you have existing files in S3, you can migrate them:

1. **Download files from S3**
   ```javascript
   const AWS = require('aws-sdk');
   const s3 = new AWS.S3();
   
   async function downloadFromS3(key) {
     const params = { Bucket: 'old-bucket', Key: key };
     const data = await s3.getObject(params).promise();
     return data.Body;
   }
   ```

2. **Upload to Firebase Storage**
   ```javascript
   const { uploadFile } = require('./services/firebase.service');
   
   async function migrateFile(expense) {
     if (expense.receiptKey) {
       const fileBuffer = await downloadFromS3(expense.receiptKey);
       const result = await uploadFile(
         fileBuffer,
         expense.receiptKey.split('/').pop(),
         'image/jpeg', // Adjust based on file type
         expense.userId.toString()
       );
       
       // Update expense with new Firebase URLs
       expense.receiptUrl = result.url;
       expense.receiptPath = result.path;
       expense.receiptFirestoreId = result.firestoreId;
       await expense.save();
     }
   }
   ```

### Data Migration
Since the app is already using MongoDB, minimal migration is needed:

1. **Add new fields to existing documents**
   ```javascript
   // Migration script
   await User.updateMany(
     { preferences: { $exists: false } },
     { 
       $set: { 
         preferences: {
           currency: 'USD',
           timezone: 'UTC'
         },
         isAdmin: false
       }
     }
   );
   ```

2. **Rename expense field**
   ```javascript
   await Expense.updateMany(
     { etype: { $exists: true } },
     { $rename: { 'etype': 'description' } }
   );
   ```

3. **Create default categories**
   ```javascript
   const defaultCategories = [
     'Food & Dining',
     'Transportation',
     'Shopping',
     'Entertainment',
     'Bills & Utilities',
     'Healthcare',
     'Other'
   ];
   
   for (const user of users) {
     for (const name of defaultCategories) {
       await Category.create({
         name,
         userId: user._id,
         isDefault: true
       });
     }
   }
   ```

### Breaking Changes Approach
- This is a complete modernization - no backward compatibility required
- All existing data will be migrated to new schema
- Old field names (`etype`) will be replaced with new names (`description`)
- Clean slate approach for better maintainability

### Cleanup Strategy
After modernization is complete, the following cleanup will be performed:

1. **Remove Legacy Files**
   - Delete `archive/` directory (old Sequelize backup)
   - Delete `TODO_MONGODB_MIGRATION.md` (migration complete)
   - Delete old `views/` directory (replaced by React)
   - Delete old `public/` directory (replaced by React build)
   - Remove any AWS S3 related files (`services/S3services.js`)

2. **Remove Redundant Code**
   - Remove old controller files that are replaced by new consolidated controllers
   - Remove old route files that are replaced by new API structure
   - Clean up unused middleware files
   - Remove deprecated model files

3. **Remove Unused Dependencies**
   - Remove `aws-sdk` and `@aws-sdk/*` packages
   - Remove `body-parser` (built into Express 4.16+)
   - Remove any unused email libraries (keep only one email service)
   - Remove `nodemon` from dependencies (move to devDependencies)

4. **Consolidate Configuration**
   - Single `.env.example` with all required variables
   - Remove duplicate configuration files
   - Consolidate all config files in `config/` directory

5. **Final Project Structure**
   ```
   project-root/
   ├── client/                    # React frontend
   ├── config/                    # Server configuration
   ├── controllers/               # API controllers
   ├── middleware/                # Express middleware
   ├── models/                    # Mongoose models
   ├── routes/                    # API routes
   ├── services/                  # Business logic services
   ├── utils/                     # Utility functions
   ├── tests/                     # Test files
   ├── scripts/                   # Utility scripts (seed, etc.)
   ├── .github/workflows/         # CI/CD configuration
   ├── app.js                     # Express app
   ├── server.js                  # Server entry point
   ├── Dockerfile                 # Container configuration
   ├── .dockerignore
   ├── .gitignore
   ├── .env.example
   ├── package.json
   └── README.md
   ```

## Package Dependencies

### Backend Dependencies to Add
```json
{
  "firebase-admin": "^12.0.0",
  "helmet": "^7.1.0",
  "express-rate-limit": "^7.1.5",
  "compression": "^1.7.4",
  "cors": "^2.8.5",
  "express-validator": "^7.0.1",
  "winston": "^3.11.0",
  "jest": "^29.7.0",
  "supertest": "^6.3.3"
}
```

### Backend Dependencies to Remove
```json
{
  "aws-sdk": "remove",
  "@aws-sdk/client-s3": "remove"
}
```

### Frontend Dependencies (client/)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "axios": "^1.6.2",
  "recharts": "^2.10.3",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32",
  "vite": "^5.0.8"
}
```

This design provides a comprehensive blueprint for modernizing the expense tracker with Firebase integration while maintaining stability and enabling future scalability.
