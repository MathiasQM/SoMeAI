import admin from "firebase-admin";
import fs from "fs";

// Assuming GOOGLE_APPLICATION_CREDENTIALS contains the path to the secret file
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Read the service account key from the secret file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Access Firestore or other Firebase services
const db = admin.firestore();

export { admin, db };
