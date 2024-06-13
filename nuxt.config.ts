// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { FirebaseConfig } from "./types/firebase";

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
        apiKey: process.env.FIREBASE_API_KEY as string,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
        projectId: process.env.FIREBASE_PROJECT_ID as string,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
        appId: process.env.FIREBASE_APP_ID as string,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID as string,
      } as FirebaseConfig,
    },
  },
  plugins: [
    { src: "~/plugins/firebase.ts", ssr: false },
    { src: "~/plugins/Quill.client.ts", ssr: false },
  ],
});
