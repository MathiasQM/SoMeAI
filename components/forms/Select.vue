<script setup>
const props = defineProps({
    options: {
        type: Object,
        required: true
    },
    selected: {
        type: String,
        required: false
    },
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
        required: false 
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
    }
})

const emit = defineEmits(['update:modelValue']);

const openSelect = ref(false);
const inputValue = ref(props.selected); // Local reactive property for input value
const filterText = ref(''); // Reactive property for the filter text
const tempFilterText = ref(''); // Temporary storage for filter text
const localStorageKey = `selectedOption_${props.name}`; // Unique key for each instance

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
            filterText.value = storedValue;
            emit('update:modelValue', storedValue); // Emit the updated value
        } else if (props.selected) {
            inputValue.value = props.selected;
            filterText.value = props.selected;
            saveToLocalStorage(props.selected);
            emit('update:modelValue', props.selected); // Emit the updated value
        }
    } else if (props.selected) {
        inputValue.value = props.selected;
        filterText.value = props.selected;
    }
};

watch(inputValue, (newValue) => {
    if (props.useLocalStorage) {
        saveToLocalStorage(newValue);
    }
});

watch(() => props.selected, (newVal) => {
    if (newVal !== inputValue.value) {
        inputValue.value = newVal;
        filterText.value = newVal;
        if (props.useLocalStorage) {
            saveToLocalStorage(newVal);
        }
    }
});

const filteredOptions = computed(() => {
        const optionsArray = Object.values(props.options);
        if (!filterText.value) {
            return optionsArray;
        }
        return optionsArray.filter(option => 
            option.toLowerCase().includes(filterText.value.toLowerCase())
        );
});

onMounted(() => {
  initializeValue()
    // if (props.selected) {
    //     inputValue.value = props.selected;
    //     filterText.value = props.selected;
    // }
});
const handleInputFocus = () => {
    openSelect.value = true;
    tempFilterText.value = filterText.value; // Store current filter text
    filterText.value = ''; // Clear filter text
};

const handleInputBlur = () => {
    openSelect.value = false;
    filterText.value = tempFilterText.value; // Restore filter text
};

// Update input value when an option is selected
const selectOption = (option) => {
    inputValue.value = option;
    filterText.value = option;
    openSelect.value = false;
    if (props.useLocalStorage) {
        saveToLocalStorage(option);
    }
        emit('update:modelValue', option); // Emit the updated value
};

// Watch for external changes to the selected prop
watch(() => props.selected, (newVal) => {
    inputValue.value = newVal; // Update the inputValue when selected prop changes
    filterText.value = newVal; // Update the filterText as well
});

</script>
<template>
    <div class="relative">
        <div class="flex">
            <label :class="disabled ? 'text-grey' : ''" class="text-xsmall pl-1 text-darkgrey dark:text-white font-bold mb-2">{{label}}</label>
            <div v-if="info !== ''" class="group relative flex gap-5">
              <NuxtIcon name="Info" class="text-xsmall pl-1 text-lightgrey dark:text-creme cursor-pointer relative" />
              <div class="bg-darkgrey dark:bg-white rounded-sm w-32 h-10 p-1 left-5 bottom-5 transition-al hidden group-hover:block absolute">
                <p class="text-white dark:text-black text-xsmall leading-4">{{ info }}</p>
              </div>
            </div>
        </div>
        <input :disabled="disabled" @focus="handleInputFocus" @blur="handleInputBlur" autocomplete="off" type="text" class="border disabled:cursor-not-allowed border-creme outline-none text-left rounded-md w-52 py-1 pl-5 dark:bg-lighterdark dark:text-white placeholder:text-lightgrey dark:placeholder:text-creme focus:outline-purple-dark cursor-pointer" :name="name" v-model="filterText" :placeholder="placeholder" />
        <Transition name="fade" appear>
        <div v-if="openSelect" class="traded-select w-52 h-[full] max-h-56 p-2 absolute z-10 bg-white dark:bg-lightdark dark:text-white dark:border-none shadow-md rounded-md border-creme border mt-1 overflow-y-scroll">
            <p v-if="!filteredOptions[0].url" v-for="option in filteredOptions" @click="selectOption(option)" class="py-2 px-1 rounded-md flex items-center gap-2 hover:bg-purple-dark/10 hover:text-purple-dark cursor-pointer"><NuxtIcon :class="tempFilterText === option ? 'text-purple-dark' : 'text-purple-dark/0'" name="Check"/>{{ option }}</p>
            <p v-else v-for="option, i in filteredOptions" @click="selectOption(option.name)" class="py-2 px-1 rounded-md flex items-center gap-2 hover:bg-purple-dark/10 hover:text-purple-dark cursor-pointer"><NuxtIcon :class="tempFilterText === option ? 'text-purple-dark' : 'text-purple-dark/0'" name="Check"/>{{ option.name }}</p>
        </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-appear-active {
  transition: opacity .2s, transform .4s;
  transform: translate(00px, -20px); /* Start from top-right */
  opacity: 0;
}
.fade-enter-to, .fade-a2pear-to {
  transform: translate(0, 0); /* End at element's original position */
  opacity: 1;
}
.fade-leave-active {
  transition: opacity .2s, transform .4s;
  transform: translate(0, 0); /* Start at element's original position */
  opacity: 1;
}
.fade-leave-to {
  transform: translate(00px, -20px); /* End at bottom-left */
  opacity: 0;
}


.traded-select {
    overflow-y: scroll;
    scrollbar-width: thin;  /* For Firefox */
    scrollbar-color: transparent transparent;  /* For Firefox, sets thumb and track color */
}

.traded-select::-webkit-scrollbar {
  width: 4px;  /* Width of the vertical scrollbar */
  height: 12px;  /* Height of the horizontal scrollbar */
}

.traded-select::-webkit-scrollbar-thumb {
  background-color: #7b61ff89;  /* Color of the scrollbar thumb */
  border-radius: 6px;  /* Roundness of the scrollbar thumb */
}

.traded-select::-webkit-scrollbar-track {
  background: transparent;  /* Hides the scrollbar track */
}
</style>