// Imports
import { defineStore } from "pinia";
import { ref, computed, onUnmounted } from "vue";
import { getFirestore, collection, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useUserStore } from "@/stores/Users/useUserStore";
import { useNuxtApp } from "#app";

import { usePersonaStore } from "@/stores/content/usePersonaStore.js";

export const useContentStore = defineStore("useContent", () => {
  const nuxtApp = useNuxtApp();
  const firebaseApp = nuxtApp.$firebase.app;
  const db = getFirestore(firebaseApp);
  const functions = getFunctions(firebaseApp);
  const generateContent = httpsCallable(functions, "generateContent");

  const contentPurpose = ref("");
  const newContentName = ref("");
  const userStore = useUserStore();
  const { userAuth } = storeToRefs(userStore);
  const selectedChannels = ref([]);
  const selectedSession = ref("");
  const selectedSessionResults = ref([]); // Contains the results of the selected session
  const sessions = ref([]); // Initialize sessions as an array - Used to load sessions in the sidenav
  const editedContent = ref(null);
  const userInput = ref("");
  const stopZoomAndDrag = ref(false);
  const modifiedContent = ref("");

  const personaStore = usePersonaStore();
  const { personas, selectedPersona } = storeToRefs(personaStore);

  let contentUnsubscribe = null;
  let queryUnsubscribe = null;

  watch(
    () => selectedPersona.value,
    (newPersona) => {
      // Clean up any existing listener
      if (queryUnsubscribe) {
        queryUnsubscribe();
      }

      if (!newPersona) {
        sessions.value = [];
        return;
      }

      // Create a query to get all documents with the matching personaId
      const q = query(
        collection(db, "contentCreation"),
        where("personaId", "==", newPersona.personaId),
        orderBy("timestamp", "desc")
      );

      // Set up a listener for the query result
      queryUnsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          sessions.value = docs;
          selectedSession.value = sessions.value[0];
        },
        console.error
      );
    },
    { immediate: true }
  );

  watch(
    () => selectedSession.value,
    (newSessions) => {
      console.log("Selected Session:", newSessions);
      if (!newSessions) return;

      const contentRef = collection(db, "contentCreation", newSessions.id, "content");
      const contentQuery = query(contentRef, orderBy("timestamp", "desc"));

      if (contentUnsubscribe) contentUnsubscribe(); // Clean up any existing listener before setting up a new one

      contentUnsubscribe = onSnapshot(
        contentQuery,
        (querySnapshot) => {
          selectedSessionResults.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        },
        console.error
      );
    },
    { immediate: true }
  );

  // Cleanup function to be called on component unmount
  const cleanupListeners = () => {
    if (contentUnsubscribe) contentUnsubscribe();
  };

  onUnmounted(() => {
    cleanupListeners();
  });

  // Actions

  const updateSelectedSession = async (index) => {
    // Ensure the index is within the bounds of the array
    if (index < 0 || index >= selectedSessionResults.value.length) {
      console.error("Index out of bounds");
      return;
    }

    // Get the document ID from the selected session results
    const docId = selectedSessionResults.value[index].id;
    if (!docId) {
      console.error("Document ID not found");
      return;
    }

    // Reference to the document in Firestore
    const docRef = doc(db, "contentCreation", userAuth.value.uid, selectedSession.value, docId);

    // Update the content field of the document
    try {
      console.log("Edited Content", editedContent.value);
      if (editedContent.value !== null) {
        selectedSessionResults.value[index].content = editedContent.value;
      }
      await updateDoc(docRef, {
        content: editedContent.value,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const selectChannel = (channelKey) => {
    const index = selectedChannels.value.indexOf(channelKey);
    index > -1 ? selectedChannels.value.splice(index, 1) : selectedChannels.value.push(channelKey);
  };

  // Generate Content for the selected channels and persona
  const generateContentForChannel = async (prompt, options) => {
    if (!selectedPersona) return console.error("No selected persona");
    if (!prompt) return console.error("No prompt provided");
    userInput.value = "";
    const requestData = {
      channels: selectedChannels.value,
      prompt,
      options,
      persona: selectedPersona.value,
      contentName: newContentName.value,
    };

    // Remove unnecessary fields based on the purpose of the content
    // to prevent creating promotional content for purely informational or engagement purposeses
    if (!options["purpose"].includes("Promote") && !options["purpose"].includes("Inform")) {
      delete requestData.persona.website;
      delete requestData.persona.website;
      delete requestData.persona.contentPreferences;
      delete requestData.persona.brandAnalysis.coreOfferings;
    }

    try {
      const { success, data, error } = await useFetch("/api/users/content/generate", {
        method: "POST",
        body: requestData,
      });

      selectedSession.value = sessions.value[0]; // Set the selected session to the first session - Should be the newly created session
      newContentName.value = "";
      contentPurpose.value = "";

      if (!success) throw new Error("Failed to create persona");
      return data.json();
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  const modifyPost = async (channel, prompt, postContent) => {
    modifiedContent.value = "";
    const requestData = {
      userId: userAuth.value.uid,
      personaDescription: selectedPersona.value.personaDescription,
      channel: channel,
      prompt: prompt,
      postContent: postContent,
    };

    try {
      const response = await fetch("/api/users/content/modify", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Append each chunk to the buffer
        buffer += decoder.decode(value, { stream: true });

        // Attempt to parse the buffer into JSON objects
        let boundary = buffer.indexOf("}{");
        while (boundary !== -1) {
          const chunk = buffer.slice(0, boundary + 1).trim();
          buffer = buffer.slice(boundary + 1);

          if (chunk) {
            try {
              const parsedChunk = JSON.parse(chunk);
              console.log(parsedChunk.content); // Update your UI component with this content
              modifiedContent.value += parsedChunk.content;
            } catch (error) {
              console.error("Error parsing chunk:", chunk, error);
            }
          }
          boundary = buffer.indexOf("}{");
        }
      }

      if (buffer.trim()) {
        // Handle any remaining data
        try {
          const remainingChunks = buffer.trim().split(/(?<=})\s*(?={"content":)/);
          remainingChunks.forEach((chunk) => {
            if (chunk.trim()) {
              try {
                const parsedChunk = JSON.parse(chunk.trim());
                console.log(parsedChunk.content); // Update your UI component with this content
                modifiedContent.value += parsedChunk.content;
              } catch (error) {
                console.error("Error parsing remaining chunk:", chunk, error);
              }
            }
          });
        } catch (error) {
          console.error("Error parsing remaining buffer:", buffer, error);
        }
      }
    } catch (error) {
      console.error("Error generating content:", error);
      throw error; // Rethrow the error for the caller to handle
    }
  };

  return {
    personas,
    userInput,
    selectedChannels,
    selectedSessionResults,
    sessions,
    selectedSession,
    editedContent,
    newContentName,
    contentPurpose,
    stopZoomAndDrag,
    modifiedContent,
    generateContentForChannel,
    selectChannel,
    updateSelectedSession,
    modifyPost,
  };
});
