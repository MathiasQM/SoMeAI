<script setup>

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.checked);
};
</script>

<template>
    <div class="w-[full] flex gap-2">
      <input id="s1" type="checkbox" class="switch" :checked="modelValue" @change="updateValue">
    </div>
</template>

<style scoped>
@supports (-webkit-appearance: none) or (-moz-appearance: none) {
  input[type='checkbox'].switch {
    --active: #7B61FF;
    --active-inner: #fff;
    --focus: 2px #7b61ff55;
    --border: #BBC1E1;
    --border-hover: #7B61FF;
    --background: #fff;
    --disabled: #F6F8FF;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 38px;
    height: 21px;
    outline: none;
    display: flex;
    align-items: center;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border-radius: 11px;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background .3s, border-color .3s, box-shadow .2s;
  }

  input[type='checkbox'].switch:after {
    margin-left: 2px;
    content: '';
    display: block;
    left: 2px;
    top: 2px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background: var(--ab, var(--border));
    transform: translateX(var(--x, 0));
    transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
  }

  input[type='checkbox'].switch:checked {
    --ab: var(--active-inner);
    --x: 17px;
    --b: var(--active);
    --bc: var(--active);
    --d-o: .3s;
    --d-t: .6s;
    --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
  }

  input[type='checkbox'].switch:disabled {
    --b: var(--disabled);
    cursor: not-allowed;
    opacity: .9;
  }

  input[type='checkbox'].switch:disabled:not(:checked):after {
    opacity: .6;
  }

  input[type='checkbox'].switch:disabled:checked {
    --b: var(--disabled-inner);
    --bc: var(--border);
  }

  input[type='checkbox'].switch:disabled + label {
    cursor: not-allowed;
  }

  input[type='checkbox'].switch:hover:not(:checked):not(:disabled) {
    --bc: var(--border-hover);
  }

  input[type='checkbox'].switch:focus {
    box-shadow: 0 0 0 var(--focus);
  }

  input[type='checkbox'].switch + label {
    font-size: 14px;
    line-height: 21px;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 4px;
  }
}

</style>