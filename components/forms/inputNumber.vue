<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        required: false,
        default: 'Enter a number'
    },
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    useLocalStorage: {
        type: Boolean,
        required: false,
        default: false
    },
    info: {
        type: String,
        required: false,
        default: ''
    },
    modelValue: {
        type: String,
        required: false,
        default: '0'
    }
});
const emit = defineEmits(['update:modelValue']);
const inputValue = ref(props.modelValue); // Local reactive property for input value
const localStorageKey = `numericInputValue_${props.name}`; // Unique key for each instance

const saveToLocalStorage = (value) => {
    localStorage.setItem(localStorageKey, value);
};

const getFromLocalStorage = () => {
    const storedValue = localStorage.getItem(localStorageKey);
    return storedValue !== null ? storedValue : props.modelValue;
};

const initializeValue = () => {
    if (props.useLocalStorage) {
        const storedValue = getFromLocalStorage();
        inputValue.value = storedValue;
        emit('update:modelValue', storedValue); // Emit the updated value
    }
};

watch(inputValue, (newValue) => {
    if (!isNaN(newValue)) {
        emit('update:modelValue', newValue.toString()); // Emit the updated value
        if (props.useLocalStorage) {
            saveToLocalStorage(newValue.toString());
        }
    }
});

onMounted(() => {
    initializeValue();
});

</script>

<template>
    <div class="relative">
      <div class="flex">
            <label class="text-xsmall pl-1 text-lightgrey dark:text-creme font-bold mb-2">{{label}}</label>
            <div v-if="info !== ''" class="group relative flex gap-5">
              <NuxtIcon name="Info" class="text-xsmall pl-1 text-lightgrey dark:text-creme cursor-pointer relative" />
              <div class="bg-darkgrey dark:bg-white rounded-sm w-32 h-10 p-1 left-5 bottom-5 transition-al hidden group-hover:block absolute">
                <p class="text-white dark:text-black text-xsmall leading-4">{{ info }}</p>
              </div>
            </div>
        </div>
        <input type="number" 
               class="border border-creme outline-none text-left rounded-md w-52 py-1 pl-5 dark:bg-lighterdark dark:text-white placeholder:text-lightgrey dark:placeholder:text-creme focus:outline-purple-dark cursor-pointer" 
               :name="name" 
               v-model.number="inputValue" 
               :placeholder="placeholder" />
      </div>
</template>