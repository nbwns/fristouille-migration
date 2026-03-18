<template>
  <div class="flex flex-col items-center gap-3">
    <nuxt-link class="navmobile flex flex-col items-center" :to="to" no-prefetch :exact="exact" :class="{ 'router-link-active': isActive }">
      <component :is="iconComponent" class="h-8 mx-auto" />
      <span class="text-sm font-medium font-anonymous lowercase">
        {{ label }}
      </span>
    </nuxt-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import HomeIcon from './icons/HomeIcon.vue'
import RecipeIcon from './icons/RecipeIcon.vue'
import TipsIcon from './icons/TipsIcon.vue'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true },
  label: { type: String, required: true },
  exact: { type: Boolean, default: false }
})

const route = useRoute()

const iconComponent = computed(() => {
  switch (props.icon) {
    case 'home': return HomeIcon
    case 'recipe': return RecipeIcon
    case 'tips': return TipsIcon
    default: return null
  }
})

const isActive = computed(() => {
  const currentPath = route.path
  const to = typeof props.to === 'string' ? props.to : props.to.path

  if (to.toLowerCase() === '/recettes/' && currentPath.toLowerCase().startsWith('/recette/')) {
    return true
  }

  if (props.exact) {
    return currentPath === to
  }
  return currentPath.startsWith(to) && to !== '/'
})
</script>

<style scoped>
@reference "../assets/css/main.css";

.navmobile {
  @apply text-white-100 dark:text-black-100 hover:text-white-300 dark:hover:text-black-300 transition-colors duration-200;
}

.navmobile.router-link-active {
  @apply text-orange-300 dark:text-purple-300;
}

.navmobile.router-link-active :deep(svg) {
  @apply !fill-orange-300 dark:!fill-purple-300;
}
</style>
