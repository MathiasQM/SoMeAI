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
    <div @click="stopZoomAndDrag = true" :style="contentStyle" class="flex gap-5 items-center">
      <slot name="zoomable"></slot>
    </div>

    <!-- <slot name="static"></slot> -->

    <button
      v-if="isTransformed"
      @click="resetTransform"
      class="reset-button bg-white py-2 px-2 rounded-md text-purple-dark text-psmall border border-white hover:border-purple-dark transition-all"
    >
      Reset
    </button>
  </div>
</template>

<script setup>
const contentStore = useContentStore();
const { stopZoomAndDrag } = storeToRefs(contentStore);

const container = ref(null);
const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const isMouseDown = ref(false);
const isTransformed = computed(() => scale.value !== 1 || offsetX.value !== 0 || offsetY.value !== 0);
const lastMousePosition = ref({ x: 0, y: 0 });
const velocity = ref({ x: 0, y: 0 });
const contentStyle = ref({});
const friction = 0.9; // Adjust for "slower" or "faster" deceleration

let momentumId;

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
    offsetX.value += (mouseX - offsetX.value) * (1 - ratio);
    offsetY.value += (mouseY - offsetY.value) * (1 - ratio);
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
    transformOrigin: "0 0",
  };
}

function resetTransform() {
  scale.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
  contentStyle.value = {
    ...contentStyle.value,
    transform: `translate(0px, 0px) scale(1)`,
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
  top: 10px;
  right: 10px;
  z-index: 100;
}
</style>
~/stores/useContentStore
