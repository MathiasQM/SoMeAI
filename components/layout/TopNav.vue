<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useGloabalState } from "@/stores/ui/useGlobalState";

const props = defineProps({
  isEditorNav: {
    type: Boolean,
    default: false,
  },
});

const auth = getAuth();

// const { colorMode, cycleColorMode } = useColorTheme();
const searchDialog = ref(false);
provide("searchDialog", searchDialog);
const publishDialog = ref(false);
provide("publishDialog", publishDialog);
const globalStateStore = useGloabalState();
const { isMobileNavOpen } = storeToRefs(globalStateStore);
const contentStore = useContentStore();
const { selectedSession } = storeToRefs(contentStore);

// Example of how you might use the selected persona
// watch(selectedPersona, (newVal) => {
//   console.log("Selected persona:", newVal);
// });

// const handleSignOut = async () => {
//   await signOut(auth)
//     .then(async() => {
//         // await clearSessionCookie()
//       console.log("Sign-out successful");
//       navigateTo("https://tradeddomains.com/", {external: true});
//     })
//     .catch((error) => {
//       // An error happened.
//       console.log("An error happened");
//     });
// };
const route = useRoute();
const showContentTools = computed(() => {
  return route.path === "/contentai";
});
</script>

<template>
  <div
    v-if="isEditorNav"
    class="absolute z-10 mx-5 mt-2 w-[calc(100vw-70px)] md:w-[calc(100%-40px)] h-[70px] rounded-md px-5 flex items-center justify-between"
  >
    <template v-if="!isEditorNav">
      <div class="flex items-center gap-5 w-1/3">
        <div
          @click="isMobileNavOpen = true"
          class="flex md:hidden cursor-pointer bg-white rounded-md border border-light-100 h-10 p-2 py-2"
        >
          <NuxtIcon name="Nav" class="text-2xl text-lightgrey" />
        </div>
        <div
          :class="showContentTools && selectedSession !== '' ? 'opacity-1' : 'opacity-0'"
          class="group transition-all bg-white w-32 h-10 rounded-lg border border-creme flex items-center justify-around relative z-10 p-1 py-2"
        >
          <p class="text-xsmall text-light-500 absolute -top-5 left-0">Tools</p>
          <div class="transition-all group flex items-center justify-center cursor-pointer">
            <span class="transition-all bg-creme/0 w-8 h-8 rounded-md absolute -z-0 group-hover:bg-creme"></span>
            <NuxtIcon name="Add" class="text-2xl text-purple-dark relative z-10" />
          </div>
        </div>
      </div>
      <!-- TODO: Implement logic to change view -->
      <div v-if="showContentTools && selectedSession !== ''" class="w-1/3 flex justify-center">
        <div
          :class="showContentTools && selectedSession !== '' ? 'opacity-1' : 'opacity-0'"
          class="group transition-all bg-white w-32 h-10 rounded-lg border border-creme flex items-center justify-around relative z-10 p-1 py-2"
        >
          <p class="text-xsmall text-light-500 absolute -top-5">Views</p>
          <div class="transition-all group flex items-center justify-center cursor-pointer">
            <span class="transition-all bg-creme/0 w-8 h-8 rounded-md absolute -z-0 group-hover:bg-creme"></span>
            <NuxtIcon name="Grid" class="text-2xl text-purple-dark relative z-10" />
          </div>
          <div class="transition-all group flex items-center justify-center cursor-pointer">
            <span class="transition-all bg-creme/0 w-8 h-8 rounded-md absolute -z-0 group-hover:bg-creme"></span>
            <NuxtIcon name="ViewSidebar" class="text-2xl text-lightgrey hover:text-purple-dark relative z-10" />
          </div>
          <div class="transition-all group flex items-center justify-center cursor-pointer">
            <span class="transition-all bg-creme/0 w-8 h-8 rounded-md absolute -z-0 group-hover:bg-creme"></span>
            <NuxtIcon name="Gant" class="text-2xl text-lightgrey hover:text-purple-dark relative z-10" filled />
          </div>
          <div class="absolute top-10 w-44 group-hover:flex bg-darkgrey rounded-lg justify-center text-white hidden">
            <p class="text-center">Hardcoded content</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-5 text-lightgrey w-1/3">
        <div
          :class="showContentTools && selectedSession !== '' ? 'opacity-1' : 'opacity-0'"
          class="group transition-all bg-white w-32 h-10 rounded-lg border border-creme flex items-center justify-around relative z-10 p-1 py-2"
        >
          <p class="text-xsmall text-light-500 absolute -top-5 right-0">Publish</p>
          <button
            @click="publishDialog = true"
            :class="showContentTools && selectedSession !== '' ? 'opacity-1' : 'opacity-0'"
            class="group transition-all text-small rounded-md"
          >
            Publish
          </button>
        </div>
        <!-- <DropdownsTools :drawerSize="300" iconName="Language" key="Language" >
                    <div class="text-psmall p-5 flex flex-col gap-2">
                        <p class="text-psmall text-black text-center md:text-left dark:text-white">Language Hardcoded</p>
                        
                        <p class="text-purple-dark dark:text-white hover:bg-purple-dark/10 hover:text-purple-dark dark:hover:text-purple-dark rounded-md py-2 px-4 cursor-pointer ">English</p>
                        <p class="text-black dark:text-white hover:bg-purple-dark/10 hover:text-purple-dark dark:hover:text-purple-dark rounded-md py-2 px-4 cursor-pointer ">Dansk</p>
                    </div>
                </DropdownsTools>
                <DropdownsTools :size="2" key="Notifications" iconName="Notifications" >
                    <div class="text-psmall p-5 flex flex-col gap-2">
                        <p class="text-psmall text-black text-center md:text-left dark:text-white">Notifications hardcoded</p>
                        <div class="transition-all cursor-pointer flex items-center gap-5  hover:bg-purple-dark/10 hover:text-purple-dark dark:hover:text-purple-dark rounded-md py-2 px-4">
                            <div class="bg-red/10 w-10 h-10 aspect-square rounded-full flex justify-center items-center">
                                <NuxtIcon class="text-red" name="Warning" filled/>                            
                            </div>
                            <div class="flex flex-col">
                                <NuxtLink class="text-black dark:text-white text-psmall py-2 w-[80%]">Payment failed!</NuxtLink>
                                <p class="text-xsmall text-black dark:text-white">We failed to renew your ownership of <span class="bg-red/10 text-red rounded-sm leading-10 p-1">mathiasqm.dk</span>. Click to make payment.</p>
                            </div>
                        </div>
    
                        <div class="transition-all cursor-pointer flex items-center gap-5  hover:bg-purple-dark/10 hover:text-purple-dark dark:hover:text-purple-dark rounded-md py-2 px-4">
                            <div class="bg-purple-dark/10 w-10 h-10 aspect-square rounded-full flex justify-center items-center">
                                <NuxtIcon class="text-purple-dark" name="Auction" filled/>                            
                            </div>
                            <div class="flex flex-col">
                                <NuxtLink class="text-black dark:text-white text-psmall py-2 w-[80%]">Sold!</NuxtLink>
                                <p class="text-xsmall text-black dark:text-white">Your domain "mathiasqm.dk" was auctioned for: <span class="bg-green/20 text-green rounded-sm leading-10 p-1">$100</span></p>
                            </div>
                        </div>
                    </div>
                </DropdownsTools> -->
        <!-- <div class="flex md:hidden cursor-pointer bg-white rounded-md border border-light-100 h-10 p-2 py-2">
                    <NuxtIcon
                        class="cursor-pointer transition-all text-[22px]"
                        @click="cycleColorMode"
                        :class="{ 'text-lightgrey': colorMode.value === 'light' }"
                        :name="colorMode.value"
                        filled
                    />
         
                </div> -->
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
  <!-- <DialogsSearch /> -->
</template>

<style scoped>
.fade-enter-active,
.fade-appear-active {
  transition: opacity 0.3s, transform 0.4s;
  transform: translate(20px, -20px); /* Start from top-right */
  opacity: 0;
}
.fade-enter-to,
.fade-a2pear-to {
  transform: translate(0, 0); /* End at element's original position */
  opacity: 1;
}
.fade-leave-active {
  transition: opacity 0.3s, transform 0.4s;
  transform: translate(0, 0); /* Start at element's original position */
  opacity: 1;
}
.fade-leave-to {
  transform: translate(20px, -20px); /* End at bottom-left */
  opacity: 0;
}
</style>
~/stores/useContentStore
