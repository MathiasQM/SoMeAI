<script setup lang="ts">
const props = defineProps({
    showDrawer: Boolean,
    drawerSize: {
        type: Number,
        required: false,
        default: 600,
    },
})
const emit = defineEmits(['update:showDrawer']);

const showElement = ref(true);

let isDragging = false;
let startY = 0;
const positionY = ref<number>(100); // to hold the position of the div

const toggleElement = (): void => {
    showElement.value = !showElement.value;
};

watch(() => props.showDrawer, (newValue) => {
    showElement.value = newValue;
    toggleElement();
});

const startDrag = (clientY: number): void => {
  isDragging = true;
  startY = clientY;
};

const moveDrag = (clientY: number): void => {
  if (isDragging) {
    const deltaY = clientY - startY;

    // Only update positionY if dragging downward
    if (deltaY > 0) {
      positionY.value += deltaY;
      startY = clientY;
    }
  }
};


const endDrag = (): void => {
  if (positionY.value > 150) { // You can change this threshold
    emit('update:showDrawer', !props.showDrawer);
    toggleElement();
    positionY.value = 100;
  }
  isDragging = false;
};

const closeOnBackdrop = (): void => {
    emit('update:showDrawer', !props.showDrawer);
    toggleElement();
    positionY.value = 100;
  isDragging = false;
};

const handleTouchStart = (e: TouchEvent): void => startDrag(e.touches[0].clientY);
const handleTouchMove = (e: TouchEvent): void => {
  e.preventDefault();
  moveDrag(e.touches[0].clientY);
};
const handleTouchEnd = (): void => endDrag();

const route = useRoute();
watch(() => route.name, (newValue) => {
  // console.log(newValue);
  if (props.showDrawer === true) {
    emit('update:showDrawer', props.showDrawer);
    showElement.value = true;
    positionY.value = 100;
  }
  isDragging = false;
});


</script>

<template>
    <!-- <div v-if="!showElement"  @click="closeOnBackdrop" class="relative z-10 bg-red -top-5 -left-5 w-screen h-screen"></div> -->
    <div class="fixed bottom-0 left-0 -z-1 w-full flex md:hidden flex-col justify-start">
      <transition name="fade">
        <div @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" class="z-20 draggable accordion dark:bg-lighterdark dark:shadow-none bg-white dash-shadow rounded-t-xl w-full lg:w-full"
        :style="{ height: showElement ? '0' : drawerSize + 'px', top: `${positionY}px`, maxHeight: `${drawerSize}px` }">
        <div class="px-5 pt-10 w-full">
          <div class="flex flex-col items-center w-full">
            <span class="lg:hidden w-10 h-1 rounded-full relative top-[-20px] bg-lightgrey"></span>
          </div>
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>


<style scoped>
  .router-link-active {
    color: #a2bc0c;
  }
   .router-link-exact-active {
    color: #a2bc0c;
  }
  .accordion {
  overflow: hidden;
  transition: top 0.5s ease-in-out, height 0.5s ease-in-out;
  position: relative;
  top: -18px;
  z-index: -1;
  /* height: 300px; */
}
.draggable {
  cursor: grab;
}
</style>