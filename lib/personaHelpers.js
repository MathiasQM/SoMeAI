import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

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
  console.log("userProvidedData", userProvidedData);
  const { success, data, error } = await useFetch("/api/users/personas/create", {
    method: "POST",
    body: userProvidedData,
  });
  console.log(success, data, error);

  if (!success) throw new Error("Failed to create persona");
  return data.json();
}
