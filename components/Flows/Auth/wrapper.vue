<script setup>
import { useUserStore } from "@/stores/Users/useUserStore";

import mapImg from "~/assets/images/map.png";
import radialFace from "~/assets/images/radial-fade.png";

const userStore = useUserStore();
const { userAuth, showSignup, stepIndex } = storeToRefs(userStore);

const icons = [
  { name: "Google", delay: 0 },
  { name: "Facebook", delay: 0.2 },
  { name: "Meta", delay: 0 },
  { name: "Instagram", delay: 0.2 },
  { name: "YouTube", delay: 0 },
  { name: "Slack", delay: 0.2 },
  { name: "Gmail", delay: 0 },
  { name: "SendGrid", delay: 0.2 },
  { name: "Threads", delay: 0 },
  { name: "Wordpress", delay: 0.2 }, // Note: Listed twice in the original; only inclu0
  { name: "Dribbble", delay: 0 },
  { name: "Discord", delay: 0.2 },
  { name: "Twitter", delay: 0 },
  { name: "TikTok", delay: 0.2 },
  { name: "GoogleAds", delay: 0 },
  { name: "Reddit", delay: 0.2 },
  { name: "Pinterest", delay: 0 },
  { name: "LinkedIn", delay: 0.2 },
];

// Randomize icons and assign alternating delays
// Method to randomize icons and assign alternating delays
const getRandomizedIcons = () => {
  return icons
    .map((icon) => ({ ...icon, delay: Math.random() })) // Re-randomize delay or just shuffle
    .sort(() => 0.5 - Math.random())
    .map((icon, index) => ({ ...icon, delay: (index % 2) * 0.2 }));
};
</script>
<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="min-w-[350px] relative bg-white border border-light-100 p-5 rounded-lg">
      <div class="relative w-full">
        <div
          v-if="!showSignup || stepIndex === 3"
          class="relative flex justify-center items-center gap-3 h-28 overflow-hidden w-full mt-20"
        >
          <div class="absolute w-full h-[40px] top-0 left-0 bg-gradient-to-b from-white to-white/0 z-10"></div>
          <p class="relative z-10 text-psmall font-bold w-full px-4 py-2 text-center">Welcome</p>
          <span class="absolute w-28 h-28 aspect-square border border-purple-dark rounded-full opacity-25"></span>
          <span class="absolute w-44 h-44 aspect-square border border-purple-dark rounded-full opacity-50"></span>
          <span class="absolute w-64 h-64 aspect-square border border-purple-dark rounded-full opacity-75"></span>
          <div class="absolute w-full h-[40px] bottom-0 left-0 bg-gradient-to-t from-white to-white/0 z-10"></div>
        </div>
        <div
          class="flex justify-center items-center gap-2 h-42 overflow-hidden marquee-container w-full mt-20"
          v-if="showSignup && stepIndex <= 2"
        >
          <div class="flex justify-center items-center" v-if="stepIndex === 1">
            <span class="absolute z-10 w-5 h-5 bg-purple-dark rounded-full border-[3px] border-white shadow"></span>
            <div class="w-5 h-5 bg-purple-dark rounded-full animate-ping-slower absolute z-[5]"></div>
            <img class="absolute z-[2] h-[170px]" :src="radialFace" alt="" />
            <img class="relative z-0" :src="mapImg" alt="" />
          </div>
          <div class="absolute w-full h-[40px] top-0 left-0 bg-gradient-to-b from-white to-white/0 z-10"></div>

          <div
            v-if="stepIndex === 0"
            v-for="(n, i) in [1, 2, 3, 4, 5]"
            :key="n"
            :class="i % 2 === 0 ? 'mt-10' : ''"
            class="marquee-content flex gap-2"
          >
            <template v-for="(icon, index) in getRandomizedIcons()" :key="`icon-${n}-${index}`">
              <div class="opacity-75 p-3 border border-creme rounded-lg">
                <NuxtIcon :name="icon.name" filled class="text-2xl cursor-pointer" />
              </div>
            </template>
          </div>
          <div v-if="stepIndex === 2" class="flex items-center">
            <div class="absolute left-0 from w-full flex gap-5 justify-center items-center">
              <div class="w-8 h-8 bg-purple-dark rounded-full animate-ping-slower absolute z-[5]"></div>
              <div class="w-[4rem] h-[4rem] bg-purple-dark rounded-full animate-ping-slower absolute z-[5]"></div>
              <div class="w-[6rem] h-[6rem] bg-purple-dark rounded-full animate-ping-slower absolute z-[5]"></div>
            </div>
            <div class="shadow w-20 h-20 bg-white relative z-20 rounded-full flex justify-center items-center">
              <NuxtIcon name="Audience" filled class="relative z-10 text-purple-dark text-[50px]" />
            </div>
          </div>

          <div class="absolute w-full h-[40px] bottom-0 left-0 bg-gradient-to-t from-white to-white/0 z-10"></div>
        </div>
      </div>
      <div class="absolute z-20 top-0 left-0 w-full py-2 flex flex-col items-center">
        <div @click="userStore.decrementStep" class="flex items-center justify-between w-full px-5">
          <p class="flex items-center font-medium text-xsmall w-20">
            <NuxtIcon name="ChevronLeft" class="text-2xl cursor-pointer" />Back
          </p>
          <p class="text-small">BrandBrainAI</p>
          <p @click="showSignup = !showSignup" class="text-small text-right text-purple-dark w-20">
            {{ showSignup ? "Login" : "Signup" }}
          </p>
        </div>
        <div v-if="showSignup" class="flex gap-2 mt-5">
          <span
            :class="stepIndex >= 0 ? 'bg-darkgrey/70' : 'bg-darkgrey/30'"
            class="transition-all h-[2px] w-5 block"
          ></span>
          <span
            :class="stepIndex >= 1 ? 'bg-darkgrey/70' : 'bg-darkgrey/30'"
            class="transition-all h-[2px] w-5 block"
          ></span>
          <span
            :class="stepIndex >= 2 ? 'bg-darkgrey/70' : 'bg-darkgrey/30'"
            class="transition-all h-[2px] w-5 block"
          ></span>
          <span
            :class="stepIndex >= 3 ? 'bg-darkgrey/70' : 'bg-darkgrey/30'"
            class="transition-all h-[2px] w-5 block"
          ></span>
          <!-- <span :class="stepIndex >= 4 ? 'bg-darkgrey/70' : 'bg-darkgrey/30'" class="transition-all h-[2px] w-5 block"></span> -->
        </div>
      </div>

      <FlowsAuthSignUpSteps v-if="showSignup" />
      <FlowsAuthSignin v-else />

      <p class="text-xsmall text-center mt-5">
        Private & secure. See our <span class="underline text-purple-dark">privacy policy.</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  overflow: hidden;
  height: 168px; /* This height should be less than the total height of your icons to ensure scrolling */
  position: relative;
  width: 100%;
}

.marquee-content {
  display: flex;
  flex-direction: column;
  animation: marquee-vertical 40s linear infinite;
}

@keyframes marquee-vertical {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%); /* Adjust if more than double content is shown */
  }
}

.shadow {
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}

.animate-ping-slower {
  animation-duration: 4s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-direction: normal;
  animation-fill-mode: none;
  animation-play-state: running;
  animation-name: pingSlower;
  animation-timeline: auto;
  animation-range-start: normal;
  animation-range-end: normal;
}

@keyframes pingSlower {
  75%,
  100% {
    transform: scale(4.5);
    opacity: 0;
  }
}

.animate-fade-in-grow {
  animation: fadeInGrow 0.5s cubic-bezier(0, 0, 0, 1) forwards;
}
@keyframes fadeInGrow {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.radialGradient {
  background-image: radial-gradient(circle at center, white, purple);
}
</style>
