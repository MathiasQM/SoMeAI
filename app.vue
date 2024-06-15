<script setup lang="ts">
import { ref } from "vue";
interface ViewerProps {
  title: string;
}
</script>

<template>
  <div>
    <NuxtLayout>
      <Viewer>
        <NuxtPage />
      </Viewer>
    </NuxtLayout>
  </div>
</template>
