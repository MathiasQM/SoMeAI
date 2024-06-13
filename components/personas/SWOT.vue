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
    let targetField = `brandAnalysis.swot.${identifier}`
    updateDoc(personaRef, {
        [targetField]: arrayUnion(value)
      }).then(() => {
    // Assuming `personas.value[0].targetAudience[identifier]` is the array
    props.persona.brandAnalysis.swot[identifier].push(value);
  }).catch(error => {
    console.error("Failed to remove item from Firestore:", error);
  });
};

const deleteTag = (identifier, value) => {
    const personaRef = doc(db, 'Personas', props.persona.personaId);
    let targetField = `brandAnalysis.swot.${identifier}`
    updateDoc(personaRef, {
        [targetField]: arrayRemove(value)
      }).then(() => {
    // Assuming `personas.value[0].targetAudience[identifier]` is the array
    const array = props.persona.brandAnalysis.swot[identifier];
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
    <div class="w-full flex flex-col gap-2">
        <p class="text-xsmall font-bold">SWOT Analisys</p>
        <p class="text-xsmall text-lighterdark font-normal lg:max-w-[100%] mdxl:max-w-[50%] xl:max-w-[100%]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
            <div class="flex flex-wrap gap-2 w-full">
                <div class="relative w-full smd:w-[calc(50%-4px)] mdxl:w-[calc(25%-8px)] rounded-lg h-[300px] px-5" v-for="(term, key) in persona.brandAnalysis?.swot" :class="key === 'strengths' ? 'bg-green/20' : key === 'weaknesses' ? 'bg-[orange]/20' : key === 'opportunities' ? 'bg-blue/20': 'bg-red/20'">
                    <p class="text-p w-full text-center py-5 first-letter:uppercase" :class="key === 'strengths' ? 'text-green' : key === 'weaknesses' ? 'text-[orange]' : key === 'opportunities' ? 'text-blue': 'text-red'">{{ key }}</p>
                    <div v-for="attribute in term" class="group relative cursor-default">
                        <span @click="deleteTag(key, attribute)" class="transition-all opacity-0 group-hover:opacity-100 cursor-pointer absolute -top-3 -right-2 z-10 w-4 h-4 rounded-full bg-white flex items-center justify-center text-xsmall font-semibold"> <NuxtIcon name="Close" class="text-[10px]"/> </span>
                        <p  class="text-xsmall font-bold mt-2 first-letter:uppercase" :class="key === 'strengths' ? 'text-green' : key === 'weaknesses' ? 'text-[orange]' : key === 'opportunities' ? 'text-blue': 'text-red'">{{ attribute }}</p>
                    </div>
                    <div class="absolute left-0 bottom-2 flex justify-center w-full">
                        <FormsAddTag class="relative" @addTag="(tag) => handleAddTag(tag, key)" />
                    </div>
                </div>
            </div>
        <!-- <PersonasEditor @update:showEditor="showEditor = !showEditor"  :showEditor="showEditor" :tags="persona.brandAnalysis.swot" :personaId="persona.personaId" identifier="geographicalLocations" placeholder="Enter countries or regions" tagBgText="bg-creme text-[black]">
            <div @click="showEditor = true" class="flex flex-wrap gap-2 w-full">
                <div class="w-full sm:w-[calc(50%-4px)] rounded-lg h-[300px] px-5" v-for="(term, key) in persona.brandAnalysis?.swot" :class="key === 'strengths' ? 'bg-green/20' : key === 'weaknesses' ? 'bg-[orange]/20' : key === 'opportunities' ? 'bg-blue/20': 'bg-red/20'">
                    <p class="text-p w-full text-center py-5 first-letter:uppercase" :class="key === 'strengths' ? 'text-green' : key === 'weaknesses' ? 'text-[orange]' : key === 'opportunities' ? 'text-blue': 'text-red'">{{ key }}</p>
                    <p v-for="attribute in term" contenteditable="true" class="text-xsmall font-bold w-full mt-2 first-letter:uppercase" :class="key === 'strengths' ? 'text-green' : key === 'weaknesses' ? 'text-[orange]' : key === 'opportunities' ? 'text-blue': 'text-red'">{{ attribute }}</p>
                </div>
            </div>
    
        </PersonasEditor> -->
    </div>
</template>