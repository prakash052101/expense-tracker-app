import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCategories } from '../../services/categoryService';

/**
 * CategorySelect Component
 * Dropdown selector for categories with loading state
 */
const CategorySelect = ({
  value,
  onChange,
  name = 'category',
  label = 'Category',
  required = false,
  disabled = false,
  error = null,
  showUncategorized = true,
  className = '',
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setFetchError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-secondary-700 mb-1.5"
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled || loading}
        required={required}
        className={`block w-full rounded-lg border ${
          error
            ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
            : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
        } text-secondary-900 placeholder-secondary-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-secondary-50 disabled:cursor-not-allowed px-4 py-2.5`}
      >
        {showUncategorized && (
          <option value="">
            {required ? 'Select a category' : 'Select a category (optional)'}
          </option>
        )}
        
        {loading && <option value="">Loading categories...</option>}
        
        {!loading && fetchError && <option value="">Error loading categories</option>}
        
        {!loading && !fetchError && categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.icon && `${category.icon} `}
            {category.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-sm text-danger-600">{error}</p>
      )}
      
      {loading && !error && (
        <p className="mt-1.5 text-sm text-secondary-500">Loading categories...</p>
      )}
      
      {fetchError && !loading && (
        <button
          type="button"
          onClick={fetchCategories}
          className="mt-1.5 text-sm text-primary-600 hover:text-primary-700"
        >
          Retry loading categories
        </button>
      )}
    </div>
  );
};

CategorySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  showUncategorized: PropTypes.bool,
  className: PropTypes.string,
};

export default CategorySelect;
