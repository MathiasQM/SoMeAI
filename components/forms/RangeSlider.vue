<template>
  <div class="wrapper flex flex-col justify-around">
    <div class="flex flex-col items-center justify-around">
      <p class="text-xsmall font-medium w-full text-left">{{ text }}</p>
      <div class="w-full flex flex-col items-center pt-5 gap-3 border border-creme bg-white rounded-lg p-3 pb-5">
        <div class="flex w-full">
          <div class="container">
            <div class="slider-track" :style="trackStyle"></div>
            <input
              v-if="props.type === 'single'"
              type="range"
              :min="min"
              :max="max"
              :step="step"
              v-model="sliderValue1"
              @input="updateSingleSlider"
            />
            <input v-else type="range" :min="min" :max="max" v-model="sliderValue1" @input="updateSliders" />
            <input
              v-if="props.type !== 'single'"
              type="range"
              :min="min"
              :max="max"
              v-model="sliderValue2"
              @input="updateSliders"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch, onMounted } from "vue";

// Define props
const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: String,
    default: "1",
  },
  text: {
    type: String,
    default: "",
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: "range",
  },
  initialSliderValue: {
    type: Number,
    default: 0.0,
  },
});

// Define emits
const emit = defineEmits(["update:sliderValue1", "update:sliderValue2"]);

// Reactive references with initial values
const sliderValue1 = ref(0.0);
const sliderValue2 = ref(1.0);

// Watcher function to emit updates for external v-model binding
const updateValue = (value, slider) => {
  emit(`update:${slider}`, value);
};

// Set initial slider value on component mount
onMounted(() => {
  sliderValue1.value = props.initialSliderValue;
});

// Computed property for dynamic styling of the slider track
const trackStyle = computed(() => {
  if (props.type === "single") {
    const percent1 = (sliderValue1.value / 1.0) * 100;
    return {
      background: `linear-gradient(to right, #7B61FF ${percent1}%, #E7E7E7 ${percent1}%)`,
    };
  } else {
    const percent1 = (sliderValue1.value / props.max) * 100;
    const percent2 = (sliderValue2.value / props.max) * 100;
    return {
      background: `linear-gradient(to right, #E7E7E7 ${percent1}%, #7B61FF ${percent1}%, #7B61FF ${percent2}%, #E7E7E7 ${percent2}%)`,
    };
  }
});

// Function to handle single slider updates
const updateSingleSlider = () => {
  updateValue(sliderValue1.value, "sliderValue1");
};

// Function to handle double slider updates and enforce minimum gap
const updateSliders = () => {
  if (sliderValue2.value - sliderValue1.value <= 0) {
    if (sliderValue1.value >= sliderValue2.value) {
      sliderValue1.value = Math.max(sliderValue2.value - 1, props.min);
      updateValue(sliderValue1.value, "sliderValue1");
    } else {
      sliderValue2.value = Math.min(sliderValue1.value + 1, props.max);
      updateValue(sliderValue2.value, "sliderValue2");
    }
  }
  updateValue(sliderValue1.value, "sliderValue1");
  updateValue(sliderValue2.value, "sliderValue2");
};
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 14px 5px;
}
.container {
  position: relative;
  width: 100%;
}
input[type="range"] {
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
.slider-track {
  width: 100%;
  height: 10px;
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  border-radius: 5px;
}
input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  height: 5px;
}
input[type="range"]::-moz-range-track {
  -moz-appearance: none;
  height: 5px;
}
input[type="range"]::-ms-track {
  appearance: none;
  height: 5px;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1.2em;
  width: 1.2em;
  background-color: #7b61ff;
  border: #ffffff 2px solid;
  cursor: pointer;
  margin-top: -7px;
  pointer-events: auto;
  border-radius: 50%;
}
input[type="range"]::-moz-range-thumb {
  -webkit-appearance: none;
  height: 1em;
  width: 1em;
  cursor: pointer;
  border-radius: 50%;
  background-color: #7b61ff;
  pointer-events: auto;
}
input[type="range"]::-ms-thumb {
  appearance: none;
  height: 1em;
  width: 1em;
  cursor: pointer;
  border-radius: 50%;
  background-color: #7b61ff;
  pointer-events: auto;
}
input[type="range"]:active::-webkit-slider-thumb {
  background-color: #ffffff;
  border: 3px solid #7b61ff;
}
.values {
  background-color: #7b61ff;
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
.values:before {
  content: "";
  position: absolute;
  height: 0;
  width: 0;
  border-top: 15px solid #7b61ff;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  margin: auto;
  bottom: -14px;
  left: 0;
  right: 0;
}
</style>
