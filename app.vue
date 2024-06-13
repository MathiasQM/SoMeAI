<script setup lang="ts">
import { ref } from "vue";
interface ViewerProps {
  title: string;
}
const { data } = await useFetch("/api/hello");
</script>

<template>
  <div>
    {{ data }}
    <NuxtLayout>
      <Viewer>
        <NuxtPage />
      </Viewer>
    </NuxtLayout>
  </div>
</template>
