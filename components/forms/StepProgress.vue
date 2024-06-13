<template>
  <div class="root">
    <div class="container">
      <ul class="progressbar">
        <!-- Use the `active` class conditionally based on the currentStep -->
        <li :class="{'active': i <= currentStep}" v-for="i in length" :key="i"></li>
      </ul>
    </div>
  </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    length: Number,
    currentStep: Number
  })
  </script>
  
  <style scoped>
  .root {
  position: relative;
  width: 100%; /* Ensure this fills the desired area, or set to specific dimensions */
  height: 100%; /* Ensure this fills the desired area, or set to specific dimensions */
}
  .container {
    position: relative;
    z-index: 1;
    padding: 0px 100px;
  }
  .progressbar {
    counter-reset: step;
  }
  .progressbar li {
    float: left;
    width: 30%;
    position: relative;
    text-align: center;
  }
  .progressbar li:before {
    content: counter(step);
    counter-increment: step;
    width: 30px;
    height: 30px;
    border: 2px solid #bebebe;
    display: block;
    margin: 0 auto 10px auto;
    border-radius: 50%;
    line-height: 27px;
    background: white;
    color: #bebebe;
    text-align: center;
    font-weight: bold;
  }
  .progressbar li:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    background: #979797;
    top: 15px;
    left: -50%;
    z-index: -1;
  }
  .progressbar li.active:before {
    border-color: #7B61FF;
    background: #7B61FF;
    color: white;
  }
  .progressbar li.active:after {
    background: #7B61FF;
  }
  /* The following selectors might not work as expected due to incorrect syntax. */
  /* .progressbar li.active - li:after{
    background: #3aac5d;
  }
  .progressbar li.active - li:before{
    border-color: #3aac5d;
    background: #3aac5d;
    color: white;
  } */
  .progressbar li:first-child:after {
    content: none;
  }
  </style>
  