<script setup>
const props = defineProps({
  context: {
    type: String, // Global || Viewer
    required: true,
    default: 'Viewer'
  },
  buttons: {
    type: Object,
    required: true,
    default: () => ({
      cancel: {text: 'Cancel'},
      confirm: {text: 'Generate'},
    })
  }
})

const emit = defineEmits(['confirm']);



// Reactive variable to control dialog visibility
const isDialogOpen = ref(false);

</script>

<template>
    <div @click="isDialogOpen = true">
      <slot name="Button"></slot>
    </div>
    <Transition name="fade-bg" appear>
      <div v-show="isDialogOpen" :class="context === 'Viewer' ? 'absolute rounded-lg' : 'fixed'" class="z-20 transition-all fixed inset-0 bg-black bg-opacity-50" @click.stop="isDialogOpen = false"></div>
    </Transition>
    <Transition name="fade" appear>
        <dialog :open="isDialogOpen" v-if="isDialogOpen" :class="context === 'Viewer' ? 'absolute rounded-lg' : 'fixed'" class="z-20 transition-all bg-white dark:bg-darkgrey text-lightgrey smd:rounded-md w-full h-full p-5 smd:h-auto top-0 smd:top-[20%] rounded-none smd:w-2/3 lg:w-1/2 lg:max-w-[800px] overflow-hidden">
          <div class="relative">
            <slot name="Text" />
          </div>
          <div class="flex justify-end gap-3 mt-10">
            <button @click="isDialogOpen = false" class="bg-light-100 text-black py-2 rounded-md w-28">{{buttons.cancel.text}}</button>
            <button @click="emit('confirm'), isDialogOpen = false" class="bg-purple-500 text-white py-2 rounded-md w-28">{{buttons.confirm.text}}</button>
          </div>
        </dialog>
      </Transition>
</template>


<style scoped>
/* Transition for background fade in/out */
.fade-bg-enter-active, .fade-bg-leave-active {
  transition: opacity 0.3s;
  opacity: 0;
}
.fade-bg-enter-to, .fade-bg-leave-to {
  opacity: 1;
}

.fade-enter-active, .fade-appear-active {
  transition: opacity .3s, transform .4s;
  transform: translateY(50px);
  opacity: 0;
}
.fade-enter-to, .fade-appear-to {
  transform: translateY(0);
  opacity: 1;
}
.fade-leave-active {
  transition: opacity .3s, transform .4s;
  transform: translateY(0);
  opacity: 1;
}
.fade-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
</style>