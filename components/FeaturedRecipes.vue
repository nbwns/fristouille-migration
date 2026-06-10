<template>
  <!-- section cards 4 columns -->
  <section :class="{ 'hidden': hidden }" class="flex w-full items-center mx-auto justify-center py-10">
    <div class="w-full flex flex-col space-y-3 ">
      <!-- title row -->
      <div class="flex flex-row justify-between items-end">
        <h2 class="text-lg lg:text-xl py-4 text-primary-foreground lowercase leading-none">{{ title }}</h2>
        <hyper-link v-if="link" :path="`/recettes/${link}`">Tout voir</hyper-link>
      </div>

      <Carousel 
        :gap="20"
        snap-align="center"
        wrapAround="true"
        :itemsToShow="1"
        breakpoint-mode="viewport"
        :breakpoints="{
            640: {
              itemsToShow: 2.5,
              snapAlign: 'start',
            }
          }">
        <Slide class="slide" v-for="item in items" :key="item.objectID">
          <card-recipe :diet="item.diet" :img="item.pictureMedium" :recipeID="item.objectID" :slug="item.slug"
            :totalTime="item.totalTime" :author="item.authorName" :title="item.name" />
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>

      <!-- <div class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        <div
          class="slide shrink-0 snap-start w-[85%] sm:w-[70%] md:w-[48%] lg:w-[38%]"
          v-for="item in items"
          :key="item.objectID"
        >
          <card-recipe
            :diet="item.diet"
            :img="item.pictureMedium"
            :recipeID="item.objectID"
            :slug="item.slug"
            :totalTime="item.totalTime"
            :author="item.authorName"
            :title="item.name"
          />
        </div>
      </div> -->

    </div>
  </section>
</template>

<script setup>
import CardRecipe from './CardRecipe.vue';
import TitleParagraph from '~/molecules/TitleParagraph.vue';
import HyperLink from '~/molecules/HyperLink.vue';
import Spacer from '~/molecules/Spacer.vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const props = defineProps({
  title: {
    type: String
  },
  items: {
    type: Array,
    default: () => []
  },
  link: {
    type: String
  },
  hidden: {
    type: Boolean,
    default: false
  }
});
</script>

<style global>
@reference "../assets/css/main.css";

.carousel__next,
.carousel__prev {
  @apply !bg-label;
  @apply opacity-100;
  @apply -right-6 hidden sm:block;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: black;
}

.carousel__next:hover,
.carousel__prev:hover {
  color: #e5e5e5;
}

.carousel__next--disabled,
.carousel__prev--disabled {
  opacity: 0.3;
}
</style>