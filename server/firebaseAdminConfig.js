import admin from "firebase-admin";

// Ensure the private key is properly formatted
const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY
  ? process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n")
  : null;

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

// For Local Development
// import serviceAccount from "../service-account.json" assert { type: "json" };
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();

// export { admin, db };
