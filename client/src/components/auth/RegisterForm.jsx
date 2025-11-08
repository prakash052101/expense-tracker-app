import { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
  });

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) {
      return { score: 0, label: '', color: '' };
    }

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special chars

    // Determine label and color
    let label = '';
    let color = '';
    
    if (score <= 2) {
      label = 'Weak';
      color = 'bg-red-500';
    } else if (score <= 4) {
      label = 'Medium';
      color = 'bg-yellow-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    return { score, label, color };
  };

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[a-z]/.test(value)) return 'Password must contain a lowercase letter';
        if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain a number';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update password strength for password field
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // Also revalidate confirmPassword if password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = formData.confirmPassword !== value 
        ? 'Passwords do not match' 
        : '';
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      const { confirmPassword, ...submitData } = formData;
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.name && touched.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder="John Doe"
          aria-label="Full Name"
          aria-invalid={errors.name && touched.name ? 'true' : 'false'}
          aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
        />
        {errors.name && touched.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.email && touched.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder="you@example.com"
          aria-label="Email Address"
          aria-invalid={errors.email && touched.email ? 'true' : 'false'}
          aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
        />
        {errors.email && touched.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.password && touched.password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder="Create a strong password"
          aria-label="Password"
          aria-invalid={errors.password && touched.password ? 'true' : 'false'}
          aria-describedby={
            errors.password && touched.password 
              ? 'password-error' 
              : passwordStrength.label 
              ? 'password-strength' 
              : undefined
          }
        />
        {errors.password && touched.password && (
          <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.password}
          </p>
        )}
        
        {/* Password Strength Indicator */}
        {formData.password && !errors.password && (
          <div id="password-strength" className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Password strength:</span>
              <span className={`text-xs font-medium ${
                passwordStrength.label === 'Weak' ? 'text-red-600' :
                passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                role="progressbar"
                aria-valuenow={passwordStrength.score}
                aria-valuemin="0"
                aria-valuemax="6"
                aria-label={`Password strength: ${passwordStrength.label}`}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.confirmPassword && touched.confirmPassword
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder="Re-enter your password"
          aria-label="Confirm Password"
          aria-invalid={errors.confirmPassword && touched.confirmPassword ? 'true' : 'false'}
          aria-describedby={errors.confirmPassword && touched.confirmPassword ? 'confirm-password-error' : undefined}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <p id="confirm-password-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-label="Create your account"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Login Link */}
      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
