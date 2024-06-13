<script setup lang="ts">
import { ref } from "vue";
interface ViewerProps {
  title: string;
}
const test = ref<string>("test");
</script>

<template>
  <div>
    {{ test }}
    <NuxtLayout>
      <Viewer>
        <NuxtPage />
      </Viewer>
    </NuxtLayout>
  </div>
</template>
