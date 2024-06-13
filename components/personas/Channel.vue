<script setup>
import { defineProps, watch } from 'vue';
import { getFirestore, doc, updateDoc } from 'firebase/firestore'; // Import Firebase Firestore functions

const props = defineProps({
    channel: {
        type: Object,
        required: true
    },
    personaId: {
        type: String,
        required: true
    },
});

const db = getFirestore();

// Function to update Firebase based on changes
const updateIntegrationInFirebase = async () => {
  const channelRef = doc(db, 'Personas', props.personaId, 'Integrations', props.channel.id);
  try {
    // Inverted props.channel.isActive because the switch is already toggled
    await updateDoc(channelRef, {isActive: !props.channel.isActive});
  } catch (error) {
    console.error('Failed to update integration in Firebase:', error);
  }
};

</script>
<template>
  <DialogsGeneric type="editIntegration" :data="channel" context="Viewer">
    <div class="transition-all flex gap-2 items-center justify-between border border-creme px-2 py-4 rounded-md hover:border-purple-dark cursor-pointer">
      <NuxtIcon :name="channel.platform" filled/>
      <p class="text-xsmall font-medium">{{ !channel.handle ? key : channel.handle }}</p>
      <FormsSwitch @click.stop="updateIntegrationInFirebase" v-model="channel.isActive" />
    </div>
  </DialogsGeneric>
</template>