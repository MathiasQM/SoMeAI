<script setup>
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const props = defineProps({
    tags: {
        type: Array,
        default: []
    },
    persona: {
        type: Object,
        default: {}
    },
    identifier: {
        type: String,
        default: ''
    }
})
const db = getFirestore();

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
    <div class="relative group flex gap-1 cursor-pointer">
        <div class="flex gap-1">
            <div v-for="tag in tags" class="relative">
            <span @click="deleteTag(identifier, tag)" class="transition-all opacity-0 group-hover:opacity-100 bg-purple-dark cursor-pointer absolute -top-3 -right-2 z-10 w-4 h-4 rounded-full flex items-center justify-center text-xsmall font-semibold"> <NuxtIcon name="Close" class="text-[10px] text-white"/> </span>
            <p class="bg-creme rounded-md text-xsmall whitespace-nowrap px-2 py-1 font-medium">{{ tag }}</p>
        </div>
        </div>
        <FormsAddTag class="transition-all hidden group-hover:block opacity-0 group-hover:opacity-100" @addTag="(tag) => handleAddTag(tag, identifier)" />
    </div>
</template>
<!-- <div class="transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 absolute -left-10 top-8  border border-creme  w-44 z-20 flex justify-center flex-col items-center gap-2 bg-white p-2 rounded-lg">
    <p class="text-xsmall font-medium w-full text-center">Gender</p>
    <div class="flex justify-center flex-wrap gap-1">
        <div v-for="gender in tags" class="relative">
            <span @click="deleteTag('gender', gender)" class="transition-all opacity-0 group-hover:opacity-100 bg-purple-dark cursor-pointer absolute -top-3 -right-2 z-10 w-4 h-4 rounded-full flex items-center justify-center text-xsmall font-semibold"> <NuxtIcon name="Close" class="text-[10px] text-white"/> </span>
            <p class="bg-creme rounded-md text-xsmall px-2 py-1 font-medium">{{ gender }}</p>
        </div>
    </div>
 </div> -->