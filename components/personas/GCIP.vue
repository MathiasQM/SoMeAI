<script setup>
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const db = getFirestore();
const props = defineProps({
    persona: {
        type: Object,
        default: {}
    }
})


const handleAddTag = (value, identifier) => {
    console.log(value, identifier   )
    const personaRef = doc(db, 'Personas', props.persona.personaId);
    let targetField = `targetAudience.${identifier}`
    updateDoc(personaRef, {
        [targetField]: arrayUnion(value)
      }).then(() => {
    // Assuming `personas.value[0].targetAudience[identifier]` is the array
    props.persona.targetAudience[identifier].push(value);
  }).catch(error => {
    console.error("Failed to remove item from Firestore:", error);
  });
};

const deleteTag = (identifier, value) => {
    const personaRef = doc(db, 'Personas', props.persona.personaId);
    let targetField = `targetAudience.${identifier}`
    updateDoc(personaRef, {
        [targetField]: arrayRemove(value)
      }).then(() => {
    // Assuming `personas.value[0].targetAudience[identifier]` is the array
    const array = props.persona.targetAudience[identifier];
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1); // Correct usage of splice
    }
  }).catch(error => {
    console.error("Failed to remove item from Firestore:", error);
  });
};
</script>

<template>
    <div class="w-full h-full flex flex-col gap-2">

        <div class="self-center relative w-full h-full flex items-center justify-center flex-wrap gap-3">
            <div class="relative flex-grow-1 p-3 pt-10 bg-light-50 border border-light-100 rounded-md w-full md:w-[calc(50%-12px)] lg:w-full lg:max-w-[calc(50%-12px)] min-w-[300px] aspect-video flex items-center justify-center gap-1 flex-wrap text-small font-semibold">
                <p class="absolute top-2 left-2 bg-white border border-purple-400 text-xsmall font-bold px-2 py-1 rounded-md">Goals</p>
                <div class="flex items-center justify-center flex-wrap gap-1">
                    <div v-for="goal, i in persona.targetAudience.goals" class="group relative cursor-default">
                        <span @click="deleteTag('goals', goal)" class="transition-all opacity-0 group-hover:opacity-100 cursor-pointer absolute -top-3 -right-2 z-10 w-4 h-4 rounded-full bg-white flex items-center justify-center text-xsmall font-semibold"> <NuxtIcon name="Close" class="text-[10px]"/> </span>
                        <p class="relative bg-purple-dark text-white px-2 py-1 rounded-md text-xsmall text-center">{{ goal }}</p>
                    </div>
                </div>
                <FormsAddTag class="absolute top-2 right-2" @addTag="(tag) => handleAddTag(tag, 'goals')" />
            </div>

            <div class="relative flex-grow-1 p-3 pt-10 bg-light-50 border border-light-100 rounded-md w-full md:w-[calc(50%-12px)] lg:w-full lg:max-w-[calc(50%-12px)] min-w-[300px] aspect-video flex items-center justify-center gap-1 flex-wrap text-small font-semibold">
                <p class="absolute top-2 left-2 bg-white border border-purple-400 text-xsmall font-bold px-2 py-1 rounded-md">Challenges</p>
                <div class="flex items-center justify-center flex-wrap gap-1">
                    <div v-for="challenge in persona.targetAudience.challenges" class="group relative cursor-default">
                        <span @click="deleteTag('challenges', challenge)" class="transition-all opacity-0 group-hover:opacity-100 cursor-pointer absolute -top-3 -right-2 z-10 w-4 h-4 rounded-full bg-white flex items-center justify-center text-xsmall font-semibold"> <NuxtIcon name="Close" class="text-[10px]"/> </span>
                        <p class="relative bg-purple-dark text-white px-2 py-1 rounded-md text-xsmall text-center">{{ challenge }}</p>
                    </div>
                </div>
                <FormsAddTag class="absolute  top-2 right-2" @addTag="(tag) => handleAddTag(tag, 'challenges')" />
            </div>

            <div class="relative p-3 pt-10 bg-light-50 border border-light-100 rounded-md w-full md:w-[calc(50%-12px)] lg:w-full lg:max-w-[calc(50%-12px)] min-w-[300px] aspect-video flex items-center justify-center gap-1 flex-wrap text-small font-semibold">
                <p class="absolute top-2 left-2 bg-white border border-purple-400 text-xsmall font-bold px-2 py-1 rounded-md">Interests</p>
                <div class="flex items-center justify-center flex-wrap gap-1">
                    <div v-for="interest in persona.targetAudience.interests" class="group relative cursor-default">
                        <span @click="deleteTag('interests', interest)" class="transition-all opacity-0 group-hover:opacity-100 cursor-pointer absolute -top-3 -right-2 z-10 w-4 h-4 rounded-full bg-white flex items-center justify-center text-xsmall font-semibold"> <NuxtIcon name="Close" class="text-[10px]"/> </span>
                        <p class="relative bg-purple-dark text-white px-2 py-1 rounded-md text-xsmall text-center">{{ interest }}</p>
                    </div>
                </div>
                <FormsAddTag class="absolute  top-2 right-2" @addTag="(tag) => handleAddTag(tag, 'interests')" />
            </div>

            
            <div class="relative p-3 pt-6 bg-light-50 border border-light-100 rounded-md w-full md:w-[calc(50%-12px)] lg:w-full lg:max-w-[calc(50%-12px)] min-w-[300px] aspect-video flex items-center justify-center gap-1 flex-wrap text-small font-semibold">
                <p class="absolute top-2 left-2 bg-white border border-purple-400 text-xsmall font-bold px-2 py-1 rounded-md">Psychographics</p>
                <div class="flex items-center justify-center flex-wrap gap-1">
                    <div v-for="psychographic in persona.targetAudience.psychographics" class="group relative cursor-default">
                        <span @click="deleteTag('psychographics', psychographic)" class="transition-all opacity-0 group-hover:opacity-100 cursor-pointer absolute -top-3 -right-2 z-10 w-4 h-4 rounded-full bg-white flex items-center justify-center text-xsmall font-semibold"> <NuxtIcon name="Close" class="text-[10px]"/> </span>
                        <p class="relative bg-purple-dark text-white px-2 py-1 rounded-md text-xsmall text-center">{{ psychographic }}</p>
                    </div>
                </div>
                <FormsAddTag class="absolute  top-2 right-2" @addTag="(tag) => handleAddTag(tag, 'psychographics')" />
            </div>
        </div>
    </div>

</template>