<template>
	<section v-if="document && document.data" class="container space-y-8 lg:space-y-12 py-12">
		<hero-article-section :title="document.data.title" :text="document.data.text" :children="children"
			:display-as-links="document.data.display_as_links" />

		<grid-of-cards-articles :articles="children" v-if="!document.data.display_as_links" />

		<recipe-categories v-if="recipeCategories" :content="recipeCategories.primary.content" :ingredients="ingredients" />
	</section>
</template>

<script setup>
import { computed } from 'vue'
import GridOfCardsArticles from '~/components/GridOfCardsArticles.vue'
import HeroArticleSection from '~/components/HeroArticleSection.vue'
import RecipeCategories from '~/components/RecipeCategories'
import { filter } from '@prismicio/client'

const route = useRoute()
const { $prismic } = useNuxtApp()

const { data: pageData } = await useAsyncData(
	`section-${route.params.section}`,
	async () => {
		const client = $prismic.client
		const page = await client.getByUID('simplepage', route.params.section)

		let children = []
		if (page?.id) {
			children = (await client.getAllByType('childpage', {
				filters: [filter.at('my.childpage.parent_page', page.id)]
			})).filter(c => c.data.show_in_grid === true)

			children.sort((a, b) => a.data.position - b.data.position)
		}

		let recipeCats = null
		let ingredients = []
		if (page?.data?.body && page.data.body.length > 0) {
			try {
				const recipeCatsSlices = page.data.body.filter(s => s.slice_type === 'recipecategories')
				if (recipeCatsSlices.length > 0) {
					recipeCats = recipeCatsSlices[0]
					ingredients = await $fetch('/api/ingredients')
				}
			} catch (error) {
				console.error('Error fetching recipe categories/ingredients:', error)
			}
		}

		return {
			document: page,
			children,
			recipeCategories: recipeCats,
			ingredients
		}
	}
)

const document = computed(() => pageData.value?.document ?? null)
const children = computed(() => pageData.value?.children ?? [])
const recipeCategories = computed(() => pageData.value?.recipeCategories ?? null)
const ingredients = computed(() => pageData.value?.ingredients ?? [])

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

	return {
		title,
		meta: [
			{ key: 'og:title', property: 'og:title', content: title },
			{ key: 'description', name: 'description', content: metaDescription },
			{ key: 'og:description', property: 'og:description', content: metaDescription },
			{ key: 'og:image', property: 'og:image', content: ogImage },
			{ key: 'og:url', property: 'og:url', content: canonicalUrl }
		],
		link: [
			{ rel: 'canonical', href: canonicalUrl }
		]
	}
})
</script>
