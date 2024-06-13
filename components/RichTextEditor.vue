<script setup>
const props = defineProps({
    blogData: String,
    modelValue: String,
});

const blogGenStore = useBlogGenStore();
const { blogPost } = storeToRefs(blogGenStore);
// const test = ref(null);

// watch(blogPost, (newVal) => {
//     console.log('Blog data changed:', newVal);
//     test.value = newVal; // Directly assign newVal to test
// });

</script>


<template>
        <!-- <div v-if="quillOutput" v-html="blogHTML"></div> -->
        <pre class="text-black">{{ blogData }}</pre>

        {{ blogData }}
        <div class="w-full h-[700px] overflow-hidden">
            <!-- <quill-editor theme="snow" toolbar="full" contentType="text" v-model:content="blogData" /> -->
        </div>
        <!-- <article v-if="true" class=" flex flex-col gap-5" contenteditable="true" ref="articleContent"> -->
            <!-- <img :src="quillOutput.coverImageLink" alt="">
            <h1 class="text-h4 font-black md:text-h1sm hyphens-auto text-center lg:text-start dark:text-white mb-10" lang="eng">{{ quillOutput.title }}</h1>
            <p class="text-psmall mb-10">{{quillOutput.introduction}}</p>
            <div class="flex flex-col gap-2" v-for="section, i in quillOutput.tableOfContents.sections">
                <h2 class="text-p mb-2 text-purple-dark" v-if="i === 0"># {{ section }}</h2>
                <h3 class="text-p mb-2 text-purple-dark" v-if="i === 1"># {{ section }}</h3>
                <h4 class="text-p mb-2 text-purple-dark" v-if="i === 2"># {{ section }}</h4>
                <p class="text-p mb-2 text-purple-dark" v-if="i > 2"># {{ section }}</p>
                <p class="text-psmall">{{ quillOutput.sections[section] }}</p>
            </div>
            <div>
                <h5 class="text-p mb-2 text-purple-dark">Conclusion</h5>
                <p>{{ quillOutput.conclusion }}</p>
            </div>
            <div>
                <h6 class="text-p mb-2 text-purple-dark">{{ quillOutput.cta.text }}</h6>
                <button class="btn-main" :href="quillOutput.cta.link">{{ quillOutput.cta.btnText }}</button>
            </div>
        </article> -->
        <!-- <pre>{{ quillOutput }}</pre> -->
</template>

<style scoped>
.ql-toolbar .ql-snow {
    border: none !important;
    outline: none !important;
    background-color: white;
}
</style>
