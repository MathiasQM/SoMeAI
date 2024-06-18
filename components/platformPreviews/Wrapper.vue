<script setup>
import PlatformPreviewsInstagram from "~/components/platformPreviews/Instagram.vue";
import PlatformPreviewsFacebook from "~/components/platformPreviews/Facebook.vue";

const contentStore = useContentStore();
const { selectedSessionResults, selectedSession, userInput, stopZoomAndDrag } = storeToRefs(contentStore);

const openLightBoxId = ref(null); // This will hold the ID of the component that is open in the lightbox
const isEditorOpen = ref(false);

const channelToComponentMap = {
  Facebook: PlatformPreviewsFacebook,
  Instagram: PlatformPreviewsInstagram,
};

// Function to get component based on channel
const getComponentForChannel = (channel) => {
  return channelToComponentMap[channel] || null;
};
// Function to open the lightbox for a specific component
let componentId = null;
const openEditor = (index) => {
  componentId = index;
  isEditorOpen.value = true;
  stopZoomAndDrag.value = false;
};
</script>

<template>
  <!-- <PlatformPreviewsEditor
    v-if="isEditorOpen"
    :component="getComponentForChannel(selectedSessionResults[componentId].channel)"
    :result="selectedSessionResults[componentId]"
    :isOpen="isEditorOpen"
  /> -->
  <div
    v-for="(result, i) in selectedSessionResults"
    :key="result.id"
    class="w-full flex justify-center items-center h-full fade-item"
  >
    <div v-show="result" class="relative group flex gap-5">
      <component
        :is="getComponentForChannel(result.channel)"
        :result="result"
        class="transition-all border group-hover:border-purple-400"
      />
      <div
        class="relative flex flex-col gap-5 overflow-hidden transition-all duration-300 ease-in-out w-0 group-hover:w-[100px] group-hover:py-2 opacity-0 group-hover:opacity-100"
      >
        <button
          @click="openEditor(i)"
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
  </div>
  <div v-show="isEditorOpen" class="fixed z-50 top-0 left-0 w-full h-full bg-black/20"></div>
</template>
