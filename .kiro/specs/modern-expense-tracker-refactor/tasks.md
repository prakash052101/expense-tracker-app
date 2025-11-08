# Implementation Plan

- [x] 1. Setup project infrastructure and dependencies





  - Install new backend dependencies (firebase-admin, helmet, express-rate-limit, compression, cors, express-validator, winston, jest, supertest)
  - Remove AWS SDK dependencies (aws-sdk, @aws-sdk/client-s3)
  - Create client/ directory with Vite + React + Tailwind setup
  - Install frontend dependencies (react, react-router-dom, axios, recharts, tailwindcss)
  - Configure Tailwind CSS with custom theme (colors, spacing, typography)
  - Setup Vite build configuration for production optimization
  - _Requirements: 7.1, 7.5, 13.3_

- [x] 2. Configure Firebase integration






  - [x] 2.1 Create Firebase configuration file

    - Create config/firebase.js with Admin SDK initialization
    - Support both environment variable and local JSON file for service account
    - Initialize Firebase Storage bucket and Firestore connections
    - _Requirements: 2.2_
  

  - [x] 2.2 Implement Firebase Storage service

    - Create services/firebase.service.js with uploadFile function
    - Implement deleteFile function for cleanup
    - Implement getFileMetadata function for Firestore queries
    - Add file validation (type, size) before upload
    - Generate unique filenames with UUID
    - Store metadata in Firestore collection
    - _Requirements: 2.2, 8.3_

- [x] 3. Update environment configuration





  - Update .env.example with Firebase variables (FIREBASE_SERVICE_ACCOUNT_KEY, FIREBASE_STORAGE_BUCKET)
  - Remove AWS S3 variables from .env.example
  - Add all required variables (MongoDB, JWT, Razorpay, SMTP, CORS origins)
  - Add firebase-service-account.json to .gitignore
  - _Requirements: 11.2_

- [x] 4. Implement security middleware




  - [x] 4.1 Setup Helmet for security headers


    - Configure Helmet with CSP, HSTS, X-Frame-Options
    - Disable X-Powered-By header
    - _Requirements: 8.1, 8.5_
  
  - [x] 4.2 Implement rate limiting


    - Create middleware/rateLimiter.js with auth route limiter (5 requests/15min)
    - Create general API limiter (100 requests/15min)
    - Apply limiters to appropriate routes
    - _Requirements: 8.2_
  
  - [x] 4.3 Configure CORS


    - Setup CORS middleware with environment-configurable whitelist
    - Enable credentials support
    - _Requirements: 8.4_
  
  - [x] 4.4 Setup compression middleware


    - Add compression for all responses
    - _Requirements: 13.1_

- [x] 5. Enhance data models






  - [x] 5.1 Update User model

    - Add isAdmin field (Boolean, default: false)
    - Add preferences object (currency, timezone, monthlyBudget)
    - Keep existing fields (name, email, password, ispremiumuser, totalamount)
    - _Requirements: 1.5, 10.1_
  

  - [x] 5.2 Update Expense model

    - Rename etype field to description
    - Add category field (ObjectId ref to Category)
    - Add receiptUrl, receiptPath, receiptFirestoreId fields for Firebase
    - Add compound index on userId + date
    - _Requirements: 2.1, 2.2, 2.3_
  

  - [x] 5.3 Create Category model

    - Create models/category.model.js with name, color, icon, userId, isDefault fields
    - Add unique compound index on userId + name
    - _Requirements: 3.1, 3.2_
  

  - [x] 5.4 Update Order model

    - Add amount and currency fields
    - Update status to enum (pending, success, failed)
    - _Requirements: 6.2_

