<template>
  <div class="flex flex-col min-h-screen bg-background text-foreground">
    <MainNavigation />
    <main class="flex-grow">
      <slot />
    </main>
    <FooterLinks />
    <MobileNavigation />
  </div>
</template>

<script setup>
import MainNavigation from '~/components/MainNavigation.vue'
import FooterLinks from '~/components/FooterLinks.vue'
import MobileNavigation from '~/components/MobileNavigation.vue'
</script>
