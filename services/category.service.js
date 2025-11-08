const Category = require('../models/category.model');

/**
 * Default categories to create for new users
 */
const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', color: '#EF4444', icon: '🍔' },
  { name: 'Transportation', color: '#3B82F6', icon: '🚗' },
  { name: 'Shopping', color: '#8B5CF6', icon: '🛍️' },
  { name: 'Entertainment', color: '#EC4899', icon: '🎬' },
  { name: 'Bills & Utilities', color: '#F59E0B', icon: '💡' },
  { name: 'Healthcare', color: '#10B981', icon: '⚕️' },
  { name: 'Other', color: '#6B7280', icon: '📌' }
];

/**
 * Create default categories for a new user
 * @param {ObjectId} userId - The user's MongoDB ObjectId
 * @returns {Promise<Array>} Array of created categories
 */
async function createDefaultCategories(userId) {
  try {
    const categories = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      userId,
      isDefault: true
    }));

    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} default categories for user ${userId}`);
    
    return createdCategories;
  } catch (error) {
    console.error('Error creating default categories:', error);
    // Don't throw error - allow registration to succeed even if categories fail
    return [];
  }
}

module.exports = {
  createDefaultCategories,
  DEFAULT_CATEGORIES
};
