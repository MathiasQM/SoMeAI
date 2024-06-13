<template>
    <div class="add-tag-container cursor-pointer">
      <input @click="expandInput" @blur="inputValue = ''" v-model="inputValue" @keyup.enter="submitTag" type="text" class="cursor-pointer tag-input relative bg-white border border-purple-dark outline-none text-purple-darksd px-2 py-1 rounded-md text-xsmall" placeholder="+" ref="tagInput">
    </div>
  </template>
  
  <script setup>
const emits = defineEmits(['addTag']);
const inputVisible = ref(false);
const inputValue = ref('');

const expandInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    tagInput.focus();
  });
};

const submitTag = () => {
  emits('addTag', inputValue.value);
  inputValue.value = '';
  inputVisible.value = false;
};

const tagInput = ref(null);
  </script>
  
  <style scoped>
  .add-tag-container {
    align-items: center;
    justify-content: center;
    width: 26px; /* initial width */
    border-radius: 5px;
    cursor: pointer;
    transition: width 0.3s ease;
  }
  
  .add-icon {
    font-size: 10px;
    color: #888;
  }
  
  .tag-input {
    width: 100%;
  }
  
  .add-tag-container:hover {
    border-color: #888;
  }
  
  .add-tag-container:focus-within {
    width: 150px; /* expanded width */
  }
  </style>
  