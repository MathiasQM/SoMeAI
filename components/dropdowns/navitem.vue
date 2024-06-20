<script setup lang="ts">
import { useDialogStore } from "@/stores/ui/useDialogStore";
import { useGloabalState } from "@/stores/ui/useGlobalState";
import { ref, defineProps } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useContentStore } from "@/stores/useContentStore";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";

const db = getFirestore();

const globalStateStore = useGloabalState();
const { isMobileNavOpen } = storeToRefs(globalStateStore);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  sessions: {
    type: Array,
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
});
const showElement = ref<boolean>(false);
const route = useRoute();
const sessionName = ref<string>(props.sessions.sesionName);
const toggleElement = (): void => {
  showElement.value = !showElement.value;
  if (route.path !== "/contentai") {
    navigateTo("/contentai", { external: false });
    showDialog.value = true;
    selectedSession.value = "";
  }
};

function formatDateTime(dateInput) {
  const date = new Date(dateInput);

  // Pad single digits with leading zeros
  const pad = (num) => num.toString().padStart(2, "0");

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // getMonth() is zero-indexed
  const year = date.getFullYear();

  return `${day}.${month}.${year} - ${hours}.${minutes}`;
}

const contentStore = useContentStore();
const { selectedSession, sessions } = storeToRefs(contentStore);

const dialogStore = useDialogStore();
const { showDialog } = storeToRefs(dialogStore);

const openSession = (sessionIndex) => {
  if (route.path !== "/contentai") navigateTo("/contentai", { external: false });
  showDialog.value = false;
  console.log("open session", sessions);
  // selectedSession.value = sessions.value[sessionIndex].sessionId;
  selectedSession.value = sessions.value[sessionIndex];
  console.log(selectedSession.value);
};

const updateSessionName = (name: string) => {
  const docRef = doc(db, "contentCreation", selectedSession.value.id);
  setDoc(docRef, { sessionName: name }, { merge: true });
};

const deleteSession = async (sessionId: string) => {
  const docRef = doc(db, "contentCreation", sessionId);
  await deleteDoc(docRef);
};
</script>

<template>
  <div class="relative select-none">
    <slot />
    <transition-group name="fade" tag="div" class="px-2 flex flex-col gap-2">
      <div
        v-for="(session, sessionIndex) in sessions"
        :key="session.id"
        @click="openSession(sessionIndex), (isMobileNavOpen = false)"
        :class="session.id === selectedSession.id ? 'bg-light-100' : ''"
        class="group flex justify-between items-center transition-all h-14 px-2 rounded-md hover:bg-light-100 cursor-pointer group"
      >
        <div>
          <input
            @change="
              (event) => {
                updateSessionName(event.target.value);
              }
            "
            @blur="
              (event) => {
                updateSessionName(event.target.value);
              }
            "
            class="transition-all text-small font-normal first-letter:uppercase outline-none bg-white/0 focus:bg-dark-300 hover:bg-dark-300"
            v-model="session.sessionName"
          />
          <p
            class="transition-all text-xsmall text-black/50 dark:text-white dark:group-hover:text-purple-dark group-hover:text-purple-dark"
          >
            {{ formatDateTime(session.timestamp.toDate()) }}
          </p>
        </div>
        <NuxtIcon
          name="Trash"
          class="transition-all text-small opacity-0 group-hover:opacity-100 text-red"
          @click="deleteSession(session.id)"
        />
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.accordion {
  max-height: 500px; /* Set a maximum height for your accordion content */
  overflow: hidden;
  transition: height 0.5s ease-in-out;
  position: relative;
  top: -18px;
  z-index: 1;
}
.router-link-exact-active {
  color: #7b61ff;
  background-color: white;
  border: 2px solid #e7e7e7;
}

.dropdown-open {
  border: 2px solid #e7e7e7;
}
.dark .dropdown-open {
  border: 2px solid #222222;
}

.dark .router-link-active {
  color: #7b61ff;
  border-color: #222222;
  background-color: #161616;
}

.fade-enter-active,
.fade-appear-active {
  transition: opacity 0.2s, transform 0.4s;
  transform: translate(0px, -20px); /* Start from top-right */
  opacity: 0;
}
.fade-enter-to,
.fade-appear-to {
  transform: translate(0, 0); /* End at element's original position */
  opacity: 1;
}
.fade-leave-active {
  transition: opacity 0.2s, transform 0.4s;
  transform: translate(0, 0); /* Start at element's original position */
  opacity: 1;
}
.fade-leave-to {
  transform: translate(0px, -20px); /* End at bottom-left */
  opacity: 0;
}
</style>
