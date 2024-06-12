import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { defineNuxtPlugin } from "nuxt/app";
import type { NuxtApp } from "nuxt/app";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  // Firebase configuration
  const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyDFAOhQWwSbtKc4sSpTZ20EZ1NFeqMnC5Q",
    authDomain: "brandbrainai.firebaseapp.com",
    projectId: "brandbrainai",
    storageBucket: "brandbrainai.appspot.com",
    messagingSenderId: "922150451469",
    appId: "1:922150451469:web:36c5f2ea813dab0fadd844",
  };

  let app: FirebaseApp;

  // Initialize Firebase
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp(); // If already initialized, use that instance
  }

  // Provide Firebase sev
  nuxtApp.provide("firebase", { app });
});
