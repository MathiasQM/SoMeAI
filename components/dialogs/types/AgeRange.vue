<template>
  <div>
    <div class="transition-all border-b border-creme dark:border-lightdark  p-5 flex items-center gap-5">
      <!-- <NuxtIcon name="Search" class="transition-all text-lightgrey text-2xl" /> -->
      <p class="text-xsmall bg-creme rounded-md whitespace-nowrap px-2 py-1">Age Range</p>
      <div class="flex flex-col items-center justify-around w-[calc(100%-150px)]">
        <div class="w-full flex flex-col items-center pt-5 gap-3 border border-creme bg-white rounded-lg p-3 pb-5">
            <div class="container">
              <div class="slider-track" :style="trackStyle"></div>
              <input type="range" :min="data.min" :max="data.max" v-model="sliderValue1" @change="updateSliders" @input="updateSlidersOnInut" />
              <input type="range" :min="data.min" :max="data.max" v-model="sliderValue2" @change="updateSliders" @input="updateSlidersOnInut" />
            </div>
        </div>
      </div>
    </div>
    <div class="h-44 w-full p-5 flex items-center justify-evenly">
      <div class="w-32 h-32 p-4 flex flex-col justify-center items-center bg-purple-dark/30 rounded-lg">
        <p class="text-p text-purple-dark">Minimum</p>
        <p class="text-h2 text-purple-dark">{{ sliderValue1 }}</p>
      </div>
      <div class="w-32 h-32 p-4 flex flex-col justify-center items-center bg-purple-dark/30 rounded-lg">
        <p class="text-p text-purple-dark">Maximum</p>
        <p class="text-h2 text-purple-dark">{{ sliderValue2 }}</p>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

// Define props
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

// Define emits
const emit = defineEmits(['update:sliderValue1', 'update:sliderValue2']);

// Reactive references with initial values
const sliderValue1 = ref(props.data.sliderValue1);
const sliderValue2 = ref(props.data.sliderValue2);

// Watcher function to emit updates for external v-model binding
const updateValue = (value, slider) => {
  emit(`update:${slider}`, value);
};

// Computed property for dynamic styling of the slider track
const trackStyle = computed(() => {
  const percent1 = (sliderValue1.value / props.data.max) * 100;
  const percent2 = (sliderValue2.value / props.data.max) * 100;
  return {
    background: `linear-gradient(to right, #E7E7E7 ${percent1}% , #7B61FF ${percent1}% , #7B61FF ${percent2}%, #E7E7E7 ${percent2}%)`,
  };
});

// Function to handle slider updates and enforce minimum gap
const updateSliders = () => {
  if (sliderValue2.value - sliderValue1.value <= 0) {
    if (sliderValue1.value >= sliderValue2.value) {
      sliderValue1.value = Math.max(sliderValue2.value - 1, props.data.min);
      updateValue(sliderValue1.value, 'sliderValue1');
    } else {
      sliderValue2.value = Math.min(sliderValue1.value + 1, props.data.max);
      updateValue(sliderValue2.value, 'sliderValue2');
    }
  }
  updateValue(sliderValue1.value, 'sliderValue1');
  updateValue(sliderValue2.value, 'sliderValue2');
};
// Function to handle slider updates and enforce minimum gap
const updateSlidersOnInut = () => {
  if (sliderValue2.value - sliderValue1.value <= 0) {
    if (sliderValue1.value >= sliderValue2.value) {
      sliderValue1.value = Math.max(sliderValue2.value - 1, props.data.min);
    } else {
      sliderValue2.value = Math.min(sliderValue1.value + 1, props.data.max);
    }
  }
};

</script>
<style scoped>
.wrapper{
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    /* border:1px solid #E7E7E7; */
    padding: 14px 5px;
    /* border-radius: 10px; */
}
.container{
    position: relative;
    width: 100%;

}
input[type="range"]{
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    outline: none;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    background-color: transparent;
    pointer-events: none;
}
.slider-track{
    width: 100%;
    height: 10px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    border-radius: 5px;
}
input[type="range"]::-webkit-slider-runnable-track{
    -webkit-appearance: none;
    height: 5px;;
}
input[type="range"]::-moz-range-track{
    -moz-appearance: none;
    height: 5px;
}
input[type="range"]::-ms-track{
    appearance: none;
    height: 5px;
}
input[type="range"]::-webkit-slider-thumb{
    -webkit-appearance: none;
    height: 1.2em;
    width: 1.2em;
    background-color: #7B61FF;
    border: #ffffff 2px solid;
    cursor: pointer;
    margin-top: -7px;
    pointer-events: auto;
    border-radius: 50%;
}
input[type="range"]::-moz-range-thumb{
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    cursor: pointer;
    border-radius: 50%;
    background-color: #7B61FF;
    pointer-events: auto;
}
input[type="range"]::-ms-thumb{
    appearance: none;
    height: 1em;
    width: 1em;
    cursor: pointer;
    border-radius: 50%;
    background-color: #7B61FF;
    pointer-events: auto;
}
input[type="range"]:active::-webkit-slider-thumb{
    background-color: #ffffff;
    border: 3px solid #7B61FF;
}
.values{
    background-color: #7B61FF;
    width: 32%;
    position: relative;
    margin: auto;
    padding: 10px 0;
    border-radius: 5px;
    text-align: center;
    font-weight: 500;
    font-size: 25px;
    color: #ffffff;
}
.values:before{
    content: "";
    position: absolute;
    height: 0;
    width: 0;
    border-top: 15px solid #7B61FF;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    margin: auto;
    bottom: -14px;
    left: 0;
    right: 0;
}
</style>
