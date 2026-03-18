<template>
  <!-- section cards 4 columns -->
  <section :class="{ 'hidden': hidden }" class="flex w-full items-center mx-auto justify-center py-10">
    <div class="w-full flex flex-col space-y-3 ">
      <!-- title row -->
      <div class="flex flex-row justify-between items-end">
        <h2 class="text-lg lg:text-xl py-4 text-primary-foreground lowercase leading-none">{{ title }}</h2>
        <hyper-link v-if="link" :path="`/recettes/${link}`">Tout voir</hyper-link>
      </div>

      <div class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
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
      </div>

    </div>
  </section>
</template>

<script>
import CardRecipe from './CardRecipe.vue';
import TitleParagraph from '~/molecules/TitleParagraph.vue';
import HyperLink from '~/molecules/HyperLink.vue';
import Spacer from '~/molecules/Spacer.vue';


export default {
  props: {
    title: String,
    items: Array,
    link: String,
    hidden: {
      type: Boolean,
      default: false
    }
  },
  components: { CardRecipe, TitleParagraph, HyperLink, Spacer },
  methods: {

  }
}
</script>

<style global>
@reference "../assets/css/main.css";
</style>