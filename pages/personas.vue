<script setup>
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const db = getFirestore();

// Stores
import { usePersonaStore } from "@/stores/content/usePersonaStore";
import { getAuth } from "firebase/auth";

const personaStore = usePersonaStore();
const { selectedPersona: persona } = storeToRefs(personaStore);
const auth = getAuth();

// const userProvidedData = {
//     userId: auth.currentUser.uid, // TODO: HARDCODED!!
//   websiteSummary: `
//             - Purpose: To empower small businesses to use AI effectively for digital marketing.
//             - USP: Offers an intuitive platform with AI-driven analytics to optimize marketing campaigns.
//             - Target Audience: Small and medium-sized business owners who need to automate and refine their digital marketing strategies.
//             - Core Offerings:
//             - AI content generation
//             - Automated social media scheduling
//             - Customer segmentation and trend analysis
//             - Marketing performance analytics dashboard
//             `,
//   postsSummary: `
//             1. Post 1: "Boosting Your Brand with AI Marketing Strategies"
//                 - Challenges: High cost and complexity of current marketing tools; difficulty in finding the right customer segments.
//                 - Solutions: Automated customer segmentation; personalized content generation; cost-effective social media management strategies.
//                 - Tone: Friendly, encouraging, practical.

//             2. Post 2: "Effective Customer Engagement with Data Analytics"
//                 - Challenges: Low customer retention rates; poor understanding of customer preferences.
//                 - Solutions: Advanced data analytics for customer behavior; AI-driven content scheduling.
//                 - Tone: Conversational, actionable tips.
//             `
// };
const userProvidedData = ref(null);

// Ensure user is authenticated and set up userProvidedData
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userProvidedData.value = {
        userId: user.uid,
        websiteSummary: `
          - Purpose: To promote a holistic approach to health that balances physical and mental well-being.
          - USP: Provides education and mentoring in flexible health practices, emphasizing enjoyment and sustainability over restrictive diets and punitive exercise routines.
          - Target Audience: Individuals seeking sustainable lifestyle changes, with a focus on mental and physical health integration.
          - Core Offerings:
          - Health education programs
          - Mentorship in food psychology and sustainable health practices
          - Workshops and seminars on balanced living
          - Community support for lifestyle changes
          `,
        postsSummary: `
          1. Post 1: "Hvis bare jeg kunne blive fri for at sælge..."
              - Challenges: Discomfort with sales; difficulty in attracting new clients without traditional sales tactics.
              - Solutions: Focus on how you can help clients achieve their goals; be curious about their dreams and desires.
              - Tone: Encouraging, empathetic, supportive.

          2. Post 2: "Træning og straf - en usund sammenhæng"
              - Challenges: Unhealthy associations between exercise, food, and punishment; difficulty in finding pleasure in healthy activities.
              - Solutions: Emphasize enjoyment in food and movement; promote sustainable lifestyle changes through pleasurable activities.
              - Tone: Reflective, inspirational, community-oriented.

          3. Post 3: "Den Holistiske Sundhedstilgang"
              - Challenges: Overemphasis on physical health at the expense of mental health; cycles of dieting and overeating.
              - Solutions: Promote a holistic approach to health; integrate physical, mental, and social well-being.
              - Tone: Thought-provoking, informative, revolutionary.

          4. Post 4: "Lærdom fra en pizzadej"
              - Challenges: Overcoming initial failures in new endeavors; maintaining motivation and focus.
              - Solutions: Embrace the learning process; seek external help when needed; celebrate small victories.
              - Tone: Relatable, motivational, insightful.

          5. Post 5: "Modgang og succes i virksomhedens verden"
              - Challenges: Dealing with periods of low client influx; avoiding the temptation of quick fixes.
              - Solutions: Focus on core strengths and unique offerings; maintain resilience during tough times.
              - Tone: Honest, resilient, strategic.

          6. Post 6: "Oplad dit mindset"
              - Challenges: Maintaining a positive and productive mindset.
              - Solutions: Provide reminders and support to boost positivity and productivity.
              - Tone: Uplifting, supportive, energizing.

          7. Post 7: "Du sælger forandring"
              - Challenges: Competing with traditional sales tactics and consumer goods.
              - Solutions: Emphasize the value of transformational services; price services according to their true value.
              - Tone: Empowering, proud, assertive.
          `,
      };
    }
  });
});
const section = ref("General");

