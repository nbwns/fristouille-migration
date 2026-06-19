<template>
	<article v-if="document && document.data" class="container space-y-8 lg:space-y-12 py-12 flex flex-col lg:flex-row gap-6">
		<main class="w-full" :class="hasCtas ? 'basis-full lg:basis-4/5' : 'basis-full'"
			:style="hasCtas ? 'max-width: 840px' : ''">
			<article-header :title="document.data.title" :introduction="document.data.introduction"
				:parentTitle="parent?.data ? $prismic.asText(parent.data.title) : ''" :parentUrl="parent ? parent.url : ''" />

			<div class="flex flex-col justify-center items-start gap-6 w-full">
				<div class="flex flex-col justify-center items-start gap-6 w-full" :class="{ 'xl:w-2/3': hasCtas }">
					<content-block v-for="block in contentBlocks" :key="block.id" :title="block.primary.content_title"
						:content="block.primary.content_body" :image="block.primary.content_image"
						:callout="block.primary.callout" />
				</div>
			</div>

			<featured-recipes v-for="(list, index) in horizontalLists" :key="`recipes-${index}`" :title="list.title"
				:items="list.recipes" :link="list.seeAllQuery" :hidden="!list.recipes || list.recipes.length === 0" />

			<related-pages :pages="relatedPages" />
		</main>

		<aside v-if="hasCtas" class="w-full basis-1/4">
			<call-to-action v-for="cta in ctas" :key="cta.id" :ctaUrl="cta.primary.cta_url" :ctaText="cta.primary.cta_text"
				:ctaHeader="cta.primary.cta_header" />
		</aside>
	</article>
</template>

<script setup>
import { computed } from 'vue'
import FeaturedRecipes from '~/components/FeaturedRecipes'
import ContentBlock from '~/components/ContentBlock'
import RelatedPages from '~/components/RelatedPages'
import CallToAction from '~/components/CallToAction'
import ArticleHeader from '~/components/ArticleHeader.vue'
import { useRuntimeConfig } from 'nuxt/app'

const route = useRoute()
const { $prismic } = useNuxtApp()
const config = useRuntimeConfig()

const { data: pageData } = await useAsyncData(
	`child-${route.params.section}-${route.params.uid}`,
	async () => {
		const client = $prismic.client
		let parent = null

		const doc = await client.getByUID('childpage', route.params.uid)
		const page = doc.data

		if (page?.parent_page?.id) {
			try {
				parent = await client.getByID(page.parent_page.id)
			} catch (e) {
				console.error('Error fetching parent page:', e)
			}
		}

		let horizontalLists = []
		let relatedPages = []

		if (page.body && page.body.length > 0) {
			try {
				const horizontalListsSlices = page.body.filter(s => s.slice_type === 'horizontal_list')

				horizontalLists = await Promise.all(
					horizontalListsSlices.map(async (hl) => {
						const featuredRecipes = await $fetch(config.searchFunction, {
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

				const relatedPagesSlices = page.body.filter(s => s.slice_type === 'related_pages')
				relatedPages = await Promise.all(
					relatedPagesSlices.map(async (slice) => {
						if (!slice.primary?.related_page?.id) return null
						try {
							return await client.getByID(slice.primary.related_page.id)
						} catch {
							return null
						}
					})
				)
				relatedPages = relatedPages.filter(Boolean)
			} catch (error) {
				console.error('Error in child page slices:', error)
			}
		}

		const contentBlocks = (page.body1 && page.body1.length > 0) ? page.body1 : []
		const ctas = (page.body2 && page.body2.length > 0) ? page.body2 : []

		return {
			document: doc,
			parent,
			horizontalLists,
			contentBlocks,
			relatedPages,
			ctas,
			hasCtas: ctas.length > 0
		}
	}
)

const document = computed(() => pageData.value?.document ?? null)
const parent = computed(() => pageData.value?.parent ?? null)
const horizontalLists = computed(() => pageData.value?.horizontalLists ?? [])
const contentBlocks = computed(() => pageData.value?.contentBlocks ?? [])
const relatedPages = computed(() => pageData.value?.relatedPages ?? [])
const ctas = computed(() => pageData.value?.ctas ?? [])
const hasCtas = computed(() => pageData.value?.hasCtas ?? false)

useHead(() => {
	const data = document.value?.data
	const metaTitle = data?.meta_title
	const metaDescription = data?.meta_description || ''
	const ogImage = data?.facebook_image?.url || ''
	const canonicalUrl = document.value?.url
		? `https://www.fristouille.org${document.value.url}/`
		: 'https://www.fristouille.org/'

	const title = metaTitle
		? `${metaTitle} - Fristouille, la cuisine durable en toute simplicité`
		: 'Fristouille, la cuisine durable en toute simplicité'

	const structuredData = {
		'@context': 'https://schema.org/',
		'@type': 'Article',
		headline: metaTitle || 'Fristouille',
		image: ogImage,
		author: [{
			'@type': 'Organization',
			name: 'Fristouille',
			url: 'https://www.fristouille.org/'
		}]
	}

	return {
		title,
		meta: [
			{ key: 'description', name: 'description', content: metaDescription },
			{ key: 'og:description', property: 'og:description', content: metaDescription },
			{ key: 'og:title', property: 'og:title', content: title },
			{ key: 'og:image', property: 'og:image', content: ogImage },
			{ key: 'author', name: 'author', content: 'Fristouille' },
			{ key: 'og:url', property: 'og:url', content: canonicalUrl }
		],
		link: [
			{ rel: 'canonical', href: canonicalUrl }
		],
		script: [
			{ type: 'application/ld+json', innerHTML: JSON.stringify(structuredData) }
		]
	}
})
</script>
