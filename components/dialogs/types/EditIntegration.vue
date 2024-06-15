<script setup>
import { ref } from "vue";
import { doc, getDoc, updateDoc, getFirestore, FieldPath } from "firebase/firestore";
import { usePersonaStore } from "~/stores/content/usePersonaStore";
import { storeToRefs } from "pinia";

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "",
  },
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const integrationSettings = reactive({
  samplePost: props.data.userSuppliedPost ? props.data.userSuppliedPost : "",
  postLength: props.data.postLength ? props.data.postLength : "",
  temperature: props.data.temperature ? props.data.temperature : "",
});

const selectedTemplate = ref("finetuning");

const selectTemplate = (template) => {
  selectedTemplate.value = template;
};

const personaStore = usePersonaStore();
const { selectedPersona } = storeToRefs(personaStore);

const saveChanges = async () => {
  const db = getFirestore();
  const integrationRef = doc(db, "Personas", selectedPersona.value.personaId, "Integrations", props.data.id);

  try {
    await updateDoc(integrationRef, {
      userSuppliedPost: integrationSettings.samplePost,
      postLength: integrationSettings.postLength,
      temperature: integrationSettings.temperature,
    });

    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};
const hasChanged = computed(() => {
  return (
    integrationSettings.samplePost !== props.data.userSuppliedPost ||
    integrationSettings.postLength !== props.data.postLength ||
    integrationSettings.temperature !== props.data.temperature
  );
});
</script>

<template>
  <div>
    <div class="transition-all border-b border-creme dark:border-lightdark p-5 flex items-center gap-5">
      <NuxtIcon :name="data.id" filled class="transition-all text-lightgrey text-2xl" />
      <p type="search" class="transition-all text-lightgrey w-full dark:bg-darkgrey">{{ data.handle }}</p>
    </div>

    <div class="p-5 flex flex-col">
      <div class="flex gap-5 text-small text-black mb-2">
        <p
          @click="selectTemplate('finetuning')"
          class="cursor-pointer"
          :class="{ 'font-bold': selectedTemplate === 'finetuning' }"
        >
          Fine Tuning
        </p>
        <p
          @click="selectTemplate('settings')"
          class="cursor-pointer"
          :class="{ 'font-bold': selectedTemplate === 'settings' }"
        >
          Settings
        </p>
        <p
          @click="selectTemplate('dangerZone')"
          class="cursor-pointer"
          :class="{ 'font-bold': selectedTemplate === 'dangerZone' }"
        >
          Danger zone
        </p>
      </div>

      <template v-if="selectedTemplate === 'finetuning'">
        <p class="text-xsmall mb-3">
          You can finetune the output of the AI by providing examples of posts that you find well written.
        </p>
        <div class="w-full">
          <p class="text-small text-black">Post One Note: Opdaterer ikke local data</p>
          <textarea
            class="w-full text-black text-small h-52 border bg-white border-light-100 rounded-lg p-3"
            v-model="integrationSettings.samplePost"
            placeholder="Paste your post here..."
          ></textarea>
        </div>
      </template>

      <template v-if="selectedTemplate === 'settings'">
        <p class="text-xsmall mb-3">Here you can change the settings for this integration.</p>
        <FormsInputText name="postLength" label="Post length" v-model="integrationSettings.postLength" />
        <div>
          <p class="text-xsmall font-semibold text-black">Temperature</p>
          <div class="w-1/2 flex items-center">
            <FormsRangeSlider
              name="temperature"
              label="Temperature"
              type="single"
              :min="0.0"
              :max="1.0"
              step="0.1"
              :initialSliderValue="integrationSettings.temperature"
              v-model:sliderValue1="integrationSettings.temperature"
            />
            <p>{{ integrationSettings.temperature }}</p>
          </div>
        </div>
      </template>

      <template v-if="selectedTemplate === 'dangerZone'">
        <div class="w-full h-44 mb-5 rounded-lg">
          <p class="text-small text-red font-medium">Danger Zone!</p>
          <p class="text-xsmall">
            We won't be able to post any content to this channel. Make sure any upcoming content and active Campaigns or
            Automations have been canceled.
          </p>
          <p class="text-small">Note: Removes Auth & Refresh Token</p>
          <p class="text-small">Note: Virker ikke endnu</p>

          <button class="bg-red/80 text-white text-small px-4 py-2 rounded-lg">Delete</button>
        </div>
      </template>
      <button
        v-if="selectedTemplate !== 'dangerZone'"
        :disabled="!hasChanged"
        @click="saveChanges"
        class="mt-5 bg-purple-500 disabled:bg-purple-200 text-white px-2 py-1 rounded-sm w-1/2 self-center"
      >
        Save
      </button>
    </div>
  </div>
</template>
