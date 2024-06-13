<script setup lang="ts">
const props = defineProps({
    showDrawer: Boolean,
    data: String,
    title: String,
})



const emit = defineEmits(['update:showDrawer']);

const showElement = ref(true);


const toggleElement = (): void => {
    showElement.value = !showElement.value;
};

watch(() => props.showDrawer, (newValue) => {
    showElement.value = newValue;
    toggleElement();
});


</script>

<template>
    <div class="w-full flex flex-col transition-all">
        <div @click="toggleElement" class="w-full flex justify-between cursor-pointer border border-creme bg-white rounded-md px-4 py-2 items-center relative z-10">
            <p type="button" class="flex items-center font-medium relative transition-all group text-xsmall first-letter:uppercase">{{ title }}</p>
            <NuxtIcon :class="showElement === true ? 'rotate-180' : 'rotate-0'" name="ArrowUp" filled class="absolute transition-all right-4 w-[16px] h-[16px] fill-purple-dark text-purple-dark stroke-purple-dark"/>
        </div>
        <transition name="fade">
            <div class="accordion flex items-center w-full px-5 bg-purple-dark/20 rounded-b-lg -top-1 text-xsmall font-medium" :style="{ height: showElement ? '180px' : '0' }">
                <p class="text-purple-dark text-center ">{{ data }}</p>
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
  max-height: 800px; /* Set a maximum height for your accordion content */
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  position: relative;
  z-index: 1;
}
.draggable {
  cursor: grab;
}
</style>