- [x] 6. Implement authentication system





  - [x] 6.1 Create auth controller


    - Implement register endpoint with bcrypt password hashing (10 rounds)
    - Implement login endpoint with JWT token generation (24h expiry)
    - Implement forgot-password endpoint with unique token generation
    - Implement reset-password endpoint with token validation
    - Implement verify endpoint for JWT validation
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 6.2 Update auth middleware


    - Update middleware/auth.js to use JWT_SECRET from environment
    - Add proper error handling for invalid/expired tokens
    - Load user from database and attach to req.user
    - _Requirements: 1.2_
  
  - [x] 6.3 Create admin auth middleware


    - Create middleware/adminAuth.js to check isAdmin flag
    - Return 403 for non-admin users
    - _Requirements: 10.1_
  
  - [x] 6.4 Create auth routes


    - Create routes/auth.routes.js with all auth endpoints
    - Apply rate limiting to login and register routes
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 7. Implement expense management





  - [x] 7.1 Create expense controller


    - Implement GET /api/expenses with pagination, filtering by date/category
    - Implement GET /api/expenses/:id for single expense
    - Implement POST /api/expenses with file upload support
    - Implement PUT /api/expenses/:id for updates
    - Implement DELETE /api/expenses/:id with Firebase file cleanup
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 7.2 Integrate Firebase file upload


    - Use multer for multipart form handling
    - Call firebase.service.uploadFile for receipt uploads
    - Store Firebase URLs and metadata in expense document
    - Handle file deletion when expense is deleted
    - _Requirements: 2.2, 2.5_
  
  - [x] 7.3 Create expense routes


    - Create routes/expense.routes.js with all CRUD endpoints
    - Apply authentication middleware to all routes
    - Add input validation middleware
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 8. Implement category management





  - [x] 8.1 Create category controller


    - Implement GET /api/categories with expense counts
    - Implement POST /api/categories with uniqueness validation
    - Implement PUT /api/categories/:id for updates
    - Implement DELETE /api/categories/:id with expense handling
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 8.2 Create category routes


    - Create routes/category.routes.js with all CRUD endpoints
    - Apply authentication middleware
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 8.3 Create default categories seeder


    - Add function to create default categories for new users
    - Call during user registration
    - _Requirements: 3.1_

- [x] 9. Implement dashboard and analytics








  - [x] 9.1 Create analytics service



    - Create services/analytics.service.js with aggregation functions
    - Implement monthly totals calculation
    - Implement category distribution calculation
    - Implement budget tracking calculation
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  

  - [x] 9.2 Create report controller


    - Implement GET /api/reports/dashboard with KPI data
    - Implement GET /api/reports/monthly for monthly summaries
    - Return data for current month, previous month, year-to-date
    - Include recent 7 expenses
    - Include category breakdown
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  
  - [x] 9.3 Create report routes


    - Create routes/report.routes.js with analytics endpoints
    - Apply authentication middleware
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 10. Implement CSV export functionality




  - [x] 10.1 Create CSV service


    - Create services/csv.service.js with CSV generation function
    - Support filtering by date range and categories
    - Include columns: date, description, amount, category, receiptUrl
    - Generate filename with current date
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 10.2 Add export endpoint


    - Implement GET /api/reports/export with query parameters
    - Set appropriate headers for CSV download
    - Apply filters from query parameters
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 11. Implement premium features





  - [x] 11.1 Create payment service


    - Create services/payment.service.js with Razorpay integration
    - Implement order creation function
    - Implement payment verification function
    - _Requirements: 6.1, 6.2_
  
  - [x] 11.2 Create premium controller


    - Implement POST /api/premium/purchase to create Razorpay order
    - Implement POST /api/premium/verify to verify payment and update user
    - Implement GET /api/premium/leaderboard (premium users only)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 11.3 Create premium routes


    - Create routes/premium.routes.js with payment endpoints
    - Apply authentication middleware
    - Apply premium check middleware for leaderboard
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 12. Implement profile management





  - [x] 12.1 Create profile controller


    - Implement GET /api/profile to return user data (exclude password)
    - Implement PUT /api/profile to update name, email
    - Implement PUT /api/profile/password to change password
    - Implement PUT /api/profile/preferences to update currency, timezone, budget
    - _Requirements: 1.5_
  
  - [x] 12.2 Create profile routes


    - Create routes/profile.routes.js with profile endpoints
    - Apply authentication middleware
    - Add input validation
    - _Requirements: 1.5_

- [x] 13. Implement admin dashboard





  - [x] 13.1 Create admin controller


    - Implement GET /api/admin/dashboard with user counts, premium counts, revenue
    - Implement GET /api/admin/users with user list
    - Implement GET /api/admin/revenue with revenue statistics
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 13.2 Create admin routes


    - Create routes/admin.routes.js with admin endpoints
    - Apply authentication and admin middleware
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 14. Add health check and logging





  - [x] 14.1 Create health controller


    - Implement GET /healthz endpoint returning {status: "ok"}
    - Add database connection check
    - Return within 500ms
    - _Requirements: 9.1_
  
  - [x] 14.2 Setup Winston logger


    - Create utils/logger.js with Winston configuration
    - Configure log levels (info, error)
    - Add file and console transports
    - _Requirements: 9.2, 9.3, 9.4, 9.5_
  
  - [x] 14.3 Add logging to key events


    - Log user registration events
    - Log payment completion events
    - Log errors with stack traces
    - Log server startup
    - _Requirements: 9.2, 9.3, 9.4, 9.5_
  
  - [x] 14.4 Create health routes


    - Create routes/health.routes.js with health endpoint
    - No authentication required
    - _Requirements: 9.1_

