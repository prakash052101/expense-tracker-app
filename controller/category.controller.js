const Category = require('../models/category.model');
const Expense = require('../models/expense.model');

/**
 * GET /api/categories
 * Get all categories for authenticated user with expense counts
 */
async function getCategories(req, res) {
  try {
    const userId = req.user._id;

    // Fetch all categories for the user
    const categories = await Category.find({ userId })
      .sort({ isDefault: -1, name: 1 })
      .lean();

    // Get expense counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const expenseCount = await Expense.countDocuments({
          userId,
          category: category._id
        });
        return {
          ...category,
          expenseCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch categories',
        code: 'FETCH_CATEGORIES_FAILED'
      }
    });
  }
}

/**
 * POST /api/categories
 * Create new category with uniqueness validation
 */
async function createCategory(req, res) {
  try {
    const { name, color, icon } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Category name is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Trim and validate name length
    const trimmedName = name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Category name must be between 1 and 50 characters',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Check for duplicate category name for this user
    const existingCategory = await Category.findOne({
      userId,
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Category with this name already exists',
          code: 'CATEGORY_EXISTS'
        }
      });
    }

    // Create category object
    const categoryData = {
      name: trimmedName,
      userId,
      isDefault: false
    };

    // Add optional fields
    if (color) {
      // Validate hex color format
      if (!/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid color format. Use hex format (e.g., #3B82F6)',
            code: 'VALIDATION_ERROR'
          }
        });
      }
      categoryData.color = color;
    }

    if (icon) {
      categoryData.icon = icon;
    }

    // Create category
    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle duplicate key error from MongoDB unique index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Category with this name already exists',
          code: 'CATEGORY_EXISTS'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create category',
        code: 'CREATE_CATEGORY_FAILED'
      }
    });
  }
}

/**
 * PUT /api/categories/:id
 * Update existing category
 */
async function updateCategory(req, res) {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;
    const { name, color, icon } = req.body;

    // Find existing category
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        }
      });
    }

    // Update name if provided
    if (name !== undefined) {
      const trimmedName = name.trim();
      
      if (trimmedName.length === 0 || trimmedName.length > 50) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Category name must be between 1 and 50 characters',
            code: 'VALIDATION_ERROR'
          }
        });
      }

      // Check for duplicate category name (excluding current category)
      const existingCategory = await Category.findOne({
        userId,
        _id: { $ne: categoryId },
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Category with this name already exists',
            code: 'CATEGORY_EXISTS'
          }
        });
      }

      category.name = trimmedName;
    }

    // Update color if provided
    if (color !== undefined) {
      // Validate hex color format
      if (!/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid color format. Use hex format (e.g., #3B82F6)',
            code: 'VALIDATION_ERROR'
          }
        });
      }
      category.color = color;
    }

    // Update icon if provided
    if (icon !== undefined) {
      category.icon = icon;
    }

    await category.save();

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle duplicate key error from MongoDB unique index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Category with this name already exists',
          code: 'CATEGORY_EXISTS'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update category',
        code: 'UPDATE_CATEGORY_FAILED'
      }
    });
  }
}

/**
 * DELETE /api/categories/:id
 * Delete category with expense handling
 */
async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.id;
    const userId = req.user._id;

    // Find category
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Category not found',
          code: 'CATEGORY_NOT_FOUND'
        }
      });
    }

    // Check if category has associated expenses
    const expenseCount = await Expense.countDocuments({
      userId,
      category: categoryId
    });

    if (expenseCount > 0) {
      // Set category to null for all expenses using this category
      await Expense.updateMany(
        { userId, category: categoryId },
        { $set: { category: null } }
      );
    }

    // Delete category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {
        expensesUpdated: expenseCount
      }
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete category',
        code: 'DELETE_CATEGORY_FAILED'
      }
    });
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
