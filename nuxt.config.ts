// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import dotenv from "dotenv";
import { FirebaseConfig } from "./types/firebase";

dotenv.config();
console.log("FIREBASE_API_KEY:", process.env.NUXT_PUBLIC_FIREBASE_API_KEY);

export default defineNuxtConfig({
  telemetry: false,
  devtools: { enabled: true },
  routeRules: {
    "/": { ssr: true },
    "/about": { ssr: true },
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
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY as string,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID as string,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
      } as FirebaseConfig,
    },
  },
  plugins: [
    { src: "~/plugins/firebase.ts", ssr: false },
    { src: "~/plugins/Quill.client.ts", ssr: false },
  ],
});