- [x] 15. Update main application file





  - [x] 15.1 Refactor app.js


    - Apply security middleware stack (helmet, cors, rate limiting, compression)
    - Mount all new API routes under /api prefix
    - Add global error handler middleware
    - Serve React build in production mode
    - Add SPA fallback (serve index.html for client routes)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 13.1_
  
  - [x] 15.2 Create server.js entry point


    - Move server startup logic from app.js to server.js    
    - Import and start Express app
    - Handle graceful shutdown
    - _Requirements: 9.5_

- [x] 16. Setup React frontend project structure






  - [x] 16.1 Initialize client directory with Vite

    - Create client/ directory with Vite + React template
    - Install core dependencies (react, react-dom, react-router-dom, axios)
    - Configure Vite for proxy to backend API during development
    - Setup build output to client/dist directory
    - _Requirements: 7.1, 7.2, 12.3_
  

  - [x] 16.2 Configure Tailwind CSS

    - Install Tailwind CSS, PostCSS, and Autoprefixer
    - Create tailwind.config.js with custom theme (colors, spacing, typography)
    - Create postcss.config.js
    - Setup index.css with Tailwind directives
    - _Requirements: 7.5_

  
  - [x] 16.3 Setup project structure

    - Create directory structure (components/, pages/, contexts/, hooks/, services/, utils/)
    - Create subdirectories for component organization (layout/, dashboard/, expenses/, auth/, etc.)
    - _Requirements: 7.1_



- [x] 17. Implement core React infrastructure


  - [x] 17.1 Create API service layer


    - Create services/api.js with Axios instance and interceptors
    - Configure base URL and authentication header injection
    - Add response/error interceptors for token refresh and error handling
    - _Requirements: 7.2_
  
  - [x] 17.2 Create AuthContext and provider


    - Create contexts/AuthContext.jsx with user state management
    - Implement login, logout, register functions
    - Add token storage in localStorage
    - Provide user data and auth status to app
    - _Requirements: 1.1, 1.2, 7.2_
  
  - [x] 17.3 Create ExpenseContext and provider


    - Create contexts/ExpenseContext.jsx for expense data caching
    - Implement CRUD operations for expenses
    - Add loading and error states
    - _Requirements: 2.1, 2.3_
  
  - [x] 17.4 Setup React Router


    - Create App.jsx with router configuration
    - Define routes for Dashboard, Expenses, Reports, Profile, Premium, Admin, Auth pages
    - Implement ProtectedRoute component for authenticated routes
    - Implement AdminRoute component for admin-only routes
    - Add 404 NotFound page
    - _Requirements: 7.2_



- [x] 18. Implement authentication UI components


  - [x] 18.1 Create auth service and forms


    - Create services/authService.js with API calls (login, register, forgot-password, reset-password)
    - Create components/auth/LoginForm.jsx with form validation
    - Create components/auth/RegisterForm.jsx with password strength validation
    - Create components/auth/ForgotPassword.jsx
    - Create components/auth/ResetPassword.jsx
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.4_
  
  - [x] 18.2 Create auth pages


    - Create pages/Login.jsx
    - Create pages/Register.jsx
    - Create pages/ForgotPassword.jsx
    - Create pages/ResetPassword.jsx
    - Add navigation links between auth pages
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 19. Implement common UI components





  - [x] 19.1 Create reusable components


    - Create components/common/Button.jsx with variants (primary, secondary, danger)
    - Create components/common/Input.jsx with validation states
    - Create components/common/Modal.jsx with backdrop and close handlers
    - Create components/common/Spinner.jsx for loading states
    - Create components/common/Toast.jsx for notifications
    - Create components/common/ErrorBoundary.jsx for error handling
    - _Requirements: 7.4, 7.5_
  
  - [x] 19.2 Create layout components


    - Create components/layout/Header.jsx with navigation and user menu
    - Create components/layout/Sidebar.jsx for desktop navigation
    - Create components/layout/MobileNav.jsx with hamburger menu
    - Create components/layout/Footer.jsx
    - _Requirements: 7.1, 7.5_

