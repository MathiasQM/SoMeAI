<script setup lang="ts">
import {doc, getDoc, updateDoc, getFirestore, FieldPath} from 'firebase/firestore';

const props = defineProps({
    showDrawer: Boolean,
    data: String,
    title: String,
    index: Number,
    personaId: String,  
})

const newTitle = ref(props.title);
const newText = ref(props.data);

const updateContent = (event) => {
  console.log(event)
  newText.value = event.target.outerText;
};

const emit = defineEmits(['update:data']);

const saveChanges = async () => {
    const db = getFirestore();
    const personaRef = doc(db, 'Personas', props.personaId);

    // Construct field paths for key and description fields
    const targetFieldKey = `toneOfVoice.characteristics.${props.index}.key`;
    const targetFieldDescription = `toneOfVoice.characteristics.${props.index}.description`;

    try {
        await updateDoc(personaRef, {
            [targetFieldKey]: newTitle.value,
            [targetFieldDescription]: newText.value
        });
        let data = {
            key: newTitle.value,
            description: newText.value
          }
        emit('update:data', data);

        console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document: ', error);
    }
};

</script>

<template>
    <div class="w-full flex flex-col transition-all rounded-lg border border-purple-500/0 hover:border-purple-500 cursor-pointer">
        <div class="w-full flex justify-evenly cursor-pointer border border-creme bg-white rounded-md px-4 py-2 items-center relative z-10">
            <input v-model="newTitle" type="text" class="flex items-center w-full font-medium relative transition-all group text-xsmall first-letter:uppercase outline-none focus:text-purple-500 focus:bg-light-50 rounded-md" />
            <button @click="saveChanges" v-show="newTitle !== title || newText !== data" class="transition-all text-xsmall w-1/3 bg-purple-500 px-2 py-[2px] rounded-md text-white">Save</button>
        </div>
        <transition name="fade">
          <div contenteditable="true" @input="updateContent" class="relative outline-none cursor-text text-purple-dark px-5 flex items-center text-center text-xsmall font-medium bg-purple-200 rounded-b-lg -top-1 w-full h-32 text-area">{{ newText }}</div>
            <!-- <div class="accordion flex items-center w-full px-5 bg-purple-dark/20 rounded-b-lg -top-1 text-xsmall font-medium" :style="{ height: showElement ? '180px' : '0' }">
            </div> -->
        </transition>
    </div>
</template>

<style scoped>
.text-area {
  resize: none;
}
  .router-link-active {
    color: #a2bc0c;
  }
   .router-link-exact-active {
    color: #a2bc0c;
  }
  .accordion {
    max-height: 800px; /* Set a maximum height for your accordion content */
    overflow: hidden;
    transition: height 0.5s ease-in-out;
    position: relative;
    z-index: 1;
  }

  .draggable {
    cursor: grab;
  }
</style>