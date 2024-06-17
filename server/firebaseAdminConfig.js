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
  const projectId = await getSecret("projects/1026306623588/secrets/SERVICE_ACCOUNT_PROJECT_ID");
  const clientEmail = await getSecret("projects/1026306623588/secrets/SERVICE_ACCOUNT_CLIENT_EMAIL");
  const privateKeyRaw = await getSecret("projects/1026306623588/secrets/SERVICE_ACCOUNT_PRIVATE_KEY");
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  console.log("Fetched PROJECT_ID:", projectId);
  console.log("Fetched CLIENT_EMAIL:", clientEmail);
  console.log("Fetched and formatted PRIVATE_KEY:", privateKey ? "Exists" : "Does not exist");

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
}

let firebaseAdminInstance = null;

async function getFirebaseAdminInstance() {
  if (!firebaseAdminInstance) {
    firebaseAdminInstance = await initializeAppWithSecrets();
  }
  return firebaseAdminInstance;
}

export { getFirebaseAdminInstance };
