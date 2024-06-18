import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

let serviceAccount;

const loadServiceAccount = async () => {
  if (isProduction) {
    serviceAccount = {
      type: process.env.SERVICE_ACCOUNT_TYPE,
      project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
      private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
      client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
      auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
      token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
      universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
    };
  } else {
    const serviceAccountModule = await import("./service-account.json", { assert: { type: "json" } });
    serviceAccount = serviceAccountModule.default;
  }
};

export const initializeFirebaseAdmin = async () => {
  if (!serviceAccount) {
    await loadServiceAccount();
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
};

export const getFirestore = async () => {
  await initializeFirebaseAdmin();
  return admin.firestore();
};

export { admin };
