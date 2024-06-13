<script setup>
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        required: false,
        default: 'Type something...'
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
        default: ''
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },
    autoComplete: {
        type: String,
        required: false,
        default: 'on'
    },
    type: {
        type: String,
        required: false,
        default: 'text'
    }
});

const emit = defineEmits(['update:modelValue']);
const inputValue = ref(props.modelValue); // Local reactive property for input value
const localStorageKey = `textInputValue_${props.name}`; // Unique key for each instance

const saveToLocalStorage = (value) => {
    localStorage.setItem(localStorageKey, value);
};

const getFromLocalStorage = () => {
    return localStorage.getItem(localStorageKey);
};

const initializeValue = () => {
    if (props.useLocalStorage) {
        const storedValue = getFromLocalStorage();
        if (storedValue) {
            inputValue.value = storedValue;
            emit('update:modelValue', storedValue); // Emit the updated value
        }
    }
};

watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue); // Emit the updated value
    if (props.useLocalStorage) {
        saveToLocalStorage(newValue);
    }
});

onMounted(() => {
    initializeValue();
});


</script>

<template>
    <div class="relative w-full">
      <div class="flex w-full">
            <label :class="disabled ? 'text-grey' : ''" class="text-xsmall font-medium pl-1 text-darkgrey dark:text-white mb-2 w-full">{{label}}</label>
            <div v-if="info !== ''" class="group relative flex gap-5">
              <NuxtIcon name="Info" class="text-xsmall pl-1 text-lightgrey dark:text-creme cursor-pointer relative" />
              <div class="bg-darkgrey dark:bg-white rounded-sm w-32 h-10 p-1 left-5 bottom-5 transition-al hidden group-hover:block absolute">
                <p class="text-white dark:text-black text-xsmall leading-4">{{ info }}</p>
              </div>
            </div>
        </div>
        <input :autocomplete="autoComplete" :disabled="disabled" :type="type" class="h-12 border disabled:cursor-not-allowed border-creme outline-none text-left rounded-lg w-full py-1 pl-5 dark:bg-lighterdark dark:text-white placeholder:text-lightgrey dark:placeholder:text-creme focus:outline-purple-dark cursor-pointer text-small" :name="name" v-model="inputValue" :placeholder="placeholder" />
    </div>
</template>
  