- [x] 20. Implement dashboard UI




  - [x] 20.1 Create dashboard service and components


    - Create services/expenseService.js with expense API calls
    - Create services/reportService.js with dashboard and analytics API calls
    - Create components/dashboard/KPICard.jsx for metric display
    - Create components/dashboard/BudgetWidget.jsx with progress bar
    - Create components/dashboard/RecentExpenses.jsx with expense list
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [x] 20.2 Create chart components


    - Install recharts library
    - Create components/dashboard/ExpenseChart.jsx with pie chart for category distribution
    - Implement lazy loading for chart component
    - Add responsive sizing for mobile/desktop
    - _Requirements: 4.2, 13.2_
  
  - [x] 20.3 Create Dashboard page


    - Create pages/Dashboard.jsx with KPI cards layout
    - Add ExpenseChart component
    - Add BudgetWidget component
    - Add RecentExpenses component
    - Add filter controls for date range and category
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 20.4 Implement quick-add FAB


    - Create components/dashboard/QuickAddFAB.jsx floating action button
    - Position FAB in bottom-right corner (mobile-friendly)
    - Open ExpenseModal on click
    - _Requirements: 7.3_

- [x] 21. Implement expense management UI





  - [x] 21.1 Create expense components


    - Create components/expenses/ExpenseList.jsx with pagination
    - Create components/expenses/ExpenseItem.jsx for single expense row
    - Create components/expenses/ExpenseFilters.jsx for date/category filtering
    - Create components/expenses/ReceiptUpload.jsx with file validation
    - _Requirements: 2.3, 2.4, 13.5_
  
  - [x] 21.2 Create expense modal


    - Create components/expenses/ExpenseModal.jsx for add/edit
    - Add form with amount, description, date, category, receipt fields
    - Implement file upload with preview
    - Add form validation
    - Handle create and update operations
    - _Requirements: 2.1, 2.2, 2.4, 7.4_
  
  - [x] 21.3 Create Expenses page


    - Create pages/Expenses.jsx with ExpenseList
    - Add ExpenseFilters component
    - Add "Add Expense" button to open modal
    - Implement edit and delete actions
    - _Requirements: 2.1, 2.3, 2.4, 2.5_

- [x] 22. Implement category management UI





  - [x] 22.1 Create category service and components


    - Create services/categoryService.js with category API calls
    - Create components/categories/CategoryBadge.jsx for display
    - Create components/categories/CategorySelect.jsx dropdown
    - Create components/categories/CategoryManager.jsx for CRUD interface
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 22.2 Integrate categories into expense forms


    - Add CategorySelect to ExpenseModal
    - Display CategoryBadge in ExpenseItem and RecentExpenses
    - Add category filter to ExpenseFilters
    - _Requirements: 3.2, 4.5_

- [x] 23. Implement reports and export UI





  - [x] 23.1 Create export service and components


    - Create services/exportService.js with CSV download function
    - Create utility function to trigger file download
    - Add "Download as CSV" button to Dashboard
    - Add "Download as CSV" button to Expenses page
    - Apply current filters to export
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 23.2 Create Reports page


    - Create pages/Reports.jsx with monthly summaries
    - Display monthly totals and category breakdowns
    - Add date range selector
    - Add export button with filter options
    - _Requirements: 4.5, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 24. Implement profile and settings UI




  - [x] 24.1 Create profile service and components


    - Create services/profileService.js with profile API calls
    - Create components/profile/ProfileSettings.jsx for user info editing
    - Create components/profile/PreferencesForm.jsx for currency/timezone/budget
    - Create components/profile/PasswordChange.jsx for password update
    - _Requirements: 1.5_
  
  - [x] 24.2 Create Profile page


    - Create pages/Profile.jsx with tabbed interface
    - Add ProfileSettings tab
    - Add PreferencesForm tab
    - Add PasswordChange tab
    - Implement form validation and submission
    - _Requirements: 1.5_

- [x] 25. Implement premium features UI





  - [x] 25.1 Create premium service and components


    - Create services/premiumService.js with payment API calls
    - Create components/premium/PremiumBanner.jsx upgrade CTA
    - Create components/premium/PaymentModal.jsx with Razorpay integration
    - Create components/premium/Leaderboard.jsx for top spenders
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [x] 25.2 Create Premium page


    - Create pages/Premium.jsx with feature comparison
    - Add PaymentModal integration
    - Show Leaderboard for premium users
    - Display premium status badge in Header
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [x] 25.3 Integrate Razorpay SDK


    - Add Razorpay script to index.html
    - Implement payment flow in PaymentModal
    - Handle payment success and failure callbacks
    - Update user premium status after successful payment
    - _Requirements: 6.1, 6.2_

