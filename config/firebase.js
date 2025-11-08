const admin = require('firebase-admin');

let bucket = null;
let firestore = null;

/**
 * Initialize Firebase Admin SDK
 * Supports both environment variable (production) and local JSON file (development)
 */
function initializeFirebase() {
  try {
    let serviceAccount;

    // Try to get service account from environment variable first (production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        console.log('Firebase: Using service account from environment variable');
      } catch (parseError) {
        console.error('Firebase: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', parseError.message);
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format. Must be valid JSON.');
      }
    } 
    // Fallback to local JSON file for development
    else {
      try {
        serviceAccount = require('../firebase-service-account.json');
        console.log('Firebase: Using service account from local file');
      } catch (fileError) {
        throw new Error(
          'Firebase service account not found. Please provide either:\n' +
          '1. FIREBASE_SERVICE_ACCOUNT_KEY environment variable (JSON string), or\n' +
          '2. firebase-service-account.json file in project root'
        );
      }
    }

    // Validate required environment variable
    if (!process.env.FIREBASE_STORAGE_BUCKET) {
      throw new Error('FIREBASE_STORAGE_BUCKET environment variable is required');
    }

    // Initialize Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    // Initialize Storage bucket
    bucket = admin.storage().bucket();
    console.log(`Firebase Storage: Connected to bucket ${process.env.FIREBASE_STORAGE_BUCKET}`);

    // Initialize Firestore
    firestore = admin.firestore();
    console.log('Firebase Firestore: Connected successfully');

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
}

/**
 * Get Firebase Storage bucket instance
 * @returns {Bucket} Firebase Storage bucket
 */
function getBucket() {
  if (!bucket) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return bucket;
}

/**
 * Get Firestore instance
 * @returns {Firestore} Firestore database instance
 */
function getFirestore() {
  if (!firestore) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firestore;
}

module.exports = {
  initializeFirebase,
  getBucket,
  getFirestore,
  admin
};
