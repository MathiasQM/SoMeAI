<template>
    <div
      v-if="route.path === '/contentai'"
      :class="showWizard ? 'opacity-50' : ''"
      class="absolute left-0 bottom-5 flex w-full justify-center items-center overflow-hidden"
    >
      <textarea
        :disabled="showWizard"
        @keydown="handleKeydown"
        @input="adjustHeight"
        v-model="userInput"
        ref="textarea"
        class="disabled:bg-white w-[calc(100vw-70px)] md:w-[calc(100%-40px)] rounded-lg min-h-16 h-full px-16 py-[18px] dark:bg-darkgrey dark:text-white dark:placeholder:text-white border border-light-100 focus:outline-purple-dark resize-none overflow-hidden"
        placeholder="New E-Book about AI and Machine Learning coming friday!"
        rows="1"
      ></textarea>
      <NuxtIcon
        name="ArrowUp"
        @click="generateContent"
        class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer right-3 bg-purple-dark w-10 h-10 mr-5 text-white text-2xl rounded-lg"
      />
    </div>
  </template>
  
  <script setup>
  import { useContentStore } from '@/stores/useContentStore';
  import { useUserStore } from '@/stores/Users/useUserStore';

  const textarea = ref(null);
  const route = useRoute();
  const showWizard = ref(false); // Assume this is coming from a store or a prop
  
  const contentStore = useContentStore()
  const { selectedSessionResults, selectedSession, userInput } = storeToRefs(contentStore);

  const userStore = useUserStore();
  const { userAuth } = storeToRefs(userStore);

//   contentStore.setupContentListener(userAuth.value.uid);
  const adjustHeight = () => {
    const el = textarea.value;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };
  
  const handleKeydown = (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
    event.preventDefault();
    userInput.value += '\n';
  } else if (event.key === 'Enter') {
    event.preventDefault();
    generateContent();
  } else if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
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
        alert('Please input a topic or leave it blank for a random topic.');
        return;
    }
    // Assuming the store has a method to handle content generation
    contentStore.generateContentForChannel(userInput.value);
};

  </script>
  
  