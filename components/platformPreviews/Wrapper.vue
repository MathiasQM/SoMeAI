<script setup>
import PlatformPreviewsInstagram from "~/components/platformPreviews/Instagram.vue";
import PlatformPreviewsFacebook from "~/components/platformPreviews/Facebook.vue";
import PlatformPreviewsLinkedin from "~/components/platformPreviews/Linkedin.vue";
import PlatformPreviewsThreads from "~/components/platformPreviews/Threads.vue";
import PlatformPreviewsX from "~/components/platformPreviews/X.vue";

const props = defineProps({
  result: Object,
  startAnimation: Boolean,
});

const emit = defineEmits(["openEditor"]);

const isEditorOpen = ref(false);

const channelToComponentMap = {
  Facebook: PlatformPreviewsFacebook,
  Instagram: PlatformPreviewsInstagram,
  LinkedIn: PlatformPreviewsLinkedin,
  Threads: PlatformPreviewsThreads,
  X: PlatformPreviewsX,
};

// Function to get component based on channel
const getComponentForChannel = (channel) => {
  return channelToComponentMap[channel] || null;
};
const openEditor = () => {
  emit("openEditor");
};

const test = ref(false);
setTimeout(() => {
  test.value = true;
}, 1000);
</script>

<template>
  <div class="relative group flex">
    <transition name="fade">
      <component
        v-show="test"
        :is="getComponentForChannel(result.channel)"
        :result="result"
        class="transition-all bg-white border group-hover:border-purple-400"
      />
    </transition>
    <div
      class="relative flex flex-col gap-5 overflow-hidden ml-[10px] transition-all duration-300 ease-in-out w-0 group-hover:w-[100px] group-hover:py-2 opacity-0 group-hover:opacity-100"
    >
      <button
        @click="openEditor()"
        class="transition-all bg-white border border-light-100 hover:border-purple-500 px-4 py-2 rounded-md text-purple-600 text-small"
      >
        Edit
      </button>
      <button
        class="transition-all bg-white border border-light-100 hover:border-purple-500 px-4 py-2 rounded-md text-purple-600 text-small"
      >
        Schedule
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
</style>
