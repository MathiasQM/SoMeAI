import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { FirebaseConfig } from "../types/firebase";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  // Your Firebase configuration

  const firebaseConfig = config.public.firebase as FirebaseConfig;

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
