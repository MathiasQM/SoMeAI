import admin from "firebase-admin";

// Initialize Firebase Admin SDK using the service account key file
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Access Firestore or other Firebase services
const db = admin.firestore();

export { admin, db };
