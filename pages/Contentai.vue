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
    <div
      v-show="selectedSession !== ''"
      class="flex flex-col items-center gap-5 w-full h-full relative overflow-x-hidden"
    >
      <div class="flex items-start gap-5 w-full h-full relative">
        <!-- <ContentaiZoomContainer>
          <template v-slot:zoomable> -->
        <div
          v-for="(result, i) in selectedSessionResults"
          :key="result.id"
          class="w-full flex justify-center items-center h-full fade-item"
        >
          <PlatformPreviewsWrapper :result="result" @openEditor="openEditor(i)" />
        </div>
        <!-- </template>
    </ContentaiZoomContainer> -->
        <PlatformPreviewsEditor
          :result="selectedSessionResults[editorIndex]"
          :isEditable="isEditorOpen"
          @closeEditor="(isEditorOpen = false), (editorIndex = null)"
        />
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
