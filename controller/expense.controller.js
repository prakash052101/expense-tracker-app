const Expense = require('../models/expense.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const { uploadFile, deleteFile } = require('../services/firebase.service');

/**
 * GET /api/expenses
 * Get all expenses for authenticated user with pagination and filtering
 */
async function getExpenses(req, res) {
  try {
    const userId = req.user._id;
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { userId };

    // Date filtering
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) {
        filter.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.date.$lte = new Date(req.query.endDate);
      }
    }

    // Category filtering
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Get total count for pagination
    const totalExpenses = await Expense.countDocuments(filter);

    // Fetch expenses with pagination
    const expenses = await Expense.find(filter)
      .populate('category', 'name color icon')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalExpenses / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        expenses,
        pagination: {
          currentPage: page,
          totalPages,
          totalExpenses,
          limit,
          hasNextPage,
          hasPreviousPage,
          nextPage: hasNextPage ? page + 1 : null,
          previousPage: hasPreviousPage ? page - 1 : null
        }
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch expenses',
        code: 'FETCH_EXPENSES_FAILED'
      }
    });
  }
}

/**
 * GET /api/expenses/:id
 * Get single expense by ID
 */
async function getExpenseById(req, res) {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id;

    const expense = await Expense.findOne({ _id: expenseId, userId })
      .populate('category', 'name color icon')
      .lean();

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expense not found',
          code: 'EXPENSE_NOT_FOUND'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch expense',
        code: 'FETCH_EXPENSE_FAILED'
      }
    });
  }
}

/**
 * POST /api/expenses
 * Create new expense with optional file upload
 */
async function createExpense(req, res) {
  try {
    const { amount, description, date, category } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!amount || !description || !date) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Amount, description, and date are required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findOne({ _id: category, userId });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid category',
            code: 'INVALID_CATEGORY'
          }
        });
      }
    }

    // Create expense object
    const expenseData = {
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      userId,
      category: category || null
    };

    // Handle file upload if present
    if (req.file) {
      try {
        const uploadResult = await uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          userId.toString()
        );

        expenseData.receiptUrl = uploadResult.url;
        expenseData.receiptPath = uploadResult.path;
        expenseData.receiptFirestoreId = uploadResult.firestoreId;
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(400).json({
          success: false,
          error: {
            message: uploadError.message || 'File upload failed',
            code: 'FILE_UPLOAD_FAILED'
          }
        });
      }
    }

    // Create expense
    const expense = new Expense(expenseData);
    await expense.save();

    // Update user's total amount
    const user = await User.findById(userId);
    user.totalamount = Number(user.totalamount || 0) + Number(amount);
    await user.save();

    // Populate category before returning
    await expense.populate('category', 'name color icon');

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create expense',
        code: 'CREATE_EXPENSE_FAILED'
      }
    });
  }
}

/**
 * PUT /api/expenses/:id
 * Update existing expense
 */
async function updateExpense(req, res) {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id;
    const { amount, description, date, category } = req.body;

    // Find existing expense
    const expense = await Expense.findOne({ _id: expenseId, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expense not found',
          code: 'EXPENSE_NOT_FOUND'
        }
      });
    }

    // Store old amount for user total calculation
    const oldAmount = expense.amount;

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findOne({ _id: category, userId });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid category',
            code: 'INVALID_CATEGORY'
          }
        });
      }
    }

    // Update fields
    if (amount !== undefined) expense.amount = parseFloat(amount);
    if (description !== undefined) expense.description = description;
    if (date !== undefined) expense.date = new Date(date);
    if (category !== undefined) expense.category = category || null;

    // Handle file upload if present
    if (req.file) {
      try {
        // Delete old file if exists
        if (expense.receiptPath && expense.receiptFirestoreId) {
          await deleteFile(expense.receiptPath, expense.receiptFirestoreId);
        }

        // Upload new file
        const uploadResult = await uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          userId.toString()
        );

        expense.receiptUrl = uploadResult.url;
        expense.receiptPath = uploadResult.path;
        expense.receiptFirestoreId = uploadResult.firestoreId;
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(400).json({
          success: false,
          error: {
            message: uploadError.message || 'File upload failed',
            code: 'FILE_UPLOAD_FAILED'
          }
        });
      }
    }

    await expense.save();

    // Update user's total amount if amount changed
    if (amount !== undefined && oldAmount !== expense.amount) {
      const user = await User.findById(userId);
      user.totalamount = Number(user.totalamount || 0) - Number(oldAmount) + Number(expense.amount);
      await user.save();
    }

    // Populate category before returning
    await expense.populate('category', 'name color icon');

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update expense',
        code: 'UPDATE_EXPENSE_FAILED'
      }
    });
  }
}

/**
 * DELETE /api/expenses/:id
 * Delete expense with Firebase file cleanup
 */
async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;
    const userId = req.user._id;

    // Find expense
    const expense = await Expense.findOne({ _id: expenseId, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Expense not found',
          code: 'EXPENSE_NOT_FOUND'
        }
      });
    }

    // Delete associated file from Firebase if exists
    if (expense.receiptPath && expense.receiptFirestoreId) {
      try {
        await deleteFile(expense.receiptPath, expense.receiptFirestoreId);
      } catch (fileError) {
        // Log error but continue with expense deletion
        console.error('Error deleting file during expense deletion:', fileError);
      }
    }

    // Update user's total amount
    const user = await User.findById(userId);
    user.totalamount = Number(user.totalamount || 0) - Number(expense.amount);
    await user.save();

    // Delete expense
    await Expense.findByIdAndDelete(expenseId);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete expense',
        code: 'DELETE_EXPENSE_FAILED'
      }
    });
  }
}

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
