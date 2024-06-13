<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,
        default: ''
    },
    data: {
        type: Object,
        required: true,
        default: () => ({})
    },
})
</script>

<template>
    <div>
        <div class="transition-all border-b border-creme dark:border-lightdark p-5 flex items-center gap-5">
            <NuxtIcon :name="data.platform" filled class="transition-all text-lightgrey text-2xl" />
            <p type="search" class="transition-all text-lightgrey w-full dark:bg-darkgrey">{{ data.handle }}</p>
        </div>
        
        <div class="p-5">
            <p class="transition-all text-lightgrey text-p mb-5">{{title}}</p>
            <div class="bg-creme w-full h-44 mb-5 rounded-lg">
                <p class="text-small">Handle</p>
                <p class="text-small">Auth Token</p>
                <p class="text-small">Refresh Token</p>
                <p class="text-small">max 3 Examples of good Instagram post that the user has chosen</p>
                Temperature
                Max_tokens: Post length - Recommend what research show as best practice for this channel
            </div>
            <p class="text-small text-red font-medium mb-2">Danger Zone!</p>
            <button class="bg-red/80 text-white text-small px-4 py-2 rounded-lg">Delete</button>
        </div>
    </div>
</template>