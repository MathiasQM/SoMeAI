// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import dotenv from "dotenv";
import { FirebaseConfig } from "./types/firebase";

dotenv.config();

export default defineNuxtConfig({
  telemetry: false,
  devtools: { enabled: false },
  routeRules: {
    "/": { ssr: true },
    "/personas": { ssr: true },
  },
  css: ["~/assets/styles/tailwind.css"],
  modules: ["nuxt-icons", "@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    serviceAccountProjectId: process.env.NUXT_SERVICE_ACCOUNT_PROJECT_ID,
    serviceAccountClientEmail: process.env.NUXT_SERVICE_ACCOUNT_CLIENT_EMAIL,
    serviceAccountPrivateKey: process.env.NUXT_SERVICE_ACCOUNT_PRIVATE_KEY,
    public: {
      openai: {
        apiKey: process.env.NUXT_PUBLIC_OPENAI_API_KEY,
      },
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      } as FirebaseConfig,
    },
  },
  plugins: [
    { src: "~/plugins/firebase.ts", ssr: false },
    { src: "~/plugins/Quill.client.ts", ssr: false },
  ],
});
