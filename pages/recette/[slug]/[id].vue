<template>
	<section class="flex flex-col container w-full">
		<div class="flex flex-col space-y-8 lg:space-y-12 pb-10 lg:pb-0">
			<RecipeHeader v-if="recipe" :name="recipe.name" :authorName="recipe.authorName" :authorWeb="recipe.authorWeb"
				:description="recipe.description" :picture="recipe.picture" />

			<div class="flex flex-col space-y-8 lg:space-y-12 w-full">
				<RecipeInfoSection class="print:hidden" v-if="recipe" :preparationTime="recipe.preparationTime / 60" :cookTime="recipe.cookTime / 60"
					:difficulty="recipe.difficulty" :price="recipe.price" :months="recipe.months"
					:allYearLongLabel="label('allYearLong')" />

				<client-only>
					<recipe-share class="print:hidden" :name="recipeName"></recipe-share>
				</client-only>

					<RecipeIngredients
						v-if="compositions && compositions.length"
						:ingredients="compositions"
						:initialServings="servings"
						:recipeYield="recipeYield"
						@update:servings="updateServings" />

				<RecipePreparation v-if="recipe" :procedure="procedure" :source="recipe.source" />
			</div>

			<card-tip v-if="article" :article="article" class="print:hidden"/>

			<RecipeTags v-if="recipe" :tagsList="recipe.tagsList" :baseRecipe="recipe.baseRecipe" :category="recipe.category"
				:cuisine="recipe.cuisine" :freeFrom="recipe.free" class="print:hidden" />
		</div>
	</section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import labels from '~/utils/labels'
import Tag from '~/molecules/ButtonTag.vue'
import CardTip from '~/components/CardTip.vue'
import Spacer from '~/molecules/Spacer.vue'
import IngredientList from '~/components/IngredientList.vue'
import ServingsAdjuster from '~/components/ServingsAdjuster.vue'
import RecipeInfoSection from '~/components/RecipeInfoSection.vue'
import RecipeHeader from '~/components/RecipeHeader.vue'
import RecipePreparation from '~/components/RecipePreparation.vue'
import RecipeTags from '~/components/RecipeTags.vue'
import RecipeIngredients from '~/components/RecipeIngredients.vue'
import RecipeShare from '~/components/RecipeShare.vue'

const route = useRoute()
const config = useRuntimeConfig()
const { $prismic } = useNuxtApp()

function label(key) {
	return labels[key]
}

function toDuration(totalSeconds) {
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	return `PT${hours}H${minutes}M`
}

function parseCompositions(json) {
	try {
		const parsed = JSON.parse(json || '[]')
		parsed.sort((a, b) => b.quantity - a.quantity)
		return parsed
	} catch {
		return []
	}
}

const { data: recipeData } = await useAsyncData(
	`recipe-${route.params.id}`,
	async () => {
		const id = route.params.id
		if (!id) {
			throw createError({ statusCode: 404, statusMessage: 'Recette non trouvée' })
		}

		const res = await $fetch(config.public.recipeFunction, {
			query: { filter: id }
		})

		if (!res || res.length === 0) {
			throw createError({ statusCode: 404, statusMessage: 'Recette non trouvée' })
		}

		const recipe = res[0]
		const compositions = parseCompositions(recipe.compositionsJson)

		let article = null
		if (recipe.prismicPageId) {
			try {
				article = await $prismic.client.getByID(recipe.prismicPageId)
			} catch (e) {
				console.error('Error fetching Prismic article:', e)
			}
		}

		return {
			recipe,
			compositions,
			servings: recipe.yield || 2,
			recipeYield: recipe.yield || 2,
			article,
			recipeId: recipe.recipeId || id,
			recipeName: recipe.name
		}
	}
)

const recipe = computed(() => recipeData.value?.recipe ?? null)
const article = computed(() => recipeData.value?.article ?? null)
const recipeId = computed(() => recipeData.value?.recipeId ?? null)
const recipeName = computed(() => recipeData.value?.recipeName ?? null)
const recipeYield = computed(() => recipeData.value?.recipeYield ?? 2)

const servings = ref(recipeData.value?.servings ?? 2)
const compositions = ref(recipeData.value?.compositions ?? [])

const procedure = computed(() => {
	return recipe.value?.procedure ? marked(recipe.value.procedure) : ''
})

function updateServings(newServings) {
	servings.value = newServings
}

async function fetchRecipeData() {
	const id = recipeId.value || route.params.id
	if (!id) return

	try {
		const res = await $fetch(config.public.recipeFunction, {
			query: { filter: id, compositions: 'true' }
		})

		if (res && res.length > 0) {
			const data = res[0]
			compositions.value = parseCompositions(data.compositionsJson)
			servings.value = data.yield || 2
		}
	} catch (e) {
		console.error('Error fetching recipe data on client:', e)
	}
}

onMounted(() => {
	if (!compositions.value || !compositions.value.length) {
		// fetchRecipeData()
	}
})

const noPictureUrl = config.public.noPictureUrl || ''

useHead(() => {
	if (!recipe.value) {
		return { title: '' }
	}

	const r = recipe.value
	let ogPictureHttp = r.pictureMedium || noPictureUrl

	let keywords = r.free ? r.free.map((x) => `sans ${x}`) : []
	if (r.tagsList) {
		keywords = r.tagsList.concat(keywords)
	}

	const structuredData = {
		'@context': 'https://schema.org/',
		'@type': 'Recipe',
		name: r.name,
		image: ogPictureHttp,
		author: { '@type': 'Person', name: r.authorName },
		cookTime: toDuration(r.cookTime),
		prepTime: toDuration(r.preparationTime),
		recipeCategory: r.category ? r.category.join(', ') : '',
		recipeInstructions: r.procedure,
		recipeYield: r.yield,
		recipeIngredient: r.compositionsStructuredData,
		keywords,
		...(r.cuisine ? { recipeCuisine: r.cuisine } : {}),
		...(r.description ? { description: r.description } : {})
	}

	const pageTitle = `${r.name} - Fristouille, la cuisine durable en toute simplicité`
	const canonicalUrl = `https://www.fristouille.org/recette/${r.slug}/${r.recipeId}/`

	return {
		title: pageTitle,
		meta: [
			{ key: 'description', name: 'description', content: r.description || '' },
			{ key: 'og:title', property: 'og:title', content: pageTitle },
			{ key: 'og:description', property: 'og:description', content: r.description || '' },
			{ key: 'og:image', property: 'og:image', content: ogPictureHttp },
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

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type=number] {
	-moz-appearance: textfield;
}
</style>
