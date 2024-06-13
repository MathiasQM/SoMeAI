// store/usePersonaStore.ts
import { defineStore, storeToRefs } from "pinia";
import { useGloabalState } from "@/stores/ui/useGlobalState";
import { useUserStore } from "@/stores/Users/useUserStore";

import { ref, watch, computed } from "vue";
import { fetchPersonasFromFirestore, deletePersonaById, createPersonaRemote } from "../../lib/personaHelpers.js";

export const usePersonaStore = defineStore("personaStore", () => {
  const userStore = useUserStore();
  const { userAuth } = storeToRefs(userStore);

  const globalStateStore = useGloabalState();
  const { loading } = storeToRefs(globalStateStore);

  const personas = ref([]);
  const selectedPersonaName = ref(null);
  const selectedPersona = ref(null);

  // Fetch personas from Firestore
  const fetchPersonas = async () => {
    try {
      const fetchedPersonas = await fetchPersonasFromFirestore(userAuth.value?.uid);
      if (fetchedPersonas) {
        personas.value = fetchedPersonas;
        localStorage.setItem("Personas", JSON.stringify(personas.value));
      } else {
        personas.value = [];
      }
    } catch (error) {
      console.error("Error fetching personas:", error.message);
    }
  };

  // Initialize personas from local storage or Firestore
  const initPersonas = () => {
    const storedPersonas = localStorage.getItem("Personas");
    if (storedPersonas) {
      personas.value = JSON.parse(storedPersonas);
    } else {
      fetchPersonas();
    }
  };

  // Watch authentication state changes to refetch personas
  watch(
    () => userAuth.value,
    (newUser) => {
      if (newUser) {
        fetchPersonas();
      }
    },
    { immediate: true }
  );

  // Sync selected persona by name
  watch(
    () => ({ personas: personas.value, selectedPersonaName: selectedPersonaName.value }),
    (newVal) => {
      const { personas, selectedPersonaName } = newVal;
      selectedPersona.value = personas.find((persona) => persona.personaName === selectedPersonaName) || null;
    }
  );

  // List of persona names
  const personaNames = computed(() => personas.value.map((persona) => persona.personaName));

  // Create a new persona using the remote function
  const createPersona = async (userProvidedData) => {
    loading.value = true;
    try {
      const response = await createPersonaRemote(userProvidedData);
      if (response) {
        fetchPersonas();
      }
    } catch (error) {
      console.error("Error creating persona:", error.message);
    } finally {
      loading.value = false;
    }
  };

  // Delete persona by ID
  const deletePersona = async (personaId) => {
    loading.value = true;
    try {
      await deletePersonaById(personaId);
      personas.value = personas.value.filter((persona) => persona.id !== personaId);
      selectedPersona.value = personas.value[0] || null;
      selectedPersonaName.value = selectedPersona.value?.personaName || null;
    } catch (error) {
      console.error("Error deleting persona:", error.message);
    } finally {
      loading.value = false;
    }
  };

  return {
    personas,
    personaNames,
    selectedPersona,
    selectedPersonaName,
    fetchPersonas,
    initPersonas,
    createPersona,
    deletePersona,
  };
});
