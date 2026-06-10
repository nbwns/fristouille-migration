<template>
  <div class="flex flex-col">
    <h3 class="text-primary-foreground text-lg lg:text-xl lowercase">Ingrédients</h3>
    <ServingsAdjuster v-model="localServings" />
    <IngredientList :ingredients="ingredients" :servingsRatio="servingsRatio" />
  </div>
</template>

<script setup>
const props = defineProps({
  ingredients: {
    type: Array,
    default: () => []
  },
  initialServings: {
    type: Number,
    default: 2
  },
  recipeYield: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits(['update:servings']);

const localServings = ref(props.initialServings);

const servingsRatio = computed(() => localServings.value / props.recipeYield);

watch(localServings, (newValue) => {
  emit('update:servings', newValue);
});

onMounted(() => {
  console.log("recipeingredients", props.ingredients);
});
</script>