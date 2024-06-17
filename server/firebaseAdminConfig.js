import admin from "firebase-admin";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

async function getSecret(secretName) {
  const [version] = await client.accessSecretVersion({
    name: secretName,
  });
  return version.payload.data.toString();
}

async function initializeAppWithSecrets() {
  try {
    const projectId = await getSecret("projects/1026306623588/secrets/SERVICE_ACCOUNT_PROJECT_ID/versions/latest");
    const clientEmail = await getSecret("projects/1026306623588/secrets/SERVICE_ACCOUNT_CLIENT_EMAIL/versions/latest");
    const privateKeyRaw = await getSecret("projects/1026306623588/secrets/SERVICE_ACCOUNT_PRIVATE_KEY/versions/latest");
    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey,
        }),
      });
    }

    const db = admin.firestore();
    return { admin, db };
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    throw error;
  }
}

initializeAppWithSecrets()
  .then(({ admin, db }) => {
    // Now you can use admin and db in your functions
    // Your functions implementation
  })
  .catch(console.error);
