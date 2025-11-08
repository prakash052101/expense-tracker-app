import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * ReceiptUpload Component
 * Handles file upload with validation and preview
 */
const ReceiptUpload = ({ 
  onFileSelect, 
  existingReceiptUrl = null,
  error = null,
  disabled = false 
}) => {
  const [preview, setPreview] = useState(existingReceiptUrl);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState(error);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and PDF files are allowed.';
    }

    // Check file size
    if (file.size > MAX_SIZE) {
      return 'File size exceeds 5MB limit.';
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      setPreview(null);
      setFileName('');
      onFileSelect(null);
      return;
    }

    // Clear any previous errors
    setFileError(null);
    setFileName(file.name);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, just show the file name
      setPreview(null);
    }

    // Pass file to parent
    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-secondary-700">
        Receipt (Optional)
      </label>

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        aria-label="Upload receipt"
      />

      {/* Upload Area */}
      {!preview && !fileName ? (
        <div
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            disabled
              ? 'border-secondary-200 bg-secondary-50 cursor-not-allowed'
              : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50'
          }`}
        >
          <svg
            className="mx-auto h-12 w-12 text-secondary-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-2">
            <p className="text-sm text-secondary-600">
              <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-secondary-500 mt-1">
              PNG, JPG, PDF up to 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-secondary-300 rounded-lg p-4">
          {/* Image Preview */}
          {preview && (
            <div className="mb-3">
              <img
                src={preview}
                alt="Receipt preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
            </div>
          )}

          {/* File Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <svg
                className="h-5 w-5 text-secondary-400 flex-shrink-0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm text-secondary-900 truncate">
                {fileName || 'Existing receipt'}
              </span>
            </div>
            <div className="flex items-center space-x-2 ml-2">
              {existingReceiptUrl && !fileName && (
                <a
                  href={existingReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-900 text-sm"
                >
                  View
                </a>
              )}
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="text-danger-600 hover:text-danger-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(fileError || error) && (
        <p className="text-sm text-danger-600" role="alert">
          {fileError || error}
        </p>
      )}

      {/* Help Text */}
      {!fileError && !error && (
        <p className="text-xs text-secondary-500">
          Supported formats: JPEG, PNG, PDF. Maximum size: 5MB
        </p>
      )}
    </div>
  );
};

ReceiptUpload.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  existingReceiptUrl: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ReceiptUpload;
