<template>
  <div class="flex flex-col gap-4 pt-4">
    <div
      class="flex flex-row items-center gap-2 bg-secondary w-fit border border-primary-foreground/10 hover:border-primary-foreground/20 rounded-[8px]">
      <button class="font-sans font-medium text-xl lg:text-2xl text-label text-center px-2 noprint"
        @click="decreaseServings" :disabled="servings === 1">
        -
      </button>
      <input
        class="max-w-fit w-20 font-sans font-medium text-xl lg:text-2xl bg-secondary rounded focus:outline-none focus:ring focus:ring-foreground block p-2.5 placeholder:text-foreground text-foreground text-center"
        type="number" v-model.number="servings" step="1" min="1" max="30" @input="updateServings" />
      <button class="font-sans font-medium text-xl lg:text-2xl text-label text-center px-2 noprint"
        @click="increaseServings">
        +
      </button>
    </div>
    <div class="flex gap-2">
      <p class="text-foreground/40 font-sans font-normal text-sm lg:text-base text-balance max-w-[140px]">nombre de
        personnes</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const servings = ref(props.modelValue);

const decreaseServings = () => {
  console.log("decrease", servings.value);
  if (servings.value > 1) {
    servings.value--;
    emit('update:modelValue', servings.value);
  }
};

const increaseServings = () => {
  if (servings.value < 30) {
    servings.value++;
    emit('update:modelValue', servings.value);
  }
};

const updateServings = () => {
  emit('update:modelValue', servings.value);
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>