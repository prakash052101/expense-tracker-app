import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = ({ onSubmit, loading = false, success = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Validate email
  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (touched) {
      setError(validateEmail(value));
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    setError(validationError);
    setTouched(true);

    if (!validationError) {
      onSubmit(email);
    }
  };

  return (
    <div className="space-y-6">
      {success ? (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Check your email
            </h3>
            <p className="text-sm text-gray-600">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              The link will expire in 1 hour.
            </p>
          </div>
          <div className="pt-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                Forgot your password?
              </h3>
              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
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
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error && touched
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                placeholder="you@example.com"
                aria-label="Email Address"
                aria-invalid={error && touched ? 'true' : 'false'}
                aria-describedby={error && touched ? 'email-error' : undefined}
              />
              {error && touched && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {error}
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
              aria-label="Send reset instructions"
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
                  Sending...
                </span>
              ) : (
                'Send Reset Instructions'
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-center text-sm">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
