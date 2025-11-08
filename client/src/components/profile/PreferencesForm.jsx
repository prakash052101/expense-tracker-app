import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Toast } from '../common';

/**
 * PreferencesForm Component
 * Allows users to update their preferences (currency, timezone, monthly budget)
 */
const PreferencesForm = ({ preferences, onUpdate }) => {
  const [formData, setFormData] = useState({
    currency: preferences?.currency || 'USD',
    timezone: preferences?.timezone || 'UTC',
    monthlyBudget: preferences?.monthlyBudget || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Common currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CNY', name: 'Chinese Yuan' },
  ];

  // Common timezones
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.monthlyBudget && isNaN(formData.monthlyBudget)) {
      setError('Monthly budget must be a valid number');
      return;
    }

    if (formData.monthlyBudget && parseFloat(formData.monthlyBudget) < 0) {
      setError('Monthly budget must be a positive number');
      return;
    }

    setLoading(true);

    try {
      // Convert monthlyBudget to number or null
      const preferencesData = {
        currency: formData.currency,
        timezone: formData.timezone,
        monthlyBudget: formData.monthlyBudget 
          ? parseFloat(formData.monthlyBudget) 
          : null,
      };

      await onUpdate(preferencesData);
      setSuccess('Preferences updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = 
    formData.currency !== preferences?.currency || 
    formData.timezone !== preferences?.timezone || 
    (formData.monthlyBudget ? parseFloat(formData.monthlyBudget) : null) !== preferences?.monthlyBudget;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Preferences
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="currency" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {currencies.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label 
            htmlFor="timezone" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Timezone
          </label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Monthly Budget"
          type="number"
          name="monthlyBudget"
          value={formData.monthlyBudget}
          onChange={handleChange}
          placeholder="Enter your monthly budget (optional)"
          min="0"
          step="0.01"
          disabled={loading}
        />

        <div className="text-sm text-gray-500 mt-2">
          <p>Set a monthly budget to track your spending goals. Leave empty for no budget limit.</p>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !hasChanges}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError('')}
        />
      )}

      {success && (
        <Toast
          message={success}
          type="success"
          onClose={() => setSuccess('')}
        />
      )}
    </div>
  );
};

PreferencesForm.propTypes = {
  preferences: PropTypes.shape({
    currency: PropTypes.string,
    timezone: PropTypes.string,
    monthlyBudget: PropTypes.number,
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default PreferencesForm;
