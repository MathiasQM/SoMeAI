<script setup>
import { useUserStore } from "@/stores/Users/useUserStore";
import { useDialogStore } from "@/stores/ui/useDialogStore";
import CampaignWiz from "~/components/dialogs/Wizard/CampaignWiz.vue";
import PlatformPreviewsInstagram from "~/components/platformPreviews/Instagram.vue";
import PlatformPreviewsFacebook from "~/components/platformPreviews/Facebook.vue";

const dynamicComponent = shallowRef(CampaignWiz);

const userStore = useUserStore();
const { userAuth } = storeToRefs(userStore);

const contentStore = useContentStore();
const { selectedSessionResults, selectedSession, userInput, stopZoomAndDrag } = storeToRefs(contentStore);

const openLightBoxId = ref(null); // This will hold the ID of the component that is open in the lightbox

// Function to open the lightbox for a specific component
const openLightBox = (id) => {
  console.log("openLightBox", id);
  openLightBoxId.value = id;
  stopZoomAndDrag.value = false;
};

// Function to handle content generation
const generateContent = () => {
  if (!userInput.value.trim()) {
    alert("Please input a topic or leave it blank for a random topic.");
    return;
  }
  // Assuming the store has a method to handle content generation
  console.log(userInput.value);
  contentStore.generateContentForChannel(userInput.value);
};

const channelToComponentMap = {
  Facebook: PlatformPreviewsFacebook,
  Instagram: PlatformPreviewsInstagram,
};

// Function to get component based on channel
const getComponentForChannel = (channel) => {
  return channelToComponentMap[channel] || null;
};

const saveNewContent = (index) => {
  contentStore.updateSelectedSession(index);
  openLightBoxId.value = null;
  stopZoomAndDrag.value = false;
};

const dialogStore = useDialogStore();
const { showDialog } = storeToRefs(dialogStore);

onMounted(() => {
  showDialog.value = true;
});
</script>

<template>
  <div class="flex flex-col gap-5 w-full h-full relative overflow-x-hidden">
    <div
      v-if="selectedSessionResults.length <= 0 || selectedSession === ''"
      class="bg-light-50 dark:bg-darkgrey w-full h-full overflow-hidden rounded-lg"
    >
      <div class="h-[calc(84vh-70px)] flex justify-center items-center">
        <component :is="dynamicComponent" />
      </div>
    </div>
    <div
      v-show="selectedSessionResults.length > 0"
      class="flex flex-col items-center gap-5 w-full h-full relative overflow-x-hidden"
    >
      <div class="flex items-start gap-5 w-full h-full relative overflow-hidden">
        <ContentaiZoomContainer>
          <template v-slot:zoomable>
            <div
              v-for="(result, i) in selectedSessionResults"
              :key="result.id"
              class="w-full flex justify-center items-center h-full fade-item"
            >
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
                    @click="openLightBox(i)"
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
            </div>
          </template>

          <!-- Content lightBox -->
          <template v-slot:static>
            <div class="z-10 cursor-pointer" style="position: absolute; top: 0; right: 0">
              <ClientOnly>
                <PlatformPreviewsLightBox v-if="openLightBoxId !== null" :isOpen="openLightBoxId !== null">
                  <div class="w-full flex justify-center">
                    <component
                      :is="getComponentForChannel(selectedSessionResults[openLightBoxId]?.channel)"
                      :result="selectedSessionResults[openLightBoxId]"
                      :isEditable="openLightBoxId !== null"
                    />
                  </div>
                  <div class="flex w-full justify-center items-center overflow-hidden">
                    <input
                      @keydown.enter="generateContent"
                      type="text"
                      v-model="userInput"
                      class="w-full rounded-lg h-16 pl-10 dark:bg-darkgrey dark:text-white dark:placeholder:text-white border-none focus:outline-purple-dark"
                      placeholder="Modify this post with AI"
                    />
                    <NuxtIcon
                      name="AI"
                      class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer left-0 w-10 h-10 mr-5 text-purple-dark text-xl rounded-lg"
                    />
                    <NuxtIcon
                      name="ArrowUp"
                      @click="generateContent"
                      class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer right-0 bg-purple-dark w-10 h-10 mr-5 text-white text-2xl rounded-lg"
                    />
                  </div>

                  <!-- POST SETTINGS: KUNNE GODT VÆRE ET COMPONENT -->
                  <div class="fixed right-0 top-0 bg-white w-96 h-full flex flex-col p-10">
                    <div class="relative h-full">
                      <p class="text-p font-semibold text-purple-dark">Post settings</p>

                      <p>
                        Her skal der være indstillinger. Globale Som hvornår det skal postes, eller specifikke
                        instillinger til denne post type SEO, instagram #tag m.m
                      </p>
                      <br />
                      <p>Alt efter dit abonnement kan du også vælge at "planlægge, hvornår dette post skal gå live"</p>
                      <div class="flex justify-center gap-2 w-full absolute bottom-10">
                        <button
                          class="text-psmall text-black bg-creme py-2 px-4 rounded-md w-32"
                          @click.stop="(openLightBoxId = null), (stopZoomAndDrag = false)"
                        >
                          Cancel
                        </button>
                        <button
                          class="text-psmall text-white bg-purple-dark py-2 px-4 rounded-md w-32"
                          @click.stop="saveNewContent(openLightBoxId)"
                        >
                          Save
                        </button>
                        <button
                          class="text-psmall text-white bg-purple-dark py-2 px-4 rounded-md w-32"
                          @click.stop="saveNewContent(openLightBoxId)"
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                  <!-- POST SETTINGS END: KUNNE GODT VÆRE ET COMPONENT -->
                </PlatformPreviewsLightBox>
              </ClientOnly>
            </div>
          </template>
        </ContentaiZoomContainer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
