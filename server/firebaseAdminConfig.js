import admin from "firebase-admin";

const config = useRuntimeConfig();

const serviceAccount = {
  projectId: config.private.serviceAccount.projectId,
  clientEmail: config.private.serviceAccount.clientEmail,
  privateKey: config.private.serviceAccount.privateKey.replace(/\\n/g, "\n"),
};

// Initialize the Firebase Admin SDK using the service account
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { admin, db };
