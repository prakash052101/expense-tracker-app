import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/categoryService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import CategoryBadge from './CategoryBadge';

/**
 * CategoryManager Component
 * Full CRUD interface for managing expense categories
 */
const CategoryManager = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: '',
  });

  const [errors, setErrors] = useState({});

  // Predefined color palette
  const colorPalette = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
  ];

  // Common icons
  const iconOptions = [
    '🍔', '🚗', '🏠', '💼', '🎮', '🏥', '✈️', '🛒',
    '📱', '💰', '🎓', '🎬', '🏋️', '☕', '🎨', '📚',
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color || '#3B82F6',
        icon: category.icon || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        color: '#3B82F6',
        icon: '',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      color: '#3B82F6',
      icon: '',
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Category name must be 50 characters or less';
    }

    // Check for duplicate names (case-insensitive)
    const isDuplicate = categories.some(
      (cat) =>
        cat.name.toLowerCase() === formData.name.trim().toLowerCase() &&
        cat._id !== editingCategory?._id
    );

    if (isDuplicate) {
      newErrors.name = 'A category with this name already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon,
      };

      if (editingCategory) {
        await updateCategory(editingCategory._id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      await fetchCategories();
      handleCloseModal();
      
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      setErrors({
        submit: error.response?.data?.error?.message || 'Failed to save category',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setDeletingId(categoryId);

    try {
      await deleteCategory(categoryId);
      await fetchCategories();
      
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert(error.response?.data?.error?.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-secondary-900">
          Manage Categories
        </h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8 text-center">
          <p className="text-secondary-600 mb-4">No categories yet</p>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Create Your First Category
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
          <div className="divide-y divide-secondary-200">
            {categories.map((category) => (
              <div
                key={category._id}
                className="p-4 hover:bg-secondary-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: `${category.color}20`,
                    }}
                  >
                    {category.icon || '📁'}
                  </div>
                  <div>
                    <CategoryBadge category={category} size="lg" />
                    {category.isDefault && (
                      <span className="ml-2 text-xs text-secondary-500">
                        (Default)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded transition-colors"
                    aria-label="Edit category"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={deletingId === category._id}
                    className="p-2 text-danger-600 hover:text-danger-900 hover:bg-danger-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Delete category"
                  >
                    {deletingId === category._id ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <Input
            type="text"
            name="name"
            label="Category Name"
            placeholder="e.g., Food & Dining"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
            fullWidth
            maxLength={50}
          />

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color }))
                  }
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    formData.color === color
                      ? 'border-secondary-900 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <Input
              type="text"
              name="color"
              placeholder="#3B82F6"
              value={formData.color}
              onChange={handleInputChange}
              className="mt-2"
              fullWidth
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Icon (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, icon }))
                  }
                  className={`w-10 h-10 text-2xl rounded-lg border-2 transition-all ${
                    formData.icon === icon
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-primary-300'
                  }`}
                  aria-label={`Select icon ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <Input
              type="text"
              name="icon"
              placeholder="Or enter custom emoji"
              value={formData.icon}
              onChange={handleInputChange}
              fullWidth
              maxLength={2}
            />
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-secondary-200">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Preview
            </label>
            <CategoryBadge
              category={{
                name: formData.name || 'Category Name',
                color: formData.color,
                icon: formData.icon,
              }}
              size="lg"
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-lg bg-danger-50 p-4">
              <p className="text-sm text-danger-800">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

CategoryManager.propTypes = {
  onCategoryChange: PropTypes.func,
};

export default CategoryManager;
