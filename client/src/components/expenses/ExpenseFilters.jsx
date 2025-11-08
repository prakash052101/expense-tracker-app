import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';
import CategorySelect from '../categories/CategorySelect';
import { getCategories } from '../../services/categoryService';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * ExpenseFilters Component
 * Provides filtering controls for date range, category selection, and search
 * Search input is debounced for better performance
 */
const ExpenseFilters = ({ onFilterChange, initialFilters = {} }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    category: initialFilters.category || '',
    search: initialFilters.search || '',
  });

  // Debounce search input to avoid excessive API calls
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Trigger filter change when debounced search value changes
  useEffect(() => {
    if (debouncedSearch !== initialFilters.search) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      category: '',
      search: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.startDate || filters.endDate || filters.category || filters.search;

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-secondary-200">
      {/* Search Input - Full Width */}
      <div className="mb-3 sm:mb-4">
        <Input
          type="text"
          name="search"
          label="Search expenses"
          placeholder="Search by description..."
          value={filters.search}
          onChange={handleInputChange}
          fullWidth
          leftIcon={
            <svg className="h-5 w-5 text-secondary-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        {filters.search && (
          <p className="mt-1 text-xs text-secondary-500">
            Searching... (debounced 300ms)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Start Date */}
        <div>
          <Input
            type="date"
            name="startDate"
            label="Start Date"
            value={filters.startDate}
            onChange={handleInputChange}
            fullWidth
          />
        </div>

        {/* End Date */}
        <div>
          <Input
            type="date"
            name="endDate"
            label="End Date"
            value={filters.endDate}
            onChange={handleInputChange}
            fullWidth
          />
        </div>

        {/* Category */}
        <CategorySelect
          name="category"
          label="Category"
          value={filters.category}
          onChange={handleInputChange}
          showUncategorized={true}
        />

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <Button
            variant="primary"
            onClick={handleApplyFilters}
            fullWidth
            className="flex-1"
          >
            <span className="hidden sm:inline">Apply Filters</span>
            <span className="sm:hidden">Apply</span>
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex-shrink-0"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-secondary-600">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Search: "{filters.search}"
            </span>
          )}
          {filters.startDate && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              From: {new Date(filters.startDate).toLocaleDateString()}
            </span>
          )}
          {filters.endDate && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              To: {new Date(filters.endDate).toLocaleDateString()}
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {categories.find((cat) => cat._id === filters.category)?.name || 'Category'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

ExpenseFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    category: PropTypes.string,
    search: PropTypes.string,
  }),
};

export default ExpenseFilters;
