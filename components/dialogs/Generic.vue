<script setup>
import AddIntegration from "./types/AddIntegration.vue";
import EditIntegration from "./types/EditIntegration.vue";
import TagManager from "./types/tagManager.vue";
import AgeRange from "./types/AgeRange.vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },
  context: {
    type: String, // Global || Viewer
    required: true,
    default: "Viewer",
  },
});

const emit = defineEmits(["update:data", "update:sliderValue1", "update:sliderValue2"]);

const dynamicComponentProps = reactive({
  tagManager: {
    title: "Demographics",
    data: props.data,
  },
  addIntegration: {
    title: "test",
    data: props.data,
  },
  editIntegration: {
    title: "Integration Settings",
    data: props.data,
  },
  ageRange: {
    title: "Target Audience Age",
    data: props.data,
  },
});

const componentsMap = {
  tagManager: {
    styles: "",
    component: TagManager,
  },
  addIntegration: {
    styles: "",
    component: AddIntegration,
  },
  editIntegration: {
    styles: "",
    component: EditIntegration,
  },
  ageRange: {
    styles: "",
    component: AgeRange,
  },
};

const handleDataUpdate = (newData) => {
  console.log("newData:", newData);
  emit("update:data", newData);
  dynamicComponentProps[props.type].data = newData;
};

const handleDataAge = (newData) => {
  console.log("newData:", newData);
  emit("update:dataAge1", newData);
  // dynamicComponentProps[props.type].data = newData;
};
const handleDataAgeTwo = (newData) => {
  console.log("newData:", newData);
  emit("update:dataAge2", newData);
  // dynamicComponentProps[props.type].data = newData;
};

// Computed to select the correct component based on 'type'
const dynamicComponent = computed(() => componentsMap[props.type]);

// Reactive variable to control dialog visibility
const isDialogOpen = ref(false);

// THIS IS COMMENTED OUT AS OPENING WITH CMD+K WILL OPEN ALL DIALOGS
// const handleKeyPress = (event) => {
//   if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
//     isDialogOpen.value = true;  // Open the dialog
//   }
//   if (event.key === 'Escape') {
//     isDialogOpen.value = false;  // Open the dialog
//     isDynamicDialogOpen.value = false;
//   }
// };

// onMounted(() => {
//   window.addEventListener('keydown', handleKeyPress);
// });

// onUnmounted(() => {
//   window.removeEventListener('keydown', handleKeyPress);
// });
</script>

<template>
  <div @click="isDialogOpen = true">
    <slot></slot>
  </div>
  <Transition name="fade-bg" appear>
    <div
      v-show="isDialogOpen"
      :class="context === 'Viewer' ? 'absolute rounded-lg' : 'fixed'"
      class="z-20 transition-all fixed inset-0 bg-black bg-opacity-50"
      @click.stop="(isDialogOpen = false), (isDynamicDialogOpen = false)"
    ></div>
  </Transition>
  <Transition name="fade" appear>
    <dialog
      :open="isDialogOpen || isDynamicDialogOpen"
      v-if="isDialogOpen || isDynamicDialogOpen"
      :class="context === 'Viewer' ? 'absolute rounded-lg' : 'fixed'"
      class="z-20 transition-all bg-white dark:bg-darkgrey text-lightgrey smd:rounded-md w-full h-full smd:h-auto top-0 smd:top-[20%] rounded-none smd:w-2/3 lg:w-1/2 lg:max-w-[800px] overflow-y-scroll"
    >
      <div
        @click.stop="(isDialogOpen = false), (isDynamicDialogOpen = false)"
        class="absolute right-5 top-5 transition-all text-lightgrey flex items-center border rounded-sm py-1 px-2 text-xsmall"
      >
        <p class="transition-all text-lightgrey">esc</p>
      </div>

      <component
        :is="dynamicComponent.component"
        v-bind="dynamicComponentProps[type]"
        @update:data="handleDataUpdate"
        @update:sliderValue1="handleDataAge"
        @update:sliderValue2="handleDataAgeTwo"
      />
    </dialog>
  </Transition>
</template>

<style scoped>
/* Transition for background fade in/out */
.fade-bg-enter-active,
.fade-bg-leave-active {
  transition: opacity 0.3s;
  opacity: 0;
}
.fade-bg-enter-to,
.fade-bg-leave-to {
  opacity: 1;
}

.fade-enter-active,
.fade-appear-active {
  transition: opacity 0.3s, transform 0.4s;
  transform: translateY(50px);
  opacity: 0;
}
.fade-enter-to,
.fade-appear-to {
  transform: translateY(0);
  opacity: 1;
}
.fade-leave-active {
  transition: opacity 0.3s, transform 0.4s;
  transform: translateY(0);
  opacity: 1;
}
.fade-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
</style>
