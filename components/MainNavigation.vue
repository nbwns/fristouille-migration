<template>
  <nav class="flex items-center justify-between flew-wrap px-1 py-3 md:p-4 bg-background ligatures-none">
    <div class="container w-full flex flex-row justify-between mx-auto items-center">
      <logo />
      <div class="hidden md:flex flex-grow md:w-auto pt-2 ">
        <div class="flex flex-grow space-x-5 justify-end items-center">
          <nuxt-link
            class="text-base font-medium font-sans tracking-normal text-alt lowercase hover:text-primary-foreground focus:text-foreground transition-colors duration-300"
            to="/" no-prefetch exact>Accueil</nuxt-link>
          <nuxt-link
            class="text-base font-medium font-sans tracking-normal text-alt lowercase hover:text-primary-foreground focus:text-foreground transition-colors duration-300"
            to="/recettes/" no-prefetch>Recettes</nuxt-link>
          <nuxt-link
            class="text-base font-medium font-sans tracking-normal text-alt lowercase hover:text-primary-foreground focus:text-foreground transition-colors duration-300"
            to="/astuces/" no-prefetch>Astuces</nuxt-link>
          <form class="flex items-center gap-5" action="/recettes/" @submit="checkRoute">
            <div class="relative w-full">
              <search-bar placeholder="rechercher des recettes"></search-bar>
            </div>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import Logo from '~/molecules/Logo.vue'
import SearchBar from '~/components/SearchBar.vue'
import { useSearchStore } from '~/store/search'
import { storeToRefs } from 'pinia'

const route = useRoute()
const searchStore = useSearchStore()
const { searchQuery } = storeToRefs(searchStore)

function checkRoute(e) {
  if (route.path.toLowerCase().startsWith('/recettes')) {
    e.preventDefault()
    searchStore.toggleSearchFromBar(`query:${searchQuery.value}`)
  }
}
</script>

<style scoped>
@reference "../assets/css/main.css";

.router-link-active {
  @apply text-primary-foreground;
}
</style>
