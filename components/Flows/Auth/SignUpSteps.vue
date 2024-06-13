<script setup>
import { useUserStore } from '@/stores/Users/useUserStore';

const userStore = useUserStore()
const { stepIndex } = storeToRefs(userStore);
const signupSteps = ref([
    {
        title: 'Tell us about your brand',
        header: 'BrandBrainAI',
        inputs: [
            {
                type: 'text',
                label: 'What is your brand name?',
                placeholder: "Name: E.g. Milo's dog walking",
                name: 'brand name',
                userInput: '',
            },
            {
                type: 'text',
                label: 'What is your brand?',
                placeholder: 'Description: E.g. dog walking business in Toronto',
                name: 'brand description',
                userInput: '',
            },
        ],
        icon: '',
        component: 'FlowsSignUpStepBrand',
        aiGeneration: false,
    },
    {
        title: 'Where will you do business?',
        header: 'BrandBrainAI',
        inputs: [
            {
                type: 'text',
                label: 'Where is your audience located?',
                placeholder: "Enter country or region e.g. Toronto, Canada",
                name: 'Audience location',
                userInput: '',
            },
            {
                type: 'text',
                label: 'What is your industry?',
                placeholder: "Enter an industry: E.g. dog walking, pet grooming, etc.",
                name: 'Beand industry',
                userInput: '',
            },
        ],
        icon: '',
        component: 'FlowsSignUpStepBrand',
        aiGeneration: true,
    },
    {
        title: 'Tell us about your target audience',
        header: 'BrandBrainAI',
        inputs: [
            {
                type: 'Range',
                label: 'Where is your audience located?',
                placeholder: "Enter country or region e.g. Toronto, Canada",
                name: 'Audience location',
                userInput: '',
            },
        ],
        icon: '',
        component: 'FlowsSignUpStepBrand',
        aiGeneration: true,
    },
    {
        title: 'Sign up to start automating',
        header: 'BrandBrainAI',
        inputs: [
            {
                type: 'Signup',
                label: 'Sign up',
                userInput: '',
            },
        ],
        icon: '',
        component: 'FlowsSignUpStepBrand',
        aiGeneration: false,
    },
]);
const minAge = ref(50);
const maxAge = ref(80);
const persona = ref({
    name: '',
    description: '',
    countryOrRegion: '',
    industry: '',
    audience: {
        age: {
            min: 0,
            max: 120,
        },
    }

})
const buttonText = computed(() => {
    return stepIndex.value === signupSteps.value.length -1 ? 'Sign up' : 'Next';
});
const user = ref({
    email: '',
    password: '',

})

const isBtnDisabled = computed(() => {
    if (stepIndex.value < signupSteps.value.length -1) {
        return false;
    } else if (!user.value.email || !user.value.password) {
        return true;
    } return false;
})
</script>
<template>
    <p class="text-small font-medium mb-5">{{ signupSteps[stepIndex].title }}</p>
    <div class="w-full flex flex-col gap-3">
        <div v-for="input, i in signupSteps[stepIndex].inputs" :key="`input-${i}`">
            <FormsText v-if="input.type === 'text'" v-model="input.userInput" label="" autoComplete="off" :useLocalStorage="true"  :placeholder="input.placeholder" :name="input.name"/>
            <div v-if="input.type === 'Range'" class="flex flex-col gap-5">
                <FormsRangeSlider
                text="How old is your audience?"
                :min="0"
                :max="120"
                v-model:sliderValue1="minAge"
                v-model:sliderValue2="maxAge"
                />
                <FormsText v-model="user.email" label="What are their key interests?" autoComplete="off" :useLocalStorage="true"  placeholder="Global warming, fashion..." :name="input.name"/>
            </div>
            <div v-if="input.type === 'Signup'" class="flex flex-col gap-4">
                <button class="relative h-10 border border-creme w-full rounded-lg text-small flex justify-center items-center"><NuxtIcon class="absolute left-4" name="Google" filled/> Continue with Google</button>
                <button class="relative h-10 border border-creme w-full rounded-lg text-small flex justify-center items-center"><NuxtIcon class="absolute left-4" name="Meta" filled/> Continue with Meta</button>
                <button class="relative h-10 border border-creme w-full rounded-lg text-small flex justify-center items-center"><NuxtIcon class="absolute left-4" name="LinkedIn" filled/> Continue with LinkedIn</button>
                <div class="w-full flex justify-around items-center gap-4">
                    <span class="h-[1px] w-full bg-creme"></span>
                    <p class="text-small text-black/60">or</p>
                    <span class="h-[1px] w-full bg-creme"></span>
                </div>
                <FormsText v-model="user.email" label="" autoComplete="off" :useLocalStorage="true"  placeholder="Email" :name="input.name"/>
                <FormsText v-model="user.password" label="" autoComplete="off" :useLocalStorage="true"  placeholder="Password" :name="input.name"/>
            </div>
        </div>
        <button v-if="signupSteps[stepIndex].aiGeneration" class="w-full border border-purple-dar rounded-lg h-8 flex justify-center items-center gap-2 text-purple-dark"><NuxtIcon name="AI"/> Generate Ideas</button>
        <button :disabled="isBtnDisabled" @click="userStore.incrementStep" class="transition-all disabled:bg-creme w-full bg-purple-dark text-white rounded-lg h-12">{{buttonText}}</button>
    </div>
</template>
