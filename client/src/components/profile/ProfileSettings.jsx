import { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Toast } from '../common';

/**
 * ProfileSettings Component
 * Allows users to edit their name and email
 */
const ProfileSettings = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      await onUpdate(formData);
      setSuccess('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = 
    formData.name !== user?.name || 
    formData.email !== user?.email;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Profile Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
          disabled={loading}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          disabled={loading}
        />

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            {user?.ispremiumuser && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Premium User
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || !hasChanges}
          >
            {loading ? 'Saving...' : 'Save Changes'}
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

ProfileSettings.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    ispremiumuser: PropTypes.bool,
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default ProfileSettings;
