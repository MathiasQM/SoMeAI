<script setup lang="ts">
// Stores
import { useUserStore } from "@/stores/Users/useUserStore";
import { useDialogStore } from "@/stores/ui/useDialogStore";
import { useGloabalState } from "@/stores/ui/useGlobalState";
import { usePersonaStore } from "@/stores/content/usePersonaStore";

const globalStateStore = useGloabalState();
const { isMobileNavOpen } = storeToRefs(globalStateStore);

const contentStore = useContentStore();
const { sessions, selectedSession, contentPurpose } = storeToRefs(contentStore);

const personaStore = usePersonaStore();
const { personaNames, selectedPersonaName } = storeToRefs(personaStore);

const userStore = useUserStore();
const { userAuth } = storeToRefs(userStore);

// Constants
const showElement = ref<boolean>(true);
const positionY = ref<number>(30); // to hold the position of the div
const showSubmenu = ref<boolean>(false);
const selectedSessionContext = ref<object>({});

const toggleElement = (): void => {
  showElement.value = !showElement.value;
  console.log(showElement.value);
};

const route = useRoute();
const createNewContent = () => {
  selectedSession.value = "";
};

const handleSubmenu = (purpose) => {
  if (route.path !== "/contentai") {
    navigateTo("/contentai", { external: false });
    selectedSession.value = sessions.value[0];
  }
  if (purpose === "") {
    selectedSession.value = "";
  }
  contentPurpose.value = purpose;
  showSubmenu.value = !showSubmenu.value;
};
</script>

<template>
  <div
    v-if="isMobileNavOpen"
    @click="isMobileNavOpen = false"
    class="w-screen h-screen absolute bg-light-950/50 z-20"
  ></div>
  <div
    :class="isMobileNavOpen ? 'left-0 top-0' : 'top-0 -left-[100%] md:left-0'"
    class="transition-all duration-500 bg-white absolute z-20 md:relative w-screen h-screen sm:max-w-[300px] md:w-[auto] border-r border-light-100"
  >
    <div class="flex items-center justify-between m-5 w-56">
      <p class="text-p text-purple-500">BrandBrain AI</p>
      <div
        class="transition-all hover:bg-purple-dark/10 cursor-pointer rounded-full w-10 h-10 flex items-center justify-center"
      >
        <NuxtIcon @click="isMobileNavOpen = false" name="Close" class="md:hidden text-purple-dark text-2xl" />
      </div>
    </div>

    <div class="relative w-full">
      <!-- Main Sidebar -->
      <div :class="['sidebar', showSubmenu ? 'off-screen' : 'on-screen']" class="flex flex-col gap-2 h-auto">
        <p class="text-xsmall font-medium px-4">Persona</p>
        <FormsSelectPersona
          :useLocalStorage="true"
          :selected="personaNames[0]"
          name="selectedPersona"
          :options="personaNames"
          v-model="selectedPersonaName"
          placeholder="Select a persona..."
        />
        <p class="text-xsmall font-medium px-4">Pages</p>
        <NuxtLink
          @click="isMobileNavOpen = false"
          to="/"
          class="w-full transition-all cursor-pointer text-small text-light-700 hover:text-purple-600 hover:bg-purple-100 rounded-md py-1 px-4 flex items-center gap-3"
          ><NuxtIcon name="Dashboard" filled />Dashboard</NuxtLink
        >
        <NuxtLink
          @click="isMobileNavOpen = false"
          to="/personas"
          class="w-full transition-all cursor-pointer text-small text-light-700 hover:text-purple-600 hover:bg-purple-100 rounded-md py-1 px-4 flex items-center gap-3"
          ><NuxtIcon name="Users" filled />Personas</NuxtLink
        >
        <NuxtLink
          @click="isMobileNavOpen = false"
          to="/calendar"
          class="w-full transition-all cursor-pointer text-small text-light-700 hover:text-purple-600 hover:bg-purple-100 rounded-md py-1 px-4 flex items-center gap-3"
          ><NuxtIcon name="Calendar" filled />Content Calendar</NuxtLink
        >
        <p class="text-xsmall font-medium mt-5 px-4">Create</p>
        <button
          @click="handleSubmenu('Content')"
          class="transition-all cursor-pointer text-small text-light-700 hover:text-purple-600 hover:bg-purple-100 rounded-md py-1 px-4 flex items-center gap-3"
        >
          <NuxtIcon name="Content" filled />Content
        </button>
        <button
          @click="handleSubmenu('Campaign')"
          class="transition-all cursor-pointer text-small text-light-700 hover:text-purple-600 hover:bg-purple-100 rounded-md py-1 px-4 flex items-center gap-3"
        >
          <NuxtIcon name="Campaign" filled />Campaigns
        </button>
        <button
          @click="handleSubmenu('Automation')"
          class="transition-all cursor-pointer text-small text-light-700 hover:text-purple-600 hover:bg-purple-100 rounded-md py-1 px-4 flex items-center gap-3"
        >
          <NuxtIcon name="Bolt" filled />Automations
        </button>
      </div>

      <!-- Submenu Sidebar -->
      <div :class="['sidebar', showSubmenu ? 'on-screen' : 'off-screen']">
        <DropdownsNavitem title="Content" link="/contentai" icon="Content" :sessions="sessions">
          <div class="flex justify-between">
            <div
              @click="handleSubmenu('')"
              class="flex items-center justify-center mb-5 cursor-pointer text-purple-600 bg-light-100 hover:bg-purple-600 hover:text-white rounded-md w-8 h-8 mr-2"
            >
              <NuxtIcon name="ChevronLeft" class="text-3xl" filled />
            </div>
            <button
              class="mb-5 cursor-pointer text-xsmall text-purple-600 bg-light-100 hover:bg-purple-600 hover:text-white rounded-md w-8 h-8 ml-2"
              @click="createNewContent"
            >
              New
            </button>
          </div>
        </DropdownsNavitem>
      </div>
    </div>

    <div class="absolute bottom-0 w-[100%] rounded-lg h-20 p-2 flex flex-col justify-end items-center gap-2">
      <button class="flex items-center left-0"><NuxtIcon name="Help" filled />Help & Support</button>
      <div class="w-full border-t border-light-100 flex items-center justify-between gap-3 p-2 pt-4">
        <div class="flex gap-3">
          <span class="w-5 h-5 bg-light-200 block rounded-full"></span>
          <p class="text-small whitespace-nowrap">{{ userAuth?.email }}</p>
        </div>
        <NuxtIcon name="Options" class="text-lg" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  position: absolute;
  z-index: 20;
  padding: 5px;
  width: 100%;
  /* overflow-y: scroll; */
  transition: left 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.on-screen {
  left: 0;
  opacity: 1;
}

.off-screen {
  left: -100%;
  opacity: 0;
}
</style>
<!-- <style scoped>
  .router-link-active {
    color: #5d30f7;
    background-color: #e9e8ff;
  }
   .router-link-exact-active {
    color: #7b61ff;
  }
  .accordion {
  max-height: 600px; /* Set a maximum height for your accordion content */
  overflow: hidden;
  transition: top 0.5s ease-in-out, height 0.5s ease-in-out;
  position: relative;
  bottom: 0px;
  z-index: -1;
  background-color: rgb(231 231 231);
}
</style> -->
