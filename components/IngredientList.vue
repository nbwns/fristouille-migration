<template>
  <div class="py-12">
    <div v-for="c in ingredients" :key="c.name" class="py-0.5">
      <div v-if="c.ingredient[0]" class="font-mono text-base leading-tight text-foreground font-light flex flex-wrap space-x-1">
        <span class="font-bold flex space-x-1" v-if="c.quantity > 0">
          <span>{{ computedQuantity(c.quantity) }}&nbsp;</span>
          <span v-if="c.units != 'pièce'">{{ c.units }} <span class="font-light">de </span></span>
        </span>
        <span>
          <span>{{ c.ingredient }}</span>
          <i v-if="c.remark">{{ ` ${c.remark}` }}</i>
          <span v-if="c.quantity == 0"> selon votre goût</span>
          <span v-if="c.optional"> (facultatif)</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  ingredients: {
    type: Array,
    required: true
  },
  servingsRatio: {
    type: Number,
    required: true
  }
});

const computedQuantity = (qty) => Math.round((qty * props.servingsRatio) * 2) / 2;
</script>