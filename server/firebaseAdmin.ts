// Initialize Firebase Admin SDK
var admin = require("firebase-admin");

// Firebase Admin SDK Service Account Key
var serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin Initialized");
} catch (error) {
  console.log("Firebase Admin Already Initialized");
}

// Export Firestore Database
export const db = admin.firestore();
