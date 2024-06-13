<script setup lang="ts">
const props = defineProps({
    generatedBlog: {
    type:  [String, Object],
    default: 'Your blog post will appear here',
    }
});

const blogGenStore = useBlogGenStore();
const { loading, blogPostOptions } = storeToRefs(blogGenStore);

const blogData = computed(() => props.generatedBlog);
const blogtext = ref('Your blog post will appear here');
const showArticleElement = ref(false);
const showEditor = ref(false);
const fineTune = ref(true);
const editorElement = ref(null);
const articleElement = ref(null);
const articleHtml = ref('<p>test</p>');
const articlePlainText = ref('');

const updateArticleHtml = async () => {
    await nextTick();
    const element = document.getElementById('articleHtml');
    if (element) {
        articleHtml.value = element.innerHTML;
        articlePlainText.value = element.innerText;
        fineTune.value = false;
        showEditor.value = true;
    }
};  

watch(articleElement, (newVal, oldVal) => {
    articleHtml.value = articleElement.innerHTML;
    console.log(articleHtml.value)
}, {deep: true});

watch(blogData, (newVal) => {
    blogtext.value = newVal;
    showArticleElement.value = true;
    updateArticleHtml();

}, {deep: true});


// Finetuning

const languageOptions = ref({
    en: 'English',
    da: 'Danish',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    pt: 'Portuguese',
    nl: 'Dutch',
    pl: 'Polish',
})

const writingStyle = ref({
    normal: 'Normal',
    academic: 'Academic',
    conversational: 'Conversational',
    professional: 'Professional'
})

const contentType = {
    blog: 'Blog',
    facebook: 'Facebook',
    twitter: 'Twitter/X',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
}

const type = ref({
    "Social Media": 'Social Media',
    blog: 'Blog',
    guide: 'Guide',
    article: 'Article',
    news: 'News'
})

const legibility = ref({
    academic: 'Academic',
    technical: 'Technical',
    everyday: 'Everyday',
})

const tone = ref({
    normal: 'Normal',
    fun: 'Fun',
    happy: 'Happy',
    chill: 'Chill',
})

const { copyUnicode } = useUnicodeText(articlePlainText.value);

</script>

<template>
    <div class="w-full h-[calc(84vh-70px)]">
        <div v-if="fineTune" class="p-5 w-full h-full flex flex-col items-center gap-5">
            
            <h2 class="text-h4 font-bold text-purple-dark self-start mb-20">Content AI Finetuning</h2>
            <div class="flex gap-10 justify-center flex-wrap w-full">
                    <FormsSelect :options="languageOptions" :useLocalStorage="true" info="Blogpost output language." selected="English" placeholder="Search languages" name="language" label="Output language" v-model="blogPostOptions.outputLanguage" />
                    <FormsSelect :options="writingStyle" :useLocalStorage="true" info="" selected="Normal" placeholder="Search writingstyles" name="Writing style" label="Writing Style" v-model="blogPostOptions.writingStyle" />
                    <FormsSelect :options="type" :useLocalStorage="true" selected="Blog" placeholder="Search blog types" name="Blog Type" label="Blog Type" v-model="blogPostOptions.type"/>
                    <FormsSelect :options="legibility" :useLocalStorage="true" selected="Everyday" placeholder="Search" name="Legibility" label="Legibility" v-model="blogPostOptions.legibility"/>
                    <FormsSelect :options="contentType" :useLocalStorage="true" selected="Blog" placeholder="Choose content type" name="content-type" label="content type" v-model="blogPostOptions.contentType"/>
                    <FormsSelect :options="tone" :useLocalStorage="true" selected="Normal" placeholder="Search tones" name="Tone" label="Tone" v-model="blogPostOptions.tone"/>
                    <FormsInputText label="Keywords" v-model="blogPostOptions.keywords" :useLocalStorage="true" info="Comma separated list." placeholder="Keywords" name="keywords"/>
                    <FormsInputNumber label="Ammount of sections" v-model="blogPostOptions.ammountSections" :useLocalStorage="true" info="AI will generate x ammount of sections" placeholder="Sections" name="sections"/>
                    <FormsInputNumber label="Min. ammount of words" v-model="blogPostOptions.minAmmountWords" :useLocalStorage="true" info="Minimum ammount of words" placeholder="Number" name="min-words"/>
                    <FormsInputNumber label="Max. ammount of words" v-model="blogPostOptions.maxAmmountWords" :useLocalStorage="true" info="Maximum ammount of words" placeholder="Number" name="Max-words"/>

                    <!-- <p>Emoji meter</p> -->
            </div>
        </div>
        <client-only>
            <!-- <quill-editor v-if="showEditor && !fineTune" class="h-[100%] dark:text-white" theme="snow" toolbar="full" contentType="html" v-model:content="articlePlainText" /> -->
            <NuxtIcon v-if="showEditor && !fineTune" name="UniCode" @click="copyUnicode" class="w-10 h-10 flex justify-center items-center text-2xl bg-creme text-black absolute bottom-24 left-3 rounded-lg"/>
            <article id="articleHtml" v-if="showArticleElement" class="hidden">
                {{  blogData }}

                    <!-- <p v-if="blogtext.post">{{ blogtext.post }}</p>
                    <p v-if="blogtext.suggestedTags" v-for="tag in blogtext.suggestedTags">#{{tag}}</p> -->
                    <!-- <h1 v-if="blogtext.blogPost?.title">{{ blogtext.blogPost.title }}</h1> -->
                    <!-- <p v-if="blogtext.introduction">{{ blogtext.introduction }}</p>
                    <div v-if="blogtext.tableOfContents" v-for="section, i in blogtext.tableOfContents.sections">
                        <p>{{ section }}</p>
                        <p>{{ blogtext.sections[section] }}</p>
                    </div>
    
                    <div v-if="blogtext.conclusion">
                        <p>{{ blogtext.conclusion }}</p>
                    </div> -->
                </article>
                <!-- <pre>{{blogtext}}</pre> -->
        </client-only>
    </div>
</template>

<style>
.ql-toolbar{
    background-color: #E7E7E7 !important;
}
/* .ql-snow .ql-stroke {
    stroke: white !important;
} */

.ql-preview > input {
    display: none;
}
.ql-editor {
    /* min-height: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden; */
    padding-bottom: 100px;
    border: 1px #E7E7E7;
    /* padding: 0;
    margin: 0;
    border: none;
    background-color: transparent;
    color: #000;
    font-size: 1rem;
    font-family: inherit;
    line-height: 1.5;
    text-align: left;
    white-space: normal;
    word-break: break-word;
    word-wrap: break-word;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none; */
    overflow-y: scroll;
    scrollbar-width: thin;  /* For Firefox */
    scrollbar-color: transparent transparent;  /* For Firefox, sets thumb and track color */
    }

.ql-editor::-webkit-scrollbar {
  width: 4px;  /* Width of the vertical scrollbar */
  height: 12px;  /* Height of the horizontal scrollbar */
}

.ql-editor::-webkit-scrollbar-thumb {
  background-color: #7b61ff89;  /* Color of the scrollbar thumb */
  border-radius: 6px;  /* Roundness of the scrollbar thumb */
}

.ql-editor::-webkit-scrollbar-track {
  background: transparent;  /* Hides the scrollbar track */
}
</style>
