<template>
  <div
    ref="container"
    class="zoom-container flex items-center justify-center"
    @wheel.prevent="handleScroll"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @mousemove="handleMouseMove"
    style="overflow: hidden; position: relative; width: 100%; height: 100%"
  >
    <div :style="contentStyle" class="content">
      <slot name="zoomable"></slot>
    </div>

    <button
      @click="resetTransform"
      class="reset-button bg-white py-2 px-2 rounded-md text-purple-dark text-xsmall border border-light-100 hover:border-purple-dark transition-all"
    >
      Re-center
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useContentStore } from "@/stores/useContentStore";
import { storeToRefs } from "pinia";

const contentStore = useContentStore();
const { stopZoomAndDrag } = storeToRefs(contentStore);

const props = defineProps({
  itemCount: {
    type: Number,
    required: true,
  },
});

const container = ref(null);
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isMouseDown = ref(false);
const lastMousePosition = ref({ x: 0, y: 0 });
const velocity = ref({ x: 0, y: 0 });
const contentStyle = ref({});
const friction = 0.9; // Adjust for "slower" or "faster" deceleration

let momentumId;

// Scale mapping based on item count
const scaleMapping = {
  0: 1,
  1: 1,
  2: 0.9,
  3: 0.75,
  4: 0.75,
};

function getScaleForItemCount(count) {
  return scaleMapping[count] !== undefined ? scaleMapping[count] : 0.5;
}

// Adjust the zoom based on the number of items
const computedScale = computed(() => {
  return getScaleForItemCount(props.itemCount);
});

watch(computedScale, (newScale) => {
  scale.value = newScale;
  centerContent();
});

watch(
  () => props.itemCount,
  () => {
    scale.value = computedScale.value;
    centerContent();
  }
);

function centerContent() {
  const rect = container.value.getBoundingClientRect();
  offsetX.value = 0;
  offsetY.value = 0;
  updateContentStyle();
}

function handleScroll(event) {
  if (stopZoomAndDrag.value) return;
  const zoomIntensity = 0.1;
  const direction = event.deltaY < 0 ? 1 : -1;
  const newScale = Math.max(0.2, Math.min(scale.value + direction * zoomIntensity, 5)); // Adjust max scale as needed

  if (newScale !== scale.value) {
    const rect = container.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const ratio = newScale / scale.value;

    offsetX.value = mouseX - (mouseX - offsetX.value) * ratio;
    offsetY.value = mouseY - (mouseY - offsetY.value) * ratio;
    scale.value = newScale;
    updateContentStyle();
  }
}

function handleMouseDown(event) {
  if (stopZoomAndDrag.value) return;
  isMouseDown.value = true;
  lastMousePosition.value = { x: event.clientX, y: event.clientY };
  if (momentumId) {
    clearInterval(momentumId);
    momentumId = null;
  }
}

function handleMouseMove(event) {
  if (stopZoomAndDrag.value) return;
  if (!isMouseDown.value) return;

  const dx = event.clientX - lastMousePosition.value.x;
  const dy = event.clientY - lastMousePosition.value.y;
  offsetX.value += dx;
  offsetY.value += dy;
  lastMousePosition.value = { x: event.clientX, y: event.clientY };
  velocity.value = { x: dx, y: dy };

  updateContentStyle();
}

function handleMouseUp() {
  if (stopZoomAndDrag.value) return;
  if (isMouseDown.value) {
    isMouseDown.value = false;
    startMomentum();
  }
}

function updateContentStyle() {
  contentStyle.value = {
    transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
    transformOrigin: "center center", // Ensure the content scales from the center
  };
}

function resetTransform() {
  scale.value = computedScale.value;
  centerContent();
  contentStyle.value = {
    ...contentStyle.value,
    transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
    transition: "transform 0.5s ease-out", // Smooth transition back to default
  };

  velocity.value = { x: 0, y: 0 };
  if (momentumId) {
    clearInterval(momentumId);
    momentumId = null;
  }
}

function startMomentum() {
  if (momentumId) clearInterval(momentumId);
  momentumId = setInterval(() => {
    offsetX.value += velocity.value.x;
    offsetY.value += velocity.value.y;
    velocity.value.x *= friction;
    velocity.value.y *= friction;

    if (Math.abs(velocity.value.x) < 0.1 && Math.abs(velocity.value.y) < 0.1) {
      clearInterval(momentumId);
      momentumId = null;
    }

    updateContentStyle();
  }, 10);
}
</script>

<style scoped>
.zoom-container {
  cursor: grab;
  user-select: none;
}

.zoom-container:active {
  cursor: grabbing;
}

.reset-button {
  position: absolute;
  bottom: 2%;
  left: 20px;
  z-index: 100;
}
</style>
