<script setup>
import Quill from 'quill';
import DOMPurify from 'dompurify';


const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
});

const quillEditor = ref(null);

const localIsOpen = ref(props.isOpen);

const contentStore = useContentStore()
const { editedContent, selectedSessionResults } = storeToRefs(contentStore);

onMounted(() => {
    nextTick(() => {
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
        // ['blockquote', 'code-block'],

        // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' }],                         // text direction

        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        // [{ 'color': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        // [{ 'align': [] }],

        // ['clean']                                         // remove formatting button
    ];


        // Assign the new Quill instance to quillEditor.value
        // if (quillEditor.value) {
            quillEditor.value = new Quill('#editor', {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow'
            });
            
            
            // Setup the event listener
            quillEditor.value.on('text-change', () => {
                // Use .value to access the Quill instance and get the HTML content
                const htmlContent = quillEditor.value.root.innerHTML;
                // Sanitize the HTML content to prevent XSS attacks
                const safeContent = DOMPurify.sanitize(htmlContent);
                
                if (editedContent.value !== safeContent) {
                    editedContent.value = safeContent;
                }
            });
        // }
    })
});


</script>
<template>
    <div v-if="localIsOpen" class="fixed inset-0 z-20 bg-black/80 flex justify-center items-center flex-col">
        <div class="relative flex flex-col gap-5">
            <slot/>
        </div>
    </div>
</template>