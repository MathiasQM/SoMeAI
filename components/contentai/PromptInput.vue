<template>
  <div
    v-if="route.path === '/contentai'"
    :class="showWizard ? 'opacity-50' : ''"
    class="absolute left-0 bottom-5 flex w-full justify-center items-center overflow-hidden"
  >
    <div
      class="w-[calc(100vw-70px)] md:w-[calc(100%-40px)] pt-3 gap-3 p-1 border border-light-200 bg-white flex flex-col justify-center rounded-lg"
    >
      <div class="flex gap-5 w-full ml-1">
        <div class="flex flex-col gap-2">
          <p class="text-xsmall text-light-500">Purpose:</p>
          <div class="flex gap-1">
            <button
              @click="editContentOptions('purpose', 'Engage')"
              :class="isContentOptionEnabled('purpose', 'Engage') ? 'bg-purple-500 text-white' : 'text-black bg-white'"
              class="transition-all border border-purple-300 py-1 px-2 rounded-md text-xsmall"
            >
              Engage 🚀
            </button>
            <button
              @click="editContentOptions('purpose', 'Promote')"
              :class="isContentOptionEnabled('purpose', 'Promote') ? 'bg-purple-500 text-white' : 'text-black bg-white'"
              class="transition-all border border-purple-300 py-1 px-2 rounded-md text-xsmall"
            >
              Promote 💰
            </button>
            <button
              @click="editContentOptions('purpose', 'Inform')"
              :class="isContentOptionEnabled('purpose', 'Inform') ? 'bg-purple-500 text-white' : 'text-black bg-white'"
              class="transition-all border border-purple-300 py-1 px-2 rounded-md text-xsmall"
            >
              Inform 📋
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-xsmall text-light-500">Tone</p>
          <div class="flex gap-1">
            <button
              @click="editContentOptions('tone', 'Formal')"
              :class="contentOptions['tone'].includes('Formal') ? 'bg-purple-500 text-white' : 'text-black bg-white'"
              class="transition-all border border-purple-300 py-1 px-2 rounded-md text-xsmall"
            >
              Formal 👔
            </button>
            <button
              @click="editContentOptions('tone', 'Casual')"
              :class="contentOptions['tone'].includes('Casual') ? 'bg-purple-500 text-white' : 'text-black bg-white'"
              class="transition-all border border-purple-300 py-1 px-2 rounded-md text-xsmall"
            >
              Chill 🏖️
            </button>
            <button
              @click="editContentOptions('tone', 'Conversational')"
              :class="
                contentOptions['tone'].includes('Conversational') ? 'bg-purple-500 text-white' : 'text-black bg-white'
              "
              class="transition-all border border-purple-300 py-1 px-2 rounded-md text-xsmall"
            >
              Conversational 💬
            </button>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-xsmall text-light-500">Options:</p>
          <div class="flex gap-2">
            <button
              @click="editContentOptions('images', !contentOptions['images'])"
              :class="contentOptions.images ? 'bg-purple-500 text-white' : 'text-black bg-white'"
              class="transition-all border w-20 border-purple-300 py-1 px-2 rounded-md bg-light-50 text-xsmall"
            >
              Images 🌇
            </button>
          </div>
        </div>
        <div class="flex flex-grow">
          <FormsRangeSlider
            text="Ammount of words in the post"
            :min="15"
            :max="500"
            v-model:sliderValue1="postLength.min"
            v-model:sliderValue2="postLength.max"
          />

          <FormsRangeSlider
            name="emojiuse"
            text="Emoji use"
            type="single"
            :min="0"
            :max="10"
            step="1"
            :initialSliderValue="6"
            v-model:sliderValue1="emojiUse"
          />
        </div>
      </div>
      <textarea
        :disabled="showWizard"
        @keydown="handleKeydown"
        @input="adjustHeight"
        v-model="userInput"
        ref="textarea"
        class="disabled:bg-white overflow-y-scroll w-full md:w-full rounded-lg min-h-16 h-full max-h-52 px-16 py-[18px] bg-light-50 dark:bg-darkgrey dark:text-white dark:placeholder:text-white border border-light-100 focus:outline-purple-dark resize-none overflow-hidden"
        placeholder="New E-Book about AI and Machine Learning coming friday!"
        rows="1"
      ></textarea>
      <NuxtIcon
        name="ArrowUp"
        @click="generateContent"
        class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer right-3 bottom-4 bg-purple-dark w-10 h-10 mr-5 text-white text-2xl rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/useContentStore";
import { useUserStore } from "@/stores/Users/useUserStore";

const textarea = ref(null);
const route = useRoute();
const showWizard = ref(false); // Assume this is coming from a store or a prop
const emojiUse = ref(6);
const postLength = reactive({
  min: 50,
  max: 150,
});
const contentOptions = reactive({
  purpose: [],
  tone: [],
  images: false,
});

const isContentOptionEnabled = (key, value) => {
  if (contentOptions[key].includes(value)) {
    return true;
  }
  return false;
};

const editContentOptions = (key, value) => {
  switch (key) {
    case "purpose":
    case "tone":
      if (contentOptions[key].includes(value)) {
        contentOptions[key].splice(contentOptions[key].indexOf(value), 1);
      } else {
        contentOptions[key].push(value);
      }
      break;
    case "images":
      contentOptions.images = value;
      break;
    default:
      break;
  }
};

const contentStore = useContentStore();
const { selectedSessionResults, selectedSession, userInput } = storeToRefs(contentStore);

const userStore = useUserStore();
const { userAuth } = storeToRefs(userStore);

//   contentStore.setupContentListener(userAuth.value.uid);
const adjustHeight = () => {
  const el = textarea.value;
  if (el) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
};

const handleKeydown = (event) => {
  if (event.key === "Enter" && event.shiftKey) {
    event.preventDefault();
    userInput.value += "\n";
  } else if (event.key === "Enter") {
    event.preventDefault();
    generateContent();
  } else if ((event.metaKey || event.ctrlKey) && event.key === "a") {
    event.preventDefault();
    // Select all text in the textarea
    const el = textarea.value;
    if (el) {
      el.select();
    }
  }
};

// Watch the userInput and adjust the height accordingly
watch(userInput, () => {
  adjustHeight();
});

onMounted(() => {
  adjustHeight();
});

// Function to handle content generation
const generateContent = () => {
  if (!userInput.value.trim()) {
    alert("Please input a topic or leave it blank for a random topic.");
    return;
  }
  // Assuming the store has a method to handle content generation
  contentStore.generateContentForChannel(userInput.value, contentOptions);
};
</script>
