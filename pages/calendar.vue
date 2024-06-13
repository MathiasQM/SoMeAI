<template>
  <div class="flex flex-col gap-5 w-full h-full relative overflow-x-hidden p-5">
    <div class="bg-white dark:bg-darkgrey border border-light-100 w-full h-full overflow-hidden rounded-lg">
      <div class="h-[calc(84vh-70px)] flex justify-center items-center">
        This page is a dedicated overview of all their campaigns and const both past, present and future. <br />
        It is possible to see content acros personas, channels, campaigns and automations. <br />
        A user can filter out personas, channels, campaigns and automations as they wish. <br />
        A user can modify their content, campaigns and automations from this page. <br />
        This includes post scheduling, content editing, campaign editing and automation editing. <br />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
