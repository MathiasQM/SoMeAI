<script setup>
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const props = defineProps({
  title: {
      type: String,
      default: ''
  },
    data: {
        type: Object,
        required: true
    },
})

const emit = defineEmits(['update:data']);

const userInput = ref('');  

const db = getFirestore();


// TODO: When Modifying tags add them to a temp array to show them in the client along side a "save" button by the "esc" button
// TODO: Only when the save button is clicked, update the tags in the database and refresh the persona data
const handleAddTag = () => {
    console.log(userInput.value, props.data.identifier)
    const personaRef = doc(db, 'Personas', props.data.personaId);
    let targetField = `${props.data.identifier}`
    updateDoc(personaRef, {
        [targetField]: arrayUnion(userInput.value)
      }).then(() => {
    // Assuming `personas.value[0].targetAudience[identifier]` is the array
    props.data.tags.push(userInput.value);
    emit('update:data', props.data);  // Emitting an event with the new data
  }).then(() => {
    userInput.value = '';
  }).catch(error => {
    console.error("Failed to remove item from Firestore:", error);
  });
};

const deleteTag = (identifier, value) => {
    const personaRef = doc(db, 'Personas', props.data.personaId);
    let targetField = `${identifier}`
    updateDoc(personaRef, {
        [targetField]: arrayRemove(value)
      }).then(() => {
    // Assuming `personas.value[0].targetAudience[identifier]` is the array
    const array = props.data.tags;
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
  <div>
    <div class="transition-all border-b border-creme dark:border-lightdark  p-5 flex items-center gap-5">
      <!-- <NuxtIcon name="Search" class="transition-all text-lightgrey text-2xl" /> -->
      <p class="text-xsmall bg-creme rounded-md whitespace-nowrap px-2 py-1">Add tags</p>
      <input v-model="userInput" @keydown.enter="handleAddTag()" type="text" class="transition-all text-lightgrey w-full dark:bg-darkgrey border-none outline-none first-letter:uppercase" :placeholder="data.placeholder">
    </div>
    
    <p class="transition-all px-5 pt-5 text-lightgrey">{{title}}</p>
    <div class="p-5 w-full flex flex-col">
      <div class="gap-1 flex justify-center items-center flex-wrap overflow-hidden">
        <p v-for="tag in data.tags" class="bg-purple-dark whitespace-nowrap text-white px-2 py-1 rounded-md text-xsmall flex">{{ tag }} <NuxtIcon @click="deleteTag(data.identifier, tag)" name="Close" class="text-lg" /></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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