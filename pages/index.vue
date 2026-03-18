<template>
	<div v-if="document && document.data" class="container">
		<hero-section :hero-title="document.data.hero_title" :hero-title-emphasis="document.data.hero_title_emphasis" />

		<home-search :quick-search-tags="quickSearchTags" />

		<featured-recipes v-for="(list, index) in horizontalLists" :key="'r' + index" :title="list.title"
			:items="list.recipes" :link="list.seeAllQuery" />

		<featured-articles v-for="(list, index) in articlesLists" :key="'a' + index" :title="list.title" :items="list.items"
			:link="list.seeAllLink" />

		<spacer size="md"></spacer>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import HeroSection from '~/components/HeroSection.vue'
import FeaturedRecipes from '~/components/FeaturedRecipes'
import FeaturedArticles from '~/components/FeaturedArticles'
import HomeSearch from '~/components/HomeSearch.vue'
import Spacer from '~/molecules/Spacer.vue'
import { filter } from '@prismicio/client'

const { $prismic } = useNuxtApp()

const seasonsAndMonths = {
	winter: { 11: 'Décembre', 0: 'Janvier', 1: 'Février', 2: 'Mars' },
	spring: { 2: 'Mars', 3: 'Avril', 4: 'Mai', 5: 'Juin' },
	summer: { 5: 'Juin', 6: 'Juillet', 7: 'Août', 8: 'Septembre' },
	autumn: { 8: 'Septembre', 9: 'Octobre', 10: 'Novembre', 11: 'Décembre' }
}

const { data: pageData } = await useAsyncData('homepage', async () => {
	const client = $prismic.client
	const doc = await client.getSingle('homepage')
	const page = doc?.data || {}

	const bodySlices = Array.isArray(page.body) ? page.body : []
	const horizontalListsSlices = bodySlices.filter(s => s.slice_type === 'horizontal_list')
	const featuredContentsSlices = bodySlices.filter(s => s.slice_type === 'featured_content')
	const quickSearchTagsSlices = bodySlices.filter(s => s.slice_type === 'quick_search_tags')

	const horizontalLists = await Promise.all(
		horizontalListsSlices.map(async (hl) => {
			const featuredRecipes = await $fetch('/api/search', {
				query: {
					query: hl.primary.query_term,
					filters: hl.primary.query_filters
				}
			})
			return {
				title: hl.primary.list_title,
				seeAllQuery: hl.primary.see_all_querystring,
				recipes: featuredRecipes
			}
		})
	)

	const articlesLists = await Promise.all(
		featuredContentsSlices.map(async (fc) => {
			const featuredIds = (fc.items || [])
				.map(i => i?.featured_page?.id)
				.filter(Boolean)
			const featuredResult = featuredIds.length
				? await client.get({ filters: [filter.in('document.id', featuredIds)] })
				: { results: [] }
			return {
				title: fc.primary.featured_title,
				seeAllLink: fc.primary?.see_all_link?.url || '',
				items: featuredResult.results || []
			}
		})
	)

	return {
		document: doc,
		horizontalLists,
		articlesLists,
		quickSearchTags: quickSearchTagsSlices[0]?.items || []
	}
})

const document = computed(() => pageData.value?.document ?? null)
const horizontalLists = computed(() => pageData.value?.horizontalLists ?? [])
const articlesLists = computed(() => pageData.value?.articlesLists ?? [])
const quickSearchTags = computed(() => pageData.value?.quickSearchTags ?? [])

useHead(() => {
	const data = document.value?.data
	const metaTitle = data?.meta_title || 'Fristouille'
	const metaDescription = data?.meta_description || ''
	const ogImage = data?.facebook_image?.url || ''
	const canonicalUrl = document.value?.url
		? `https://www.fristouille.org${document.value.url}/`
		: 'https://www.fristouille.org/'

	return {
		title: metaTitle,
		meta: [
			{ key: 'og:title', property: 'og:title', content: metaTitle },
			{ key: 'description', name: 'description', content: metaDescription },
			{ key: 'og:description', property: 'og:description', content: metaDescription },
			{ key: 'og:image', property: 'og:image', content: ogImage },
			{ key: 'og:url', property: 'og:url', content: canonicalUrl }
		]
	}
})
</script>
