<script setup lang="ts">
import NewContent from "@/components/dialogs/wizard/NewContent.vue";
import { useGloabalState } from "@/stores/ui/useGlobalState";
import { usePersonaStore } from "@/stores/content/usePersonaStore";
import { useDialogStore } from "@/stores/ui/useDialogStore";
import { useUserStore } from "@/stores/Users/useUserStore";

// Component name as string for dynamic rendering
const useGloabalStateStore = useGloabalState();
const { loading } = storeToRefs(useGloabalStateStore);
const dynamicComponent = shallowRef(NewContent);
const dialogStore = useDialogStore();
const { showDialog } = storeToRefs(dialogStore);

const personaStore = usePersonaStore();

onMounted(async () => {
  if (!personaStore.personas.length && userAuth.value) {
    await personaStore.fetchPersonas();
  }
});

const showWizard = ref(false);
watch(showDialog, (newVal) => {
  showWizard.value = newVal;
});

const userStore = useUserStore();
const { userAuth } = storeToRefs(userStore);

// const contentStore = useContentStore()
// const { selectedSessionResults, selectedSession, userInput } = storeToRefs(contentStore);
// contentStore.setupContentListener(userAuth.value.uid);

// // Function to handle content generation
// const generateContent = () => {
//     if (!userInput.value.trim()) {
//         alert('Please input a topic or leave it blank for a random topic.');
//         return;
//     }
//     // Assuming the store has a method to handle content generation
//     contentStore.generateContentForChannel(userInput.value);
// };

const route = useRoute();
</script>

<template>
  <div
    class="relative custom-scrollbar overflow-hidden transition-all w-full h-screen bg-grey-50 bg-light-50 dark:bg-black"
  >
    <LayoutTopNav />
    <!-- h-[calc(100%-70px)] -->
    <!-- <div>
            <DialogsSetupHosting />

        </div> -->
    <!-- :class="route.path === '/contentai' ? 'h-[calc(100%-154px)]' : ''" -->
    <div class="relative h-full custom-scrollbar flex flex-wrap gap-5">
      <!-- Use a Pinia store to control what kind of dialog and when to show it -->
      <!-- This way, we could have a confirm modal and have the confirm button run a function of our choice -->
      <!-- Example: hosting wizard. if the url is /hosting, /domain or something that requires hosting -->
      <!-- And if the selected domain has not setup hosting yet, and the user has an active hosting subscription - then show it-->
      <!-- And if the user does not have an active subscription, then show and upgrade dialog!-->
      <!-- TODO: Implement logic to show and hide different dialogs depending on route, context and userdata -->
      <!-- <Transition name="fade" appear>
              <div v-if="showWizard === true" class="absolute z-[5] w-[calc(100%)] h-[calc(100%)] p-5 flex flex-col items-center justify-center">
                  <component :is="dynamicComponent" />
              </div>
            </Transition> -->
      <slot />
    </div>
    <div
      v-if="loading"
      class="absolute top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-light-900/50"
    >
      <div class="bg-white border border-light-100 w-24 h-24 rounded-md flex justify-center items-center">
        <UiLargeLoader />
      </div>
    </div>
    <!-- <div v-if="route.path === '/contentai'" :class="showWizard ? 'opacity-50' : ''" class="absolute left-0 bottom-5 flex w-full justify-center items-center overflow-hidden">
            <input :disabled="showWizard" @keydown.enter="generateContent" type="text" v-model="userInput"  class="disabled:bg-white w-[calc(100vw-70px)] md:w-[calc(100%-40px)] rounded-lg min-h-16 h-auto pl-5 dark:bg-darkgrey dark:text-white dark:placeholder:text-white border border-light-100 focus:outline-purple-dark" placeholder="Input a topic or leave it blank to generate a random topic">
            <NuxtIcon name="ArrowUp" @click="generateContent" class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer right-3 bg-purple-dark w-10 h-10 mr-5 text-white text-2xl rounded-lg" />
        </div> -->
    <!-- <div
            v-if="route.path === '/contentai'"
            :class="showWizard ? 'opacity-50' : ''"
            class="absolute left-0 bottom-5 flex w-full justify-center items-center overflow-hidden"
        >
            <textarea
            :disabled="showWizard"
            @keydown.enter.prevent="generateContent"
            @input="adjustHeight"
            v-model="userInput"
            ref="textarea"
            class="disabled:bg-white w-[calc(100vw-70px)] md:w-[calc(100%-40px)] rounded-lg min-h-16 h-full pl-5 pt-2 dark:bg-darkgrey dark:text-white dark:placeholder:text-white border border-light-100 focus:outline-purple-dark resize-none overflow-hidden"
            placeholder="Input a topic or leave it blank to generate a random topic"
            rows="1"
            ></textarea>
            <NuxtIcon
            name="ArrowUp"
            @click="generateContent"
            class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer right-3 bg-purple-dark w-10 h-10 mr-5 text-white text-2xl rounded-lg"
            />
        </div> -->

    <ContentaiPromptInput />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-appear-active {
  transition: opacity 0.3s, transform 0.4s;
  /* Initial state: scale down to 90% and fully transparent */
  transform: scale(0.9);
  opacity: 0;
}
.fade-enter-to,
.fade-appear-to {
  /* Final state: scale to 100% and fully opaque */
  transform: scale(1);
  opacity: 1;
}
.fade-leave-active {
  transition: opacity 0.3s, transform 0.4s;
  /* Leave starts at the normal size */
  transform: scale(1);
  opacity: 1;
}
.fade-leave-to {
  /* Ends at a scaled down size and fully transparent */
  transform: scale(0.9);
  opacity: 0;
}
</style>
