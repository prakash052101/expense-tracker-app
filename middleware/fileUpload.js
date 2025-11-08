const multer = require('multer');

// Allowed file types for receipts
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf'
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * File filter function for multer
 * Validates file type before upload
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      ),
      false
    );
  }
};

/**
 * Multer configuration for file uploads
 * Uses memory storage to pass buffer to Firebase service
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1 // Only allow one file per request
  },
  fileFilter: fileFilter
});

/**
 * Middleware for single file upload
 * Field name: 'receipt'
 */
const uploadReceipt = upload.single('receipt');

/**
 * Error handling wrapper for multer middleware
 * Converts multer errors to consistent API error format
 */
const handleUploadError = (req, res, next) => {
  uploadReceipt(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: {
            message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            code: 'FILE_TOO_LARGE'
          }
        });
      }
      
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Only one file can be uploaded at a time',
            code: 'TOO_MANY_FILES'
          }
        });
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Unexpected field name. Use "receipt" as the field name',
            code: 'UNEXPECTED_FIELD'
          }
        });
      }

      // Generic multer error
      return res.status(400).json({
        success: false,
        error: {
          message: err.message || 'File upload error',
          code: 'UPLOAD_ERROR'
        }
      });
    } else if (err) {
      // Custom errors (e.g., from fileFilter)
      return res.status(400).json({
        success: false,
        error: {
          message: err.message || 'File upload error',
          code: 'UPLOAD_ERROR'
        }
      });
    }

    // No error, continue to next middleware
    next();
  });
};

module.exports = {
  uploadReceipt,
  handleUploadError,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
};