- [x] 26. Implement admin dashboard UI





  - [x] 26.1 Create admin service and components


    - Create services/adminService.js with admin API calls
    - Create components/admin/AdminDashboard.jsx with system metrics
    - Create components/admin/UserStats.jsx with user counts
    - Create components/admin/RevenueChart.jsx with revenue visualization
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 26.2 Create Admin page


    - Create pages/Admin.jsx with AdminDashboard
    - Display total users, premium users, revenue
    - Add user growth chart
    - Add recent premium purchases list
    - Protect route with AdminRoute component
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 27. Implement utility functions and hooks





  - [x] 27.1 Create utility functions


    - Create utils/formatters.js for date and currency formatting
    - Create utils/validators.js for form validation
    - Create utils/constants.js for app constants
    - _Requirements: 7.5_
  
  - [x] 27.2 Create custom hooks


    - Create hooks/useAuth.js for auth operations
    - Create hooks/useExpenses.js for expense CRUD
    - Create hooks/useCategories.js for category management
    - Create hooks/useDebounce.js for input debouncing
    - _Requirements: 7.2_

- [x] 28. Add responsive design and accessibility




  - [x] 28.1 Implement responsive layouts


    - Add mobile-first breakpoints to all components
    - Test layouts on 320px, 768px, 1024px, 1920px viewports
    - Optimize navigation for mobile (hamburger menu)
    - Ensure tables are scrollable on mobile
    - _Requirements: 7.1_
  
  - [x] 28.2 Add accessibility features


    - Add ARIA labels to all interactive elements
    - Implement keyboard navigation for modals and forms
    - Add focus states to all interactive elements
    - Ensure color contrast meets WCAG AA standards
    - Add descriptive error messages for form validation
    - _Requirements: 7.4_



- [x] 29. Optimize frontend performance


  - [x] 29.1 Implement code splitting


    - Lazy load route components with React.lazy()
    - Lazy load Recharts library
    - Add Suspense boundaries with loading spinners
    - _Requirements: 13.2_
  
  - [x] 29.2 Optimize assets and bundle


    - Configure Vite for production optimization
    - Enable minification and tree shaking
    - Add cache headers configuration
    - Optimize images (use WebP where possible)
    - _Requirements: 13.3, 13.4_
  
  - [x] 29.3 Add runtime optimizations


    - Memoize expensive calculations with useMemo
    - Use React.memo for pure components
    - Debounce search inputs (300ms)
    - Implement pagination for large lists
    - _Requirements: 13.5_

- [ ] 30. Setup testing infrastructure
  - [ ] 30.1 Configure Jest for backend
    - Install jest, supertest as dev dependencies
    - Create jest.config.js with test environment configuration
    - Create tests/setup.js for test database connection
    - Add test scripts to package.json (test, test:watch, test:coverage)
    - _Requirements: 12.1, 12.2_
  
  - [ ] 30.2 Create database connection test
    - Create scripts/test-db.js to test MongoDB connection
    - Add test:db script to package.json
    - Exit with code 0 on success, code 1 on failure
    - _Requirements: 12.1_
  
  - [ ]* 30.3 Write backend unit tests
    - Create tests/unit/auth.test.js for auth controller
    - Create tests/unit/expense.test.js for expense controller
    - Test expense creation returns 201 with correct data
    - Test authentication failures return 401
    - _Requirements: 12.2_
  
  - [ ]* 30.4 Write backend integration tests
    - Create tests/integration/api.test.js for API endpoints
    - Test complete request/response cycles
    - Test authentication flow
    - Test expense CRUD operations
    - _Requirements: 12.2_

- [ ] 31. Setup CI/CD pipeline
  - [ ] 31.1 Create GitHub Actions workflow
    - Create .github/workflows/ci.yml
    - Add job to run npm ci and npm test on push/PR
    - Add job to build client application
    - Configure to run on main and develop branches
    - _Requirements: 12.3_
  
  - [ ] 31.2 Configure test environment
    - Add test MongoDB URI to GitHub secrets
    - Configure environment variables for CI
    - Ensure tests run in isolated environment
    - _Requirements: 12.3, 12.4_
  
  - [ ] 31.3 Add deployment trigger
    - Add deploy job that runs after tests pass
    - Configure Render deploy hook in GitHub secrets
    - Only deploy on main branch
    - _Requirements: 12.3_

