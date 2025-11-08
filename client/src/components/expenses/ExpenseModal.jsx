import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import ReceiptUpload from './ReceiptUpload';
import CategorySelect from '../categories/CategorySelect';

/**
 * ExpenseModal Component
 * Modal form for creating and editing expenses with file upload support
 */
const ExpenseModal = ({ isOpen, onClose, onSubmit, expense = null }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    receipt: null,
  });

  useEffect(() => {
    if (isOpen) {
      // Populate form if editing
      if (expense) {
        setFormData({
          amount: expense.amount || '',
          description: expense.description || '',
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: expense.category?._id || '',
          receipt: null,
        });
      } else {
        // Reset form for new expense
        setFormData({
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          category: '',
          receipt: null,
        });
      }
      
      setErrors({});
    }
  }, [isOpen, expense]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleFileSelect = (file) => {
    setFormData((prev) => ({
      ...prev,
      receipt: file,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
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
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        date: formData.date,
        category: formData.category || undefined,
        receipt: formData.receipt,
      };

      await onSubmit(expenseData);
      onClose();
    } catch (error) {
      console.error('Failed to submit expense:', error);
      setErrors({
        submit: error.message || 'Failed to save expense. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      receipt: null,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={expense ? 'Edit Expense' : 'Add Expense'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <Input
          type="number"
          name="amount"
          label="Amount"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleInputChange}
          error={errors.amount}
          required
          fullWidth
          step="0.01"
          min="0.01"
          leftIcon={
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Description */}
        <Input
          type="text"
          name="description"
          label="Description"
          placeholder="Enter expense description"
          value={formData.description}
          onChange={handleInputChange}
          error={errors.description}
          required
          fullWidth
          maxLength={200}
        />

        {/* Date */}
        <Input
          type="date"
          name="date"
          label="Date"
          value={formData.date}
          onChange={handleInputChange}
          error={errors.date}
          required
          fullWidth
        />

        {/* Category */}
        <CategorySelect
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleInputChange}
          error={errors.category}
          disabled={submitting}
        />

        {/* Receipt Upload */}
        <ReceiptUpload
          onFileSelect={handleFileSelect}
          existingReceiptUrl={expense?.receiptUrl}
          error={errors.receipt}
          disabled={submitting}
        />

        {/* Submit Error */}
        {errors.submit && (
          <div className="rounded-lg bg-danger-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-danger-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-danger-800">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
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
            {expense ? 'Update Expense' : 'Create Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

ExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  expense: PropTypes.shape({
    _id: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
    date: PropTypes.string,
    category: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      color: PropTypes.string,
      icon: PropTypes.string,
    }),
    receiptUrl: PropTypes.string,
  }),
};

export default ExpenseModal;
