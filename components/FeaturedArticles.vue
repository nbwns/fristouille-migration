<template>
  <section class="flex w-full items-center mx-auto justify-center py-10 ">
    <div class="w-full flex flex-col space-y-3">
      <!-- title row -->
      <div class="w-full flex flex-row justify-between items-end">
        <h2 class="font-sans font-medium text-xl lg:text-2xl text-primary-foreground lowercase">
          {{ title }}
        </h2>

        <hyper-link v-if="link" :path="link">Tout voir</hyper-link>
      </div>
      <!-- grid for cards 2-columns -->
      <div class="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        <div
          class="slide shrink-0 snap-start w-[85%] sm:w-[70%] md:w-[48%] lg:w-[38%]"
          v-for="c in items"
          :key="c.id"
        >
          <card-article
            image-size=""
            :path="c.url"
            :img="c.data.cover.url"
            :imgAlt="c.data.cover.alt"
            :title="$prismic.asText(c.data.title)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import HyperLink from '~/molecules/HyperLink.vue';
import CardArticle from './CardArticle.vue';


export default {
  props: ['title', 'items', 'link'],
  components: { HyperLink, CardArticle },
}
</script>

<style global>
@reference "../assets/css/main.css";
</style>