- [ ] 32. Create Docker configuration
  - [ ] 32.1 Create Dockerfile
    - Create multi-stage Dockerfile with node:20-alpine
    - Add builder stage for dependencies and client build
    - Add production stage with minimal image
    - Create non-root user for security
    - Expose port 3000
    - _Requirements: 11.1_
  
  - [ ] 32.2 Create Docker support files
    - Create .dockerignore with node_modules, .git, .env
    - Create docker-compose.yml for local development
    - Add MongoDB service to docker-compose
    - Configure volume mounts for development
    - _Requirements: 11.1_
  
  - [ ] 32.3 Test Docker build
    - Build Docker image locally
    - Run container and verify application starts
    - Test API endpoints in containerized environment
    - _Requirements: 11.1_

- [ ] 33. Create deployment configuration
  - [ ] 33.1 Create Render configuration
    - Create Procfile with start command
    - Document both deployment options (combined and separate)
    - List all required environment variables
    - _Requirements: 11.2, 11.3, 11.5_
  
  - [ ] 33.2 Create deployment documentation
    - Create render_deploy.md with step-by-step instructions
    - Document environment variable setup
    - Document MongoDB Atlas connection
    - Document Firebase configuration
    - Document Razorpay setup
    - Add troubleshooting section
    - _Requirements: 11.5_
  
  - [ ] 33.3 Update .env.example
    - Add all required environment variables with descriptions
    - Include Firebase variables (remove AWS S3 variables)
    - Include Razorpay variables
    - Include SMTP/email variables
    - Include optional variables (SENTRY_DSN, SEED)
    - _Requirements: 11.2_

- [ ] 34. Create seed data script
  - [ ] 34.1 Implement seed script
    - Create scripts/seed.js with sample data generation
    - Create demo user with known credentials
    - Create 10 sample expenses with varied categories
    - Create default categories for demo user
    - Guard execution behind SEED=true environment variable
    - _Requirements: 11.4_
  
  - [ ] 34.2 Add seed script to package.json
    - Add seed script command
    - Document usage in README
    - _Requirements: 11.4_

- [ ] 35. Update documentation
  - [ ] 35.1 Update README.md
    - Add project description and features list
    - Add technology stack section
    - Add installation instructions
    - Add environment setup instructions
    - Add development and production run commands
    - Add Docker instructions
    - Add deployment instructions
    - Add API documentation or link to Postman collection
    - _Requirements: 11.5_
  
  - [ ] 35.2 Create additional documentation
    - Create CONTRIBUTING.md with development guidelines
    - Create API.md with endpoint documentation
    - Update .env.example with comprehensive comments
    - _Requirements: 11.5_

- [ ] 36. Cleanup legacy code and files
  - [ ] 36.1 Remove legacy files
    - Delete archive/ directory (old Sequelize backup)
    - Delete TODO_MONGODB_MIGRATION.md
    - Delete old views/ directory (replaced by React)
    - Delete old public/ directory (replaced by React build)
    - Delete services/S3services.js (replaced by Firebase)
    - _Requirements: 11.3_
  
  - [ ] 36.2 Remove unused dependencies
    - Remove aws-sdk and @aws-sdk/* packages
    - Remove body-parser (built into Express 4.16+)
    - Move nodemon to devDependencies
    - Remove any other unused packages
    - _Requirements: 11.3_
  
  - [ ] 36.3 Consolidate project structure
    - Ensure all config files are in config/ directory
    - Ensure all routes are in routes/ directory
    - Ensure all controllers are in controllers/ directory
    - Remove duplicate or redundant files
    - _Requirements: 11.3_

- [ ] 37. Final integration and testing
  - [ ] 37.1 Integration testing
    - Test complete user registration and login flow
    - Test expense creation with receipt upload
    - Test category management
    - Test dashboard data display
    - Test CSV export functionality
    - Test premium purchase flow (test mode)
    - Test admin dashboard access
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 10.1_
  
  - [ ] 37.2 Cross-browser testing
    - Test on Chrome, Firefox, Safari, Edge
    - Test responsive layouts on mobile devices
    - Verify all features work across browsers
    - _Requirements: 7.1_
  
  - [ ] 37.3 Performance testing
    - Verify bundle sizes meet targets (<200KB initial, <500KB total)
    - Test page load times
    - Test API response times
    - Verify compression is working
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ] 37.4 Security testing
    - Verify Helmet headers are set correctly
    - Test rate limiting on auth routes
    - Verify CORS configuration
    - Test file upload validation
    - Verify JWT token expiration
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_