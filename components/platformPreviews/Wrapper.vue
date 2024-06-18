<script setup>
import PlatformPreviewsInstagram from "~/components/platformPreviews/Instagram.vue";
import PlatformPreviewsFacebook from "~/components/platformPreviews/Facebook.vue";

const props = defineProps({
  result: Object,
});

const emit = defineEmits(["openEditor"]);

const isEditorOpen = ref(false);

const channelToComponentMap = {
  Facebook: PlatformPreviewsFacebook,
  Instagram: PlatformPreviewsInstagram,
};

// Function to get component based on channel
const getComponentForChannel = (channel) => {
  return channelToComponentMap[channel] || null;
};
const openEditor = () => {
  emit("openEditor");
};
</script>

<template>
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
