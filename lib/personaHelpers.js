// lib/firebaseHelpers.js
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function fetchPersonasFromFirestore(userId) {
  const db = getFirestore();
  if (!userId) return null;
  const q = query(collection(db, "Personas"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function deletePersonaById(personaId) {
  const db = getFirestore();
  const personaRef = doc(db, "Personas", personaId);
  await deleteDoc(personaRef);
}

export async function createPersonaRemote(userProvidedData) {
  const response = await fetch("https://us-central1-contentai-f4d3e.cloudfunctions.net/createPersona", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userProvidedData),
  });
  if (!response.ok) throw new Error("Failed to create persona");
  return response.json();
}
