<script setup>
// import Quill from "quill";
// import DOMPurify from "dompurify";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
  result: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// const quillEditor = ref(null);

// const localIsOpen = ref(props.isOpen);

// const contentStore = useContentStore();
// const { editedContent, selectedSessionResults } = storeToRefs(contentStore);

// onMounted(() => {
//   nextTick(() => {
//     var toolbarOptions = [
//       ["bold", "italic", "underline", "strike", "link"], // toggled buttons
//       // ['blockquote', 'code-block'],

//       // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
//       [{ list: "ordered" }, { list: "bullet" }],
//       // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
//       // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
//       // [{ 'direction': 'rtl' }],                         // text direction

//       // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//       // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//       // [{ 'color': [] }],          // dropdown with defaults from theme
//       [{ font: [] }],
//       // [{ 'align': [] }],

//       // ['clean']                                         // remove formatting button
//     ];

//     // Assign the new Quill instance to quillEditor.value
//     // if (quillEditor.value) {
//     quillEditor.value = new Quill("#editor", {
//       modules: {
//         toolbar: toolbarOptions,
//       },
//       theme: "snow",
//     });

//     // Setup the event listener
//     quillEditor.value.on("text-change", () => {
//       // Use .value to access the Quill instance and get the HTML content
//       const htmlContent = quillEditor.value.root.innerHTML;
//       // Sanitize the HTML content to prevent XSS attacks
//       const safeContent = DOMPurify.sanitize(htmlContent);

//       if (editedContent.value !== safeContent) {
//         editedContent.value = safeContent;
//       }
//     });
//     // }
//   });
// });

const saveNewContent = (index) => {
  // contentStore.updateSelectedSession(index);
  props.isOpen = false;
  // stopZoomAndDrag.value = false;
};
</script>
<template>
  <div class="fixed top-0 left-0 z-20 w-full h-full bg-black/80 flex justify-between">
    <div class="relative flex flex-col items-center justify-center gap-5 w-full h-full">
      <div class="w-full flex justify-center">
        <component :is="component" :result="result" :isEditable="isOpen" />
      </div>
      <div class="relative flex w-[400px] justify-center items-center overflow-hidden">
        <input
          type="text"
          class="w-full rounded-lg h-16 pl-10 dark:bg-darkgrey dark:text-white dark:placeholder:text-white border-none focus:outline-purple-dark"
          placeholder="Modify this post with AI"
        />
        <NuxtIcon
          name="AI"
          class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer left-0 w-10 h-10 mr-5 text-purple-dark text-xl rounded-lg"
        />
        <NuxtIcon
          name="ArrowUp"
          class="transition-all flex items-center justify-center absolute hover:scale-105 cursor-pointer right-0 bg-purple-dark w-10 h-10 mr-5 text-white text-2xl rounded-lg"
        />
      </div>
    </div>
    <div class="relative right-0 top-0 bg-white w-96 h-full flex flex-col p-10">
      <div class="relative h-full">
        <p class="text-p font-semibold text-purple-dark">Post settings</p>

        <p>
          Her skal der være indstillinger. Globale Som hvornår det skal postes, eller specifikke instillinger til denne
          post type SEO, instagram #tag m.m
        </p>
        <br />
        <p>Alt efter dit abonnement kan du også vælge at "planlægge, hvornår dette post skal gå live"</p>
        <div class="flex justify-center gap-2 w-full absolute bottom-10">
          <button
            class="text-psmall text-black bg-creme py-2 px-4 rounded-md w-32"
            @click.stop="(openLightBoxId = null), (stopZoomAndDrag = false)"
          >
            Cancel
          </button>
          <button
            class="text-psmall text-white bg-purple-dark py-2 px-4 rounded-md w-32"
            @click.stop="saveNewContent(openLightBoxId)"
          >
            Save
          </button>
          <button
            class="text-psmall text-white bg-purple-dark py-2 px-4 rounded-md w-32"
            @click.stop="saveNewContent(openLightBoxId)"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>