
import type { DropdownsDrawer } from '#build/components';
<script setup lang="ts">
const props = defineProps({
    iconName: {
        type: String,
        required: true,
    },
    iconColor: {
        type: String,
        required: false,
        default: 'text-lightgrey dark:text-white',
    },
    iconSize: {
        type: String,
        required: false,
        default: 'text-2xl',
    },
    bgColor: {
        type: String,
        required: false,
        default: 'bg-none dark:bg-none',
    },
    size: {
        type: Number,
        required: false,
        default: 1,
    },
    drawerSize: {
        type: Number,
        required: false,
        default: 600,
    },
    key: {
        type: String,
        required: false,
        default: '',
    },
    buttonText: {
        type: String,
        required: false,
        default: '',
    },
})

const toolsDialog = ref(false);
const showDrawer = ref(true);
</script>

<template>
    <div @click="toolsDialog = false, showDrawer = false" v-if="toolsDialog" class="absolute z-10 top-0 left-0 h-full w-full"></div>
    <div class="md:relative flex items-center ">
        <span v-if="!buttonText" :class="bgColor" class="w-6 h-6 rounded-full flex items-center justify-center">
            <NuxtIcon filled @click="toolsDialog = true, showDrawer = true" :name="iconName" :class="iconColor, iconSize" class="cursor-pointer" />
        </span>
        <button v-else @click="toolsDialog = true, showDrawer = true" class="bg-purple-dark text-white px-4 rounded-md py-2">{{ buttonText }}</button>
        <Transition name="fade" appear>
            <dialog :open="toolsDialog" @click="toolsDialog = false" v-if="toolsDialog" :class="size === 2 ? 'w-full md:w-96 md:-left-96 top-20 md:top-10' : size === 3 ? 'w-1/2 left-0 mt-10 md:w-44 md:-left-[170px]' : 'w-full left-[-00px] md:w-64 md:-left-60 top-20 md:top-10'"  class="absolute z-10 rounded-md text-white bg-white dash-shadow dark:shadow-none dark:bg-lightdark h-[full]">
                <slot />
            </dialog>
        </Transition>
    </div>
    <!-- <DropdownsDrawer :key="key" :drawerSize="drawerSize" :showDrawer="showDrawer" @update:showDrawer="showDrawer=false">
        <slot />
    </DropdownsDrawer> -->

</template>

<style scoped>
.fade-enter-active, .fade-appear-active {
  transition: opacity .3s, transform .4s;
  transform: translate(20px, -20px); /* Start from top-right */
  opacity: 0;
}
.fade-enter-to, .fade-a2pear-to {
  transform: translate(0, 0); /* End at element's original position */
  opacity: 1;
}
.fade-leave-active {
  transition: opacity .3s, transform .4s;
  transform: translate(0, 0); /* Start at element's original position */
  opacity: 1;
}
.fade-leave-to {
  transform: translate(20px, -20px); /* End at bottom-left */
  opacity: 0;
}
</style>