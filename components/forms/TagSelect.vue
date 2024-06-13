<template>
    <div class="custom-select">
      <!-- Simulated input field with tags -->
      <div 
        class="tags-input" 
        @click="focusInput"
      >
        <span @click.stop="removeTag(index)" class="tag" v-for="(tag, index) in selectedTags" :key="`tag-${index}`">
          {{ tag }}
          <button>x</button>
        </span>
        <!-- Invisible input for typing and capturing events -->
        <input
          type="text"
          v-model="inputValue"
          @input="updateFilteredOptions"
          @keydown.enter.prevent="addCustomTag"
          @keydown.backspace="handleBackspace"
          ref="input"
          class="tag-input"
          :style="{ width: inputWidth + 'px' }"
        />
      </div>
      <!-- Options dropdown -->
      <ul v-if="filteredOptions.length" class="dropdown">
        <li
          v-for="(option, index) in filteredOptions"
          :key="`option-${index}`"
          @click="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  
  const allOptions = ref([
  "Increase brand awareness",
  "Drive website traffic",
  "Generate leads",
  "Boost sales",
  "Customer engagement",
  "Build a community",
  "Promote a new product",
  "Promote a new service",
  "Increase market share",
  "Customer loyalty and retention",
  "Educate audience about a product",
  "Educate audience about a service",
  "Support a cause or initiative",
  "Improve search engine rankings",
  "Expand into new markets",
  "Increase social media followers",
  "Increase social media engagement"
]);
  const selectedTags = ref([]);
  const inputValue = ref('');
  const inputWidth = ref(1);
  const inputRef = ref(null);
  
  // Filter options based on input value and exclude selected tags
  const filteredOptions = computed(() => {
    return allOptions.value.filter(option =>
      option.toLowerCase().includes(inputValue.value.toLowerCase()) &&
      !selectedTags.value.includes(option)
    );
  });
  
  // Add tag either by selection or by typing and pressing Enter
  function selectOption(option) {
    selectedTags.value.push(option);
    resetInput();
  }
  
  function addCustomTag() {
    if (inputValue.value && !selectedTags.value.includes(inputValue.value.trim())) {
      selectedTags.value.push(inputValue.value.trim());
      resetInput();
    }
  }
  
  // Remove tag, either by clicking 'x' or by pressing backspace when input is empty
  function removeTag(index) {
    selectedTags.value.splice(index, 1);
  }
  
  function handleBackspace(event) {
    if (!inputValue.value && selectedTags.value.length && event.key === 'Backspace') {
      removeTag(selectedTags.value.length - 1);
    }
  }
  
  function resetInput() {
    inputValue.value = '';
    inputWidth.value = 1;
    focusInput();
  }
  
  function focusInput() {
    nextTick(() => {
      inputRef.value.focus();
    });
  }
  
  function updateFilteredOptions() {
    inputWidth.value = inputValue.value.length || 1;
  }
  
  // Watch input value to adjust width dynamically
  watch(inputValue, () => {
    inputWidth.value = Math.max(inputValue.value.length, 1);
  });
  
  </script>
  
  <style scoped>
.custom-select {
  display: inline-block; /* Or 'block' depending on layout needs */
  position: relative; /* For dropdown positioning */
  width: 100%; /* Or specify a fixed width */
  max-width: 500px; /* Adjust based on your design */
  border: 1px solid #E7E7E7; /* Subtle border */
  border-radius: 4px; /* Rounded corners for modern look */
  padding: 5px; /* Spacing inside the component */
  background-color: #fff; /* Background color */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Optional: adds depth */
}

.selected-tags .tag {
  display: inline-block;
  color: #ffffff; /* Text color */
  padding: 5px 10px;
  border-radius: 20px; /* Rounded edges for tags */
  margin: 2px 5px 2px 0; /* Space between tags */
  font-size: 14px; /* Text size */
}

.selected-tags .tag button {
  background-color: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  margin-left: 5px;
}

input[type="text"] {
  border: none; /* Hide the input border */
  outline: none; /* Disable focus outline */
  font-size: 16px; /* Match font-size with the rest of the component */
  width: 100%; /* Full width */
}

  .tags-input {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    cursor: text;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    background-color: #7B61FF;
    color: #fff;
    padding: 2px 5px;
    border-radius: 5px;
    cursor: pointer;
  }
  .tag button {
    margin-left: 5px;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
  .tag-input {
    border: none;
    outline: none;
    flex-grow: 1;
    min-width: 20px;
    background: none;
  }
  .dropdown {
  position: absolute; /* Position it relative to the .custom-select */
  top: 100%; /* Align it right below the input field */
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it's above other content */
  background-color: #fff; /* Match the component background */
  border: 1px solid #E7E7E7; /* Subtle border like the component */
  border-radius: 4px; /* Rounded corners */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* Optional: adds depth and separation */
  max-height: 200px; /* Limit the height and make it scrollable */
  overflow-y: auto; /* Enable scrolling */
  padding: 10px 0; /* Padding inside the dropdown */
}

.dropdown li {
  padding: 8px 20px;
  cursor: pointer; /* Indicates an item is clickable */
  list-style-type: none; /* Remove bullet points */
}

.dropdown li:hover {
  background-color: #f8f9fa; /* Highlight on hover */
}

  </style>
  