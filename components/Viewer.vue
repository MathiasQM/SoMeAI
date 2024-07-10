<script setup lang="ts">
import NewContent from "@/components/dialogs/Wizard/NewContent.vue";
import { useGloabalState } from "@/stores/ui/useGlobalState";
import { usePersonaStore } from "@/stores/content/usePersonaStore";
import { useDialogStore } from "@/stores/ui/useDialogStore";
import { useUserStore } from "@/stores/Users/useUserStore";

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

const route = useRoute();
</script>

<template>
  <div
    class="relative custom-scrollbar overflow-hidden transition-all w-full h-screen bg-grey-50 bg-light-50 dark:bg-black"
  >
    <LayoutTopNav :isEditorNav="route.path === '/contentai' ? true : false" />
    <div class="relative h-full custom-scrollbar flex flex-wrap gap-5">
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
    <!-- <ContentaiPromptInput /> -->
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
