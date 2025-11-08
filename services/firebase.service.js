const { getBucket, getFirestore, admin } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

// File validation constants
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Validate file before upload
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} mimetype - File MIME type
 * @param {String} originalName - Original filename
 * @throws {Error} If validation fails
 */
function validateFile(fileBuffer, mimetype, originalName) {
  // Check file size
  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new Error(
      `Invalid file type: ${mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
    );
  }

  // Check file extension matches MIME type
  const fileExtension = originalName.split('.').pop().toLowerCase();
  const validExtensions = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/jpg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf']
  };

  const allowedExtensions = validExtensions[mimetype] || [];
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error(
      `File extension .${fileExtension} does not match MIME type ${mimetype}`
    );
  }
}

/**
 * Upload file to Firebase Cloud Storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} originalName - Original filename
 * @param {String} mimetype - File MIME type
 * @param {String} userId - User ID for organizing files
 * @returns {Promise<Object>} - { url, path, firestoreId }
 */
async function uploadFile(fileBuffer, originalName, mimetype, userId) {
  try {
    // Validate file before upload
    validateFile(fileBuffer, mimetype, originalName);

    const bucket = getBucket();
    const firestore = getFirestore();

    // Generate unique filename with UUID
    const fileExtension = originalName.split('.').pop().toLowerCase();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `receipts/${userId}/${fileName}`;

    const file = bucket.file(filePath);

    // Upload to Cloud Storage
    await file.save(fileBuffer, {
      metadata: {
        contentType: mimetype,
        metadata: {
          originalName: originalName,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          fileSize: fileBuffer.length.toString()
        }
      },
      public: true, // Make file publicly accessible
      validation: 'md5' // Validate upload integrity
    });

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    // Store metadata in Firestore
    const metadataRef = await firestore.collection('file_metadata').add({
      userId: userId,
      fileName: fileName,
      originalName: originalName,
      filePath: filePath,
      publicUrl: publicUrl,
      mimetype: mimetype,
      size: fileBuffer.length,
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    });

    console.log(`File uploaded successfully: ${filePath} (Firestore ID: ${metadataRef.id})`);

    return {
      url: publicUrl,
      path: filePath,
      firestoreId: metadataRef.id
    };
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
}

/**
 * Delete file from Firebase Cloud Storage and Firestore
 * @param {String} filePath - Firebase Storage path
 * @param {String} firestoreId - Firestore document ID
 * @returns {Promise<void>}
 */
async function deleteFile(filePath, firestoreId) {
  try {
    const bucket = getBucket();
    const firestore = getFirestore();

    const deletionPromises = [];

    // Delete from Cloud Storage
    if (filePath) {
      const file = bucket.file(filePath);
      deletionPromises.push(
        file.delete().catch((error) => {
          // Don't throw error if file doesn't exist (404)
          if (error.code === 404) {
            console.warn(`File not found in Storage: ${filePath}`);
          } else {
            throw error;
          }
        })
      );
    }

    // Delete metadata from Firestore (or mark as deleted)
    if (firestoreId) {
      deletionPromises.push(
        firestore
          .collection('file_metadata')
          .doc(firestoreId)
          .update({
            status: 'deleted',
            deletedAt: admin.firestore.FieldValue.serverTimestamp()
          })
          .catch((error) => {
            // Don't throw error if document doesn't exist
            if (error.code === 5) { // NOT_FOUND
              console.warn(`Firestore document not found: ${firestoreId}`);
            } else {
              throw error;
            }
          })
      );
    }

    await Promise.all(deletionPromises);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error) {
    console.error('Error deleting file from Firebase:', error);
    // Log error but don't throw - allow expense deletion to proceed
    // even if file cleanup fails
  }
}

/**
 * Get file metadata from Firestore
 * @param {String} firestoreId - Firestore document ID
 * @returns {Promise<Object>} - File metadata object
 */
async function getFileMetadata(firestoreId) {
  try {
    const firestore = getFirestore();

    const doc = await firestore.collection('file_metadata').doc(firestoreId).get();

    if (!doc.exists) {
      throw new Error('File metadata not found');
    }

    const data = doc.data();

    // Convert Firestore Timestamp to JavaScript Date
    if (data.uploadedAt && data.uploadedAt.toDate) {
      data.uploadedAt = data.uploadedAt.toDate();
    }
    if (data.deletedAt && data.deletedAt.toDate) {
      data.deletedAt = data.deletedAt.toDate();
    }

    return {
      id: doc.id,
      ...data
    };
  } catch (error) {
    console.error('Error fetching file metadata from Firestore:', error);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
}

/**
 * Get all file metadata for a specific user
 * @param {String} userId - User ID
 * @param {Object} options - Query options (limit, status filter)
 * @returns {Promise<Array>} - Array of file metadata objects
 */
async function getUserFiles(userId, options = {}) {
  try {
    const firestore = getFirestore();
    const { limit = 100, status = 'active' } = options;

    let query = firestore
      .collection('file_metadata')
      .where('userId', '==', userId);

    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('uploadedAt', 'desc').limit(limit);

    const snapshot = await query.get();

    const files = [];
    snapshot.forEach((doc) => {
      const data = doc.data();

      // Convert Firestore Timestamp to JavaScript Date
      if (data.uploadedAt && data.uploadedAt.toDate) {
        data.uploadedAt = data.uploadedAt.toDate();
      }
      if (data.deletedAt && data.deletedAt.toDate) {
        data.deletedAt = data.deletedAt.toDate();
      }

      files.push({
        id: doc.id,
        ...data
      });
    });

    return files;
  } catch (error) {
    console.error('Error fetching user files from Firestore:', error);
    throw new Error(`Failed to get user files: ${error.message}`);
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getFileMetadata,
  getUserFiles,
  validateFile,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE
};
