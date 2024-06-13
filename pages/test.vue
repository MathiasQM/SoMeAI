<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-blue-500">Nuxt.js Environment Test</h1>
    <div class="my-4">
      <NuxtIcon name="nuxt-icon" />
      <p class="text-green-500">Nuxt Icons are working!</p>
    </div>
    <div class="my-4" v-if="firebaseApp">
      <p class="text-green-500">Firebase is configured correctly!</p>
    </div>
    <div class="my-4" v-if="dompurifyAvailable">
      <p class="text-green-500">DOMPurify is available!</p>
    </div>
    <div class="my-4" v-if="vueUseAvailable">
      <p class="text-green-500">VueUse is available!</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { initializeApp } from "firebase/app";
import DOMPurify from "dompurify";
import { useMouse } from "@vueuse/core";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

const firebaseApp = initializeApp(firebaseConfig);
const dompurifyAvailable = !!DOMPurify;
const { x, y } = useMouse();
const vueUseAvailable = !!x && !!y;
</script>

<style>
@import "tailwindcss/tailwind.css";
</style>
