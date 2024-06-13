import { defineStore } from "pinia";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Ensure Firestore is correctly imported
import { useFirestore } from "vuefire";

export const useUserStore = defineStore("userStore", () => {
  const auth = getAuth();
  const userDataPublic = ref(null);
  const userDataPrivate = ref(null);
  const userAuth = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const db = useFirestore();

  const userCredentials = ref({
    email: "",
    password: "",
  });

  const stepIndex = ref(0);
  const showSignup = ref(false);

  const decrementStep = () => {
    if (stepIndex.value > 0) {
      stepIndex.value--;
    }
  };
  const incrementStep = () => {
    if (stepIndex.value < 4) {
      stepIndex.value++;
    }
  };

  const signIn = async () => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userCredentials.value.email,
        userCredentials.value.password
      );
      const uid = userCredential.user.uid;
      userAuth.value = userCredential.user;
      const userDocPublic = await getDoc(doc(db, "UsersPublic", uid));
      userDataPublic.value = { uid, ...userDocPublic.data() };
    } catch (e) {
      console.error("Error in signIn:", e);
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  onAuthStateChanged(auth, async (currentUser) => {
    userAuth.value = currentUser;
    if (currentUser) {
      // User is signed in.
      const uid = currentUser.uid;
      loading.value = true;
      try {
        const userDocPublic = await getDoc(doc(db, "UsersPublic", uid));

        userDataPublic.value = { uid, ...userDocPublic.data() };
      } catch (e) {
        console.error("Error loading user data:", e);
        error.value = e.message;
      } finally {
        loading.value = false;
      }
    } else {
      // User is signed out.
      userDataPrivate.value = null;
      userDataPublic.value = null;
      userAuth.value = null;
    }
  });

  return {
    userAuth,
    userDataPublic,
    userDataPrivate,
    loading,
    error,
    stepIndex,
    showSignup,
    userCredentials,
    signIn,
    decrementStep,
    incrementStep,
  };
});
