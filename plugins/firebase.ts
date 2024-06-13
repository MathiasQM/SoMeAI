import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { FirebaseConfig } from "../types/firebase";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  // Your Firebase configuration

  const firebaseConfig = config.public.firebase as FirebaseConfig;
  // Log the firebaseConfig to ensure it is being loaded correctly
  console.log("Firebase apiKey:", config.public.firebase.apiKey);
  console.log("Firebase authDomain:", config.public.firebase.authDomain);
  console.log("Firebase projectId:", config.public.firebase.projectId);
  console.log("Firebase storageBucket:", config.public.firebase.storageBucket);
  console.log("Firebase messagingSenderId:", config.public.firebase.messagingSenderId);
  console.log("Firebase appId:", config.public.firebase.appId);
  console.log("Firebase measurementId:", config.public.firebase.measurementId);
  console.log("Firebase Config:", firebaseConfig);

  // Initialize Firebase
  let firebaseApp: FirebaseApp;
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp(); // If already initialized, use that instance
  }

  // Provide Firebase services to Nuxt app
  nuxtApp.provide("firebase", { app: firebaseApp });
});
