<script setup>
import { useDialogStore } from '@/stores/ui/useDialogStore';
import { useContentStore } from '@/stores/useContentStore';
const contentpurposes = ref({
  'Content Creation': 'Content Creation',
  'Content Campaign': 'Content Campaign',
  'Content Automations': 'Content Automation',
});

const contentStore = useContentStore();
const { newContentName, contentPurpose } = storeToRefs(contentStore);

const dialogStore = useDialogStore()
const { showDialog } = storeToRefs(dialogStore);
</script>
<template>
    <div class="absolute top-0 left-0 bg-black/70 w-full h-[calc(100%-20px)] z-10 rounded-lg"></div>
    <div class="relative z-20 w-2/3 h-2/3 bg-white rounded-lg flex flex-col items-center justify-center gap-5">
      <h2 class="text-h3xs">Let's get you started! 🎉</h2>
      <p class="text-psmall">Name your content and choose it's purpose.</p>
      <FormsInputText v-model="newContentName" placeholder="Content Name"/>

      <div class="w-2/3 flex gap-24 justify-center bg-light-50 border border-light-100 rounded-lg pl-8 p-2 py-5 pt-10 relative">
        <label class="absolute top-2 text-center w-full left-0 text-xsmall text-darkgrey dark:text-white font-bold">Select purpose</label>
          <div v-for="(purpose, purposeKey) in contentpurposes" :key="purposeKey" 
              @click="contentPurpose = purpose"
              class="flex justify-center items-center">
              <div class="flex flex-col items-center justify-center gap-2 w-14">
                  <div class="transition-all border-2 border-[white] relative w-32 h-20 bg-purple-500 shadow-md rounded-md cursor-pointer" :class="{ 'border-2 border-purple-dark scale-105': contentPurpose === purpose }"></div>
                    <p class="text-xs w-full text-center">{{ purpose }}</p>
                </div>
            </div>
        </div>
        <button class="bg-purple-dark text-white rounded-lg py-2 w-44" @click="showDialog = !showDialog">Start</button>
    </div>
</template>