
import type { DropdownsTools } from '#build/components';
<script setup lang="ts">
const props = defineProps({
  BgColor: {
    type: String,
    required: true,
  },
  Size: {
    type: Number,
    required: false,
    default: 1,
  },
  title: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: false,
    default: '',
  },
});

</script>

<template>
    <div
    :class="BgColor === 'bg-purple-dark' ? 'bg-purple-dark text-white' : ' bg-white dark:bg-[#161616] text-black dark:text-white', Size === 2 ? 'h-96' : 'h-52'" 
    class="transition-all p-5 rounded-lg dash-shadow grow-1 border border-light-100 dark:border-light-950">
    <div class="flex justify-between">
        <p>{{ title }}</p>
        <div class="transition-all w-8 h-8 flex justify-center items-center hover:bg-white/10 rounded-full cursor-pointer">
          <DropdownsTools :drawerSize="300" :size="3" iconName="Options">
            <div class="text-psmall p-2 flex flex-col gap-2">
              <div class="text-psmall flex flex-col gap-2">
                <NuxtLink class="text-black dark:text-white hover:bg-purple-dark/10 hover:text-purple-dark dark:hover:text-purple-dark rounded-md py-2 px-4 cursor-pointer ">Remove</NuxtLink>
              </div>
            </div>
          </DropdownsTools>
        </div>
      </div>
      <slot></slot>

    </div>
</template>