<script setup>
import { useUserStore } from '@/stores/Users/useUserStore';

const userStore = useUserStore()
const { userAuth, showSignup, userCredentials } = storeToRefs(userStore);

</script>
<template>
    <div class="w-full flex flex-col gap-3">
        <p class="text-small font-bold w-full">Login</p>
        <div class="relative">
            <div class="flex flex-col gap-4">
                <button class="relative h-10 border border-creme w-full rounded-lg text-small flex justify-center items-center"><NuxtIcon class="absolute left-4" name="Google" filled/>Google</button>
                <button class="relative h-10 border border-creme w-full rounded-lg text-small flex justify-center items-center"><NuxtIcon class="absolute left-4" name="Meta" filled/>Meta</button>
                <button class="relative h-10 border border-creme w-full rounded-lg text-small flex justify-center items-center"><NuxtIcon class="absolute left-4" name="LinkedIn" filled/>LinkedIn</button>
                <div class="w-full flex justify-around items-center gap-4">
                    <span class="h-[1px] w-full bg-creme"></span>
                    <p class="text-small text-black/60">or</p>
                    <span class="h-[1px] w-full bg-creme"></span>
                </div>
                <FormsText v-model="userCredentials.email" label="" autoComplete="off" :useLocalStorage="true"  placeholder="Email" type="email" name="email"/>
                <FormsText  v-model="userCredentials.password" label="" autoComplete="off" :useLocalStorage="true" type="password"  placeholder="Password" name="password"/>
            </div>
        </div>
        <button @click="userStore.signIn" class="transition-all disabled:bg-creme w-full bg-purple-dark text-white rounded-lg h-12">Login</button>
    </div>
</template>