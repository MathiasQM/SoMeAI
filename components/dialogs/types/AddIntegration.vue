<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "",
  },
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const integrations = ref([
  {
    platform: "Facebook",
    handle: "Facebook handle",
    isActive: false,
    id: "1",
  },
  {
    platform: "Instagram",
    handle: "Instagram handle",
    isActive: true,
    id: "2",
  },
  {
    platform: "LinkedIn",
    handle: "LinkedIn handle",
    isActive: false,
    id: "3",
  },
]);
</script>

<template>
  <div>
    <div class="transition-all border-b border-creme dark:border-lightdark p-5 flex items-center gap-5">
      <NuxtIcon name="Add" filled class="transition-all text-purple-dark text-2xl" />
      <input
        type="search"
        class="transition-all text-lightgrey w-full dark:bg-darkgrey"
        placeholder="Search integrations"
      />
    </div>

    <div class="p-5 flex flex-col gap-3 overflow-y-scroll h-[400px]">
      <p class="transition-all text-lightgrey">Add an integration</p>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="(channel, i) in integrations"
          :key="channel + i"
          class="transition-all flex gap-2 items-center justify-between border border-creme px-2 py-4 rounded-md hover:border-purple-dark cursor-pointer"
        >
          <NuxtIcon :name="channel.platform" filled />
          <p class="text-xsmall font-medium">{{ channel.platform }}</p>
          <FormsSwitch v-model="channel.isActive" />
          <!-- @click.stop="updateIntegrationInFirebase" -->
        </div>
      </div>
    </div>
  </div>
</template>
