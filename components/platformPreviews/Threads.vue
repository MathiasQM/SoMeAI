<script setup>
import DOMPurify from "dompurify";
// import Swiper JS
import Swiper from "swiper";
import { Pagination } from "swiper/modules";
// import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { usePersonaStore } from "@/stores/content/usePersonaStore";

const personaStore = usePersonaStore();
const { selectedPersona } = storeToRefs(personaStore);

const props = defineProps({
  result: Object,
  isEditable: {
    iseditable: Boolean,
    default: false,
  },
});

// Use refs for reactive DOM elements
const swiperContainer = ref(null);
const swiperInstance = ref(null);

const slides = ref(
  Array.from({ length: 10 }, () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    // Figure out contrast color for font
    const contrast = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "black" : "white";

    return { bg: `rgb(${r}, ${g}, ${b})`, color: contrast };
  })
);

Swiper.use([Pagination]);

// Initialize Swiper after component and DOM are fully mounted
onMounted(() => {
  nextTick(() => {
    swiperInstance.value = new Swiper(swiperContainer.value, {
      modules: [Pagination],
      direction: "horizontal",
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        type: "bullets",
        dynamicMainBullets: 2,
        dynamicBullets: true,
      },
    });

    // Watch for changes in slides data to dynamically show/hide pagination
    watch(
      slides,
      (newSlides) => {
        const pagination = swiperInstance.value.pagination;
        if (newSlides.length > 1) {
          pagination.el.classList.remove("hidden");
        } else {
          pagination.el.classList.add("hidden");
        }
      },
      { immediate: true }
    );
  });
});

const content = ref(null);
function decodeHtmlEntities(text) {
  var textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

function convertLineBreaksToHTML(text) {
  const decodedText = decodeHtmlEntities(text);
  return decodedText.replace(/\r\n|\r|\n/g, "<br>");
}

watch(
  () => props.result,
  (newValue) => {
    if (newValue.content) {
      // Sanitize the HTML content to prevent XSS attacks
      const safeContent = DOMPurify.sanitize(newValue.content);
      //   quillEditor.value.root.innerHTML = safeContent;
      content.value = convertLineBreaksToHTML(safeContent);
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="overflow-hidden bg-white rounded-lg border border-creme p-2 shadow-lg cursor-pointer">
    <div
      :class="isEditable ? 'overflow-y-auto' : 'overflow-hidden'"
      class="custom-scrollbar overflow-x-hidden flex flex-col w-[400px] max-h-[70vh]"
    >
      <div class="flex items-center p-4 gap-2 relative">
        <div class="w-10 h-10 bg-lightgrey rounded-full"></div>
        <div class="text-xsmall">
          <p class="font-bold">{{ selectedPersona.personaName }}</p>
          <p class="bg-purple-100 text-purple-500 font-medium py-[1px] px-[2px] rounded-sm flex items-center gap-1">
            <NuxtIcon name="AI" />Scheduled for: {{ result.post_time }}
          </p>
        </div>
        <div class="absolute right-5 flex items-center gap-5">
          <!-- <button v-if="!isEditable" class="text-psmall text-white bg-purple-dark py-1 px-4 rounded-md">Edit</button> -->
          <NuxtIcon name="Threads" filled class="text-3xl" />
        </div>
      </div>
      <div @click.stop="console.log('Vælg fil')" class="w-full my-2 flex-shrink-0">
        <div class="swiper" ref="swiperContainer">
          <div class="swiper-wrapper">
            <div
              v-for="(slide, i) in slides"
              :key="`slide${i}`"
              :style="`background-color:${slide.bg};`"
              class="swiper-slide text-white"
            >
              {{ i }}. Vælg fil
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="flex items-center py-3 px-4 justify-between">
        <div class="flex gap-2">
          <NuxtIcon name="Heart" class="text-xl text-black" />
          <NuxtIcon name="Chat" class="text-xl text-black" />
          <NuxtIcon name="Paperplane" class="text-xl text-black" />
        </div>
        <div class="flex">
          <NuxtIcon name="Bookmark" class="text-xl text-black" />
        </div>
      </div>
      <div class="flex items-center">
        <div class=".custom-pagination flex">
          <span class="w-4 h-4 bg-lightgrey border-2 border-white rounded-full"></span>
          <span class="w-4 h-4 bg-lightgrey border-2 border-white rounded-full relative -left-[5px]"></span>
          <span class="w-4 h-4 bg-lightgrey border-2 border-white rounded-full relative -left-[10px]"></span>
        </div>
        <p class="text-xsmall mr-1">Likes from</p>
        <p class="text-xsmall font-bold">mathias_kiil</p>
        <p class="text-xsmall mr-1">and</p>
        <p class="text-xsmall font-bold">31 others</p>
      </div>
      <p class="mt-2">
        <span class="font-bold">{{ selectedPersona.personaName }}</span>
      </p>
      <div
        :id="isEditable ? 'editor' : ''"
        class="mt-2 text-xsmall pre-line leading-4 !outline-none !border-none"
        v-html="content"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* Preserve breaks in text content */
.pre-line {
  white-space: pre-line;
}

.swiper {
  width: 400px;
  height: 250px;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-size: 4rem;
  font-weight: bold;
  font-family: "Roboto", sans-serif;
}
.swiper-wrapper {
  min-width: 100vh;
  width: 100vh;
}
/* .swiper-cards {
  width: 240px;
  height: 240px;
} */

/* .swiper-cards .swiper-slide {
  border-radius: 6px;
  border: 1px solid black;
} */

/* Ensures pagination is hidden when there's only one slide */
.swiper-pagination-bullet-only {
  display: none;
}

/* Change the bullet color */
.swiper-pagination-bullet {
  background-color: #000000c0;
}

/* Change the active bullet color */
.swiper-pagination-bullet-active {
  background-color: #7b61ff;
}
</style>