// Update age range handler
const handleAgeRangeUpdate = (event, minOrMax) => {
  console.log(persona.value);
  const personaRef = doc(db, "Personas", persona.value.personaId);
  let targetField = `targetAudience.demographics.ageRange`;
  if (minOrMax === "min") {
    persona.value.targetAudience.demographics.ageRange[0] = event;
    console.log(persona.value.targetAudience.demographics.ageRange[0], "min");
    updateDoc(personaRef, {
      [targetField]: persona.value.targetAudience.demographics.ageRange,
    });
  } else {
    persona.value.targetAudience.demographics.ageRange[1] = event;
    console.log(persona.value.targetAudience.demographics.ageRange[1], "max");
    updateDoc(personaRef, {
      [targetField]: persona.value.targetAudience.demographics.ageRange,
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-5 w-full h-full relative">
    <div v-if="!persona" class="relative z-30">
      <DialogsConfirmation
        context="Viewer"
        :buttons="{ cancel: { text: 'Cancel' }, confirm: { text: 'Generate' } }"
        @confirm="personaStore.createPersona(userProvidedData)"
      >
        <template #Button>
          <button class="text-white bg-purple-500 px-4 py-2 rounded-md w-full">Generate a persona</button>
        </template>
        <template #Text>
          <p class="text-small">Press to generate</p>
        </template>
      </DialogsConfirmation>
    </div>
    <div v-if="persona" class="w-full h-full rounded-lg p-5">
      <div
        class="h-full lg:overflow-hidden overflow-y-scroll flex flex-col lg:flex-row items-center lg:items-start gap-5"
      >
        <div class="w-full lg:max-w-[200px]">
          <!-- Side Menu -->
          <div
            class="transition-all text-xsmall font-bold p-4 rounded-lg bg-white border border-light-100 flex-grow flex lg:flex-col gap-3 select-none w-[calc(100vw-40px)] md:w-[calc(100%-0px)] overflow-x-scroll mb-5"
          >
            <p
              @click="section = 'General'"
              :class="section === 'General' ? 'bg-purple-100 text-purple-600' : ''"
              class="transition-all cursor-pointer whitespace-nowrap hover:bg-purple-100 hover:text-purple-600 text-small px-3 p-1 rounded-md"
            >
              General
            </p>
            <p
              @click="section = 'Target Audience'"
              :class="section === 'Target Audience' ? 'bg-purple-100 text-purple-600' : ''"
              class="transition-all cursor-pointer whitespace-nowrap hover:bg-purple-100 hover:text-purple-600 text-small px-3 p-1 rounded-md"
            >
              Target Audience
            </p>
            <p
              @click="section = 'Brand Analysis'"
              :class="section === 'Brand Analysis' ? 'bg-purple-100 text-purple-600' : ''"
              class="transition-all cursor-pointer whitespace-nowrap hover:bg-purple-100 hover:text-purple-600 text-small px-3 p-1 rounded-md"
            >
              Brand Analysis
            </p>
            <p
              @click="section = 'Tone of Voice'"
              :class="section === 'Tone of Voice' ? 'bg-purple-100 text-purple-600' : ''"
              class="transition-all cursor-pointer whitespace-nowrap hover:bg-purple-100 hover:text-purple-600 text-small px-3 p-1 rounded-md"
            >
              Tone of Voice
            </p>
            <p
              @click="section = 'Writing Style'"
              :class="section === 'Writing Style' ? 'bg-purple-100 text-purple-600' : ''"
              class="transition-all cursor-pointer whitespace-nowrap hover:bg-purple-100 hover:text-purple-600 text-small px-3 p-1 rounded-md"
            >
              Writing Style
            </p>
          </div>
        </div>

        <!-- Content -->
        <div
          class="transition-all rounded-lg grow-1 flex-grow w-full h-full lg:w-[calc(82%-10px)] flex flex-col items-center gap-5"
        >
          <div
            class="transition-all rounded-lg flex-grow w-full lg:overflow-y-scroll flex flex-col lg:items-center gap-5"
          >
            <!-- Genetal Section -->
            <PersonasSection v-if="section === 'General'" title="General" description="General settings.">
              <template #body>
                <p>Note Virker ikke endu:</p>
                <div class="w-full gap-4 flex justify-between">
                  <FormsInputText
                    name="personaName"
                    label="Persona Name"
                    class="text-small w-full"
                    v-model="persona.personaName"
                  />
                  <FormsInputText
                    name="website"
                    label="Website"
                    class="text-small w-full"
                    v-model="persona.website"
                  ></FormsInputText>
                </div>
              </template>
            </PersonasSection>

            <!-- Channels section -->
            <PersonasSection
              v-if="section === 'General'"
              title="Channels"
              description="Empower your persona with the right tools to create a meaningful impact. This section is more than just about connectivity—it's about crafting a cohesive and resonant brand experience across every touchpoint."
            >
              <template #body>
                <div class="w-full grid grid-cols-1 md:grid-cols-2 mdxl:grid-cols-3 xl:grid-cols-5 gap-3">
                  <PersonasChannel
                    v-for="(channel, i) in persona.integrations"
                    :key="channel + i"
                    :channel="channel"
                    :personaId="persona.personaId"
                  />
                  <DialogsGeneric type="addIntegration" context="Viewer">
                    <div
                      class="transition-all group flex gap-2 items-center border border-creme px-2 py-4 rounded-md hover:border-purple-dark cursor-pointer"
                    >
                      <NuxtIcon name="Add" class="transition-all text-creme group-hover:text-purple-dark" filled />
                      <p class="transition-all text-xsmall font-normal group-hover:text-purple-dark text-center w-full">
                        Explore integrations
                      </p>
                    </div>
                  </DialogsGeneric>
                </div>
              </template>
            </PersonasSection>

            <div
              v-if="section === 'General'"
              class="transition-all text-xsmall font-bold p-4 rounded-lg bg-white border border-light-100 flex flex-col gap-3 select-none w-[calc(100vw-40px)] md:w-[calc(100%-0px)]"
            >
              <p class="text-xsmall mb-2">Options</p>
              <DialogsConfirmation
                context="Viewer"
                :buttons="{ cancel: { text: 'Cancel' }, confirm: { text: 'Generate' } }"
                @confirm="personaStore.createPersona(userProvidedData)"
              >
                <template #Button>
                  <button class="text-white bg-purple-500 px-4 py-2 rounded-md w-full">Re-generate</button>
                </template>
                <template #Text>
                  <p class="text-small">
                    Are you sure that you'd like to overwrite your <strong>{{ persona.personaName }}</strong> persona by
                    re-generating? Your current progress will be lost. Type "Generate persona and delete content" to
                    confirm.

                    <br><br> <p>Note:Dette generer lige nu en ny, og sletter ikke det gamle</p>
                  </p>
                </template>
              </DialogsConfirmation>
              <DialogsConfirmation
                context="Viewer"
                :buttons="{ cancel: { text: 'Cancel' }, confirm: { text: 'Delete' } }"
                @confirm="personaStore.deletePersona(persona.personaId)"
              >
                <template #Button>
                  <button class="text-white bg-red px-4 py-2 rounded-md w-full">Delete</button>
                </template>
                <template #Text>
                  <p class="text-small">
                    Are you sure you'd like to delete your <strong>{{ persona.personaName }}</strong> persona, your
                    current progress will be lost? Type "Delete persona and it's content" to confirm.
                  </p>
                  <p class="text-small">Note: Dette bør også at slette alt content lavet med dette persona!</p>
                </template>
              </DialogsConfirmation>
            </div>

            <!-- Target Auidence Section -->
            <PersonasSection
              v-if="section === 'Target Audience'"
              title="Target Audience"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio vitae, eius sapiente repellat quae inventore reprehenderit id obcaecati, voluptates officia corrupti at? Ipsam praesentium vel hic, obcaecati totam amet atque."
            >
              <template #head>
                <p class="w-full text-center text-xsmall font-semibold">Demopraphics</p>
                <div class="flex flex-wrap justify-center self-center gap-1 w-2/3">
                  <DialogsGeneric
                    type="tagManager"
                    context="Viewer"
                    :data="{
                      tags: persona.targetAudience.demographics.behaviors,
                      personaId: persona.personaId,
                      identifier: 'targetAudience.demographics.behaviors',
                      placeholder: 'Add a behavior',
                    }"
                    @update:data="persona.targetAudience.demographics.behaviors = $event.tags"
                  >
                    <div class="flex flex-wrap justify-center gap-1">
                      <div class="transition-all flex flex-wrap justify-center gap-1 cursor-pointer rounded-md group">
                        <p
                          v-for="tag in persona.targetAudience.demographics.behaviors"
                          class="transition-all bg-purple-100 text-purple-600 group-hover:bg-purple-400 group-hover:text-white px-2 py-1 rounded-md text-xsmall whitespace-nowrap"
                        >
                          {{ tag }}
                        </p>
                      </div>
                    </div>
                  </DialogsGeneric>
                </div>
                <div class="flex flex-wrap justify-center self-center gap-1 w-2/3">
                  <DialogsGeneric
                    type="ageRange"
                    context="Viewer"
                    :data="{
                      sliderValue1: persona.targetAudience.demographics.ageRange[0],
                      sliderValue2: persona.targetAudience.demographics.ageRange[1],
                      identifier: 'targetAudience.demographics.ageRange',
                      placeholder: 'Change the min and max age of your target audience',
                      min: 0,
                      max: 120,
                    }"
                    @update:dataAge1="handleAgeRangeUpdate($event, 'min')"
                    @update:dataAge2="handleAgeRangeUpdate($event, 'max')"
                  >
                    <div class="group relative cursor-pointer">
                      <p
                        class="transition-all bg-purple-100 text-purple-600 group-hover:bg-purple-400 group-hover:text-white rounded-md text-xsmall px-2 py-1 whitespace-nowrap"
                      >
                        {{ persona.targetAudience.demographics.ageRange[0] }} -
                        {{ persona.targetAudience.demographics.ageRange[1] }} years old
                      </p>
                    </div>
                  </DialogsGeneric>
                  <!-- <FormsRangeSlider @change="updateAgeRange" v-model:sliderValue1="persona.targetAudience.ageRange[0]" v-model:sliderValue2="persona.targetAudience.ageRange[1]" :showLabel="false" /> -->
                  <DialogsGeneric
                    type="tagManager"
                    context="Viewer"
                    :data="{
                      tags: persona.targetAudience.demographics.gender,
                      personaId: persona.personaId,
                      identifier: 'targetAudience.demographics.gender',
                      placeholder: 'Add a gender',
                    }"
                    @update:data="persona.targetAudience.demographics.gender = $event.tags"
                  >
                    <div class="flex flex-wrap justify-center gap-1">
                      <div class="transition-all flex flex-wrap justify-center gap-1 cursor-pointer rounded-md group">
                        <p
                          v-for="tag in persona.targetAudience.demographics.gender"
                          class="transition-all bg-purple-100 text-purple-600 group-hover:bg-purple-400 group-hover:text-white px-2 py-1 rounded-md text-xsmall whitespace-nowrap"
                        >
                          {{ tag }}
                        </p>
                      </div>
                    </div>
                  </DialogsGeneric>
                  <DialogsGeneric
                    type="tagManager"
                    context="Viewer"
                    :data="{
                      tags: persona.targetAudience.demographics.professions,
                      personaId: persona.personaId,
                      identifier: 'targetAudience.demographics.professions',
                      placeholder: 'Add a profession',
                    }"
                    @update:data="persona.targetAudience.demographics.professions = $event.tags"
                  >
                    <div class="flex flex-wrap justify-center gap-1">
                      <div class="transition-all flex flex-wrap justify-center gap-1 cursor-pointer rounded-md group">
                        <p
                          v-for="tag in persona.targetAudience.demographics.professions"
                          class="transition-all bg-purple-100 text-purple-600 group-hover:bg-purple-400 group-hover:text-white px-2 py-1 rounded-md text-xsmall whitespace-nowrap"
                        >
                          {{ tag }}
                        </p>
                      </div>
                    </div>
                  </DialogsGeneric>
                  <DialogsGeneric
                    type="tagManager"
                    context="Viewer"
                    :data="{
                      tags: persona.targetAudience.demographics.geographicalLocations,
                      personaId: persona.personaId,
                      identifier: 'targetAudience.demographics.geographicalLocations',
                      placeholder: 'Add a country or region',
                    }"
                    @update:data="persona.targetAudience.demographics.geographicalLocations = $event.tags"
                  >
                    <div class="flex flex-wrap justify-center gap-1">
                      <div class="transition-all flex flex-wrap justify-center gap-1 cursor-pointer rounded-md group">
                        <p
                          v-for="tag in persona.targetAudience.demographics.geographicalLocations"
                          class="transition-all bg-purple-100 text-purple-600 group-hover:bg-purple-400 group-hover:text-white px-2 py-1 rounded-md text-xsmall whitespace-nowrap"
                        >
                          {{ tag }}
                        </p>
                      </div>
                    </div>
                  </DialogsGeneric>
                </div>
              </template>
              <template #body>
                <PersonasGCIP :persona="persona" />
              </template>
            </PersonasSection>

            <!-- Brand Analysis Section -->
            <PersonasSection
              v-if="section === 'Brand Analysis'"
              title="Brand Analysis"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio vitae, eius sapiente repellat quae inventore reprehenderit id obcaecati, voluptates officia corrupti at? Ipsam praesentium vel hic, obcaecati totam amet atque."
            >
              <template #body>
                <div class="flex justify-center flex-wrap gap-10 w-full">
                  <div class="min-w-[250px] w-[calc(40%-12px)]">
                    <DialogsGeneric
                      type="tagManager"
                      context="Viewer"
                      :data="{
                        tags: persona.brandAnalysis.values,
                        personaId: persona.personaId,
                        identifier: 'brandAnalysis.values',
                        placeholder: 'Add a brand value',
                      }"
                      @update:data="persona.brandAnalysis.values = $event.tags"
                    >
                      <div class="flex flex-col items-center justify-center">
                        <p class="text-xsmall font-semibold mb-3">Values</p>
                        <div class="flex flex-wrap justify-center gap-1">
                          <div
                            class="transition-all flex flex-wrap justify-center gap-1 cursor-pointer rounded-md group"
                          >
                            <p
                              v-for="tag in persona.brandAnalysis.values"
                              class="transition-all bg-purple-100 text-purple-600 group-hover:bg-purple-400 group-hover:text-white px-2 py-1 rounded-md text-xsmall whitespace-nowrap"
                            >
                              {{ tag }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogsGeneric>
                  </div>
                  <div class="min-w-[250px] w-[calc(40%-12px)]">
                    <DialogsGeneric
                      type="tagManager"
                      context="Viewer"
                      :data="{
                        tags: persona.brandAnalysis.coreOfferings,
                        personaId: persona.personaId,
                        identifier: 'brandAnalysis.coreOfferings',
                        placeholder: 'Add a core offering',
                      }"
                      @update:data="persona.brandAnalysis.coreOfferings = $event.tags"
                    >
                      <div class="flex flex-col items-center justify-center">
                        <p class="text-xsmall font-semibold mb-3">Core Offerings</p>
                        <div class="flex flex-wrap justify-center gap-1">
                          <div
                            class="transition-all flex flex-wrap justify-center gap-1 cursor-pointer rounded-md group"
                          >
                            <p
                              v-for="tag in persona.brandAnalysis.coreOfferings"
                              class="transition-all bg-purple-100 text-purple-600 group-hover:bg-purple-400 group-hover:text-white px-2 py-1 rounded-md text-xsmall whitespace-nowrap"
                            >
                              {{ tag }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogsGeneric>
                  </div>
                </div>
                <PersonasSWOT :persona="persona" />
              </template>
            </PersonasSection>

            <PersonasSection
              v-if="section === 'Tone of Voice'"
              title="Tone of Voice"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio vitae, eius sapiente repellat quae inventore reprehenderit id obcaecati, voluptates officia corrupti at? Ipsam praesentium vel hic, obcaecati totam amet atque."
            >
              <template #body>
                <div class="w-full flex flex-col gap-2">
                  <p class="text-xsmall font-bold">Characteristics</p>
                  <p class="text-xsmall text-lighterdark font-normal lg:max-w-[100%] mdxl:max-w-[50%] xl:max-w-[100%]">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  </p>
                  <div class="grid xs:grid-cols-1 sm:grid-cols-2 mdxl:grid-cols-4 gap-4 w-full">
                    <PersonasCharacteristics
                      v-for="(characteristic, i) in persona.toneOfVoice.characteristics"
                      :personaId="persona.personaId"
                      :index="i"
                      :key="i"
                      :data="characteristic.description"
                      :title="characteristic.key"
                      :showDrawer="openDrawerId"
                      @update:data="
                        (event) => {
                          (characteristic.description = event.description), (characteristic.key = event.key);
                        }
                      "
                    />
                  </div>
                </div>
                <PersonasDoAndDont :persona="persona" />
              </template>
            </PersonasSection>
            <PersonasSection
              v-if="section === 'Writing Style'"
              title="Writing Style"
              description="These are NOT editable in this beta version. But coming in an update soon!"
            >
              <template #body>
                <div class="w-full flex flex-col gap-2">
                  <p class="text-xsmall text-lighterdark font-normal lg:max-w-[100%] mdxl:max-w-[50%] xl:max-w-[100%]">
                    NOTE: Sentence length og EmojiUse Skal
                    flyttes til "Writing Style" i firebase NOTE: Skal dette kontrolleres pr. platform? (Instagram,
                    Facebook, LinkedIn, etc.)-
                  </p>
                </div>
                <div class="flex flex-wrap">
                  <FormsInputText disabled
                    v-model="persona.writingStyle.sentenceLength"
                    label="Sentence length"
                  />
                  <FormsInputText disabled v-model="persona.writingStyle.emojiUse" label="Empoji use" />
                  Visual Elements:

Use of Emojis: How and when to use emojis.
Formatting: Bold, italics, bullet points, etc.
                  <FormsInputText disabled v-model="persona.writingStyle.formality" label="Formality" />
                  <p>High Formality: Strictly professional with formal language.
Moderate Formality: A balance between professional and casual.
Low Formality: Very casual and relaxed.</p>
                  <FormsInputText disabled v-model="persona.writingStyle.anecdotes" label="Anecdotes" />
                  <FormsInputText disabled v-model="persona.writingStyle.personalStories" label="Personal Stories" />
                  Anecdotes and Stories:

Personal Stories: Includes personal experiences and anecdotes.
Case Studies: Uses case studies and examples.
                  <FormsInputText disabled v-model="persona.writingStyle.pointOfView" label="Point Of View" />
                  First Person: Uses "I" or "we" (e.g., "We believe in...").
Second Person: Uses "you" (e.g., "You will benefit from...").
Third Person: Uses "he," "she," "they," or the brand name (e.g., "BrandBrainAI provides...").
                  <FormsInputText disabled v-model="persona.writingStyle.relatability" label="Relateability" />
                  High Relatability: Uses personal stories and anecdotes to connect with the audience.
Moderate Relatability: Mix of relatable content and informational content.
Low Relatability: Focuses primarily on facts and information.
                  <FormsInputText disabled v-model="persona.writingStyle.tone" label="Tone" />
                  Formal: Professional and sophisticated (e.g., "We are pleased to inform you...").
Informal: Casual and conversational (e.g., "Hey there! Just wanted to let you know...").
Humorous: Light-hearted and fun (e.g., "Why did the marketer cross the road?...").
Serious: Straightforward and no-nonsense (e.g., "It's crucial to address...").
Inspirational: Motivating and encouraging (e.g., "You have the power to achieve...").
                  <FormsInputText disabled v-model="persona.writingStyle.tone" label="Voice" />
                  <p>Active Voice: Uses active sentence structures (e.g., "We launched the product...").</p>
                  <p>Passive Voice: Uses passive sentence structures (e.g., "The product was launched...").</p>
                </div>
              </template>
            </PersonasSection>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
