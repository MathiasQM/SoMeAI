import admin from "firebase-admin";

// Ensure the private key is properly formatted
const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
      clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = admin.firestore();

export { admin, db };
