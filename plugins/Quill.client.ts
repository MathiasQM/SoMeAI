import { defineNuxtPlugin } from "nuxt/app";
import type { NuxtApp } from "nuxt/app";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  nuxtApp.vueApp.component("QuillEditor", QuillEditor);
});
