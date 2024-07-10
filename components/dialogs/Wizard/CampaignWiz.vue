<script setup lang="ts">
import { useContentStore } from "@/stores/useContentStore";

const contentStore = useContentStore();
const { selectedChannels } = storeToRefs(contentStore);

const availableContentBasis = ref({
  prompt: "Custom prompt",
  link: "Link",
  file: "File",
});

const availableChannels = ref({
  Facebook: "Facebook",
  Instagram: "Instagram",
  LinkedIn: "LinkedIn",
  Threads: "Threads",
  X: "X",
  "Blog Post": "Blog Post",
  // Email: "Email",
});

// TODO: Based on the selected ptform and persona, fetch the content suggestions
const contentSuggestions = ref([
  {
    title: "Journey Through the Stars",
    description: "A journey through the stars, exploring the universe and the unknown.",
  },
  {
    title: "Innovating the Future",
    description:
      "Dive into the world of technology, where coding meets creativity, shaping the next generation of digital wonders.",
  },
  {
    title: "A Culinary Adventure",
    description:
      "Embark on a gastronomic journey that celebrates global cuisines, uncovering the stories behind the flavors that unite us.",
  },
  {
    title: "Pioneering Sustainable Living",
    description:
      "Discover the innovations and lifestyle changes leading the charge towards a sustainable future for our planet.",
  },
]);
</script>

<template>
  <div class="w-[calc(70%)] h-[calc(80%)] p-5 flex flex-col items-center justify-center gap-5">
    <div class="w-[600px] grid grid-row-6 gap-5 border border-purple-dark rounded-lg p-5">
      <div>
        <div class="w-full flex gap-8 flex-wrap justify-center pt-12 pb-8 bg-creme rounded-lg relative">
          <label class="absolute top-2 text-center w-full left-0 text-xsmall text-darkgrey dark:text-white font-bold"
            >Select channel</label
          >
          <div
            v-for="(channel, channelKey) in availableChannels"
            :key="channelKey"
            @click="contentStore.selectChannel(channel)"
            class="flex justify-center items-center gap-5"
          >
            <div class="flex flex-col items-center justify-center gap-2 w-14">
              <div
                class="transition-all border-2 border-[white] relative w-10 h-10 bg-purple-500 shadow-md rounded-md cursor-pointer"
                :class="{ 'border-2 border-purple-dark scale-105': selectedChannels.includes(channelKey) }"
              ></div>
              <p class="text-xs w-full text-center">{{ channel }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap justify-evenly gap-2">
      <div
        class="group transition-all border border-creme bg-white hover:bg-creme rounded-lg p-2 h-20 flex flex-col justify-center w-[calc(50%-4px)] cursor-pointer relative"
        v-for="suggestion in contentSuggestions"
        :key="suggestion.id"
      >
        <p class="text-psmall font-bold w-[85%]">{{ suggestion.title }}</p>
        <p class="text-xsmall leading-4 w-[85%]">{{ suggestion.description }}</p>
        <NuxtIcon
          name="ArrowUp"
          class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer right-0 bg-creme group-hover:bg-purple-dark w-6 h-6 text-white text-2xl pt-1 rounded-lg mr-5"
        />
      </div>
      <NuxtIcon
        name="Refresh"
        filled
        class="relative cursor-pointer hover:text-purple-500 text-2xl transition-all w-10 h-10 flex items-center justify-center bg-white border border-white hover:border-purple-500 py-1 px-2 mt-2 rounded-md"
      >
        Suggest new
      </NuxtIcon>
      <ContentaiPromptInput />
    </div>
  </div>
</template>
