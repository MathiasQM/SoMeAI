<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="transition-all p-3 rounded-lg bg-white border border-light-100 w-[calc(100vw-40px)] md:w-[calc(100%-0px)] flex flex-col gap-5">
        <div class="flex justify-between w-full gap-5">
            <div class="w-full xl:w-1/2 flex flex-col gap-2">
                <p class="text-small font-medium">{{title}}</p>
                <p class="text-xsmall text-light-600 font-normal lg:max-w-[100%] mdxl:max-w-[50%] xl:max-w-[100%]">{{description}}</p>
                <slot name="head"/>
            </div>
        </div>
        <slot name="body"/>
    </div>
</template>