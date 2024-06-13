// server/api/hello.ts
import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  return {
    message: "Hello, this is a simple Nuxt 3 API route!",
  };
});
