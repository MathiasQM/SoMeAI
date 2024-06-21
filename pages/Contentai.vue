<script setup>
import CampaignWiz from "~/components/dialogs/Wizard/CampaignWiz.vue";

const isEditorOpen = ref(false);
const editorIndex = ref(null);
const dynamicComponent = shallowRef(CampaignWiz);
const openEditor = (index) => {
  editorIndex.value = index;
  isEditorOpen.value = true;
};

const contentStore = useContentStore();
const { selectedSessionResults, selectedSession, userInput, stopZoomAndDrag } = storeToRefs(contentStore);
</script>

<template>
  <div class="flex flex-col gap-5 w-full h-full relative overflow-x-hidden">
    <div v-if="selectedSession === ''" class="bg-light-50 dark:bg-darkgrey w-full h-full overflow-hidden rounded-lg">
      <div class="h-[calc(84vh-70px)] flex justify-center items-center">
        <component :is="dynamicComponent" />
      </div>
    </div>

    <div class="flex items-start gap-5 w-full h-full relative">
      <ContentaiZoomContainer :itemCount="selectedSessionResults.length">
        <template v-slot:zoomable>
          <TransitionGroup
            v-show="selectedSession !== ''"
            tag="div"
            class="flex items-center justify-center flex-wrap gap-5 relative overflow-x-hidden"
            name="fade"
            :style="{ width: `${350 * selectedSessionResults.length + 300}px` }"
          >
            <div
              v-for="(result, i) in selectedSessionResults"
              :key="result.id"
              class="flex justify-center items-center w-auto h-auto fade-item"
            >
              <PlatformPreviewsWrapper
                :startAnimation="result.id ? true : false"
                :result="result"
                @openEditor="openEditor(i)"
              />
            </div>
          </TransitionGroup>
        </template>
      </ContentaiZoomContainer>
      <PlatformPreviewsEditor
        :result="selectedSessionResults[editorIndex]"
        :isEditable="isEditorOpen"
        @closeEditor="(isEditorOpen = false), (editorIndex = null)"
      />
    </div>
  </div>
</template>

<style>
/* .v-enter-from {
  opacity: 0;
  rotate: 180deg;
}
.v-enter-to {
  opacity: 1;
  rotate: 0deg;
}
.v-enter-active {
  transition: all 0.7s;
} */
</style>
