var admin = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized");
} catch (error) {
  console.log("Firebase Admin initialization error", error);
}

export const db = admin.firestore();
