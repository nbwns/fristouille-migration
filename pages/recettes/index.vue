<template>
	<section class="flex flex-col w-full h-full container justify-start items-start mx-auto">
		<div class="flex md:hidden w-full py-4 space-x-6">
			<search-bar placeholder="Rechercher des recettes" @enter="updateQuery()"></search-bar>

			<div class="flex min-w-[1/5] group">
				<span
					class="md:hidden font-mono text-sm text-primary-foreground group-hover:text-accent transition-colors duration-300 cursor-pointer"
					@click="toggleFilters()">
					filtres
					<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
						class="lucide lucide-list-plus text-primary-foreground group-hover:text-accent transition-colors duration-300">
						<path d="M11 12H3" />
						<path d="M16 6H3" />
						<path d="M16 18H3" />
						<path d="M18 9v6" />
						<path d="M21 12h-6" />
					</svg>
				</span>
			</div>
		</div>

		<div class="flex flex-col md:flex-col-reverse gap-4 w-full">
			<advanced-search @filtersChanged="updateQuery" :showDrawer="mobileAdvancedSearch"
				@closeDrawer="mobileAdvancedSearch = false" />
		</div>

		<div v-if="showNoSearchParametersWarning" class="w-full flex flex-row justify-start items-center gap-10">
			<draw-radish class="max-w-[90px] py-8" />
			<div
				class="basis-4/6 text-balance text-primary-foreground font-normal font-sans text-lg leading-tight ligatures-none">
				oups, tu dois indiquer au minimum un terme de recherche
				ou un filtre
				avancé</div>
		</div>

		<ais-instant-search v-if="searchClient" :index-name="indexName" :search-client="searchClient"
			:search-function="search" class="w-full">
			<ais-configure :hits-per-page.camel="12" :distinct="true" :filters="filterQuery" :query="query"
				:optional-words.camel="query" :page="page" />

			<ais-state-results>
				<template v-slot="{ status }">
					<p v-show="status === 'stalled'">
						Loading search results
					</p>
				</template>
			</ais-state-results>

			<div v-if="searchPerformed" class="pt-10">
				<ais-hits>
					<template v-slot="{ items }">
						<template v-if="items.length > 0">
							<h1 class="font-sans font-medium text-xl lg:text-2xl text-primary-foreground lowercase" v-if="query">
								Résultats pour '{{ query }}'
							</h1>
							<h1 class="font-sans font-medium text-xl lg:text-2xl text-primary-foreground lowercase" v-else>
								Découvre nos recettes
							</h1>
							<h2 class="sr-only">Liste des recettes qui correspondent à ta recherche</h2>
							<ais-pagination>
								<template v-slot="{ nbHits }">
									<div class="hidden md:flex text-sm text-primary-foreground font-light font-mono pt-4 pb-2">
										{{ nbHits }} recettes
									</div>
								</template>
							</ais-pagination>
							<grid-of-cards-recipes :recipes="items" />
						</template>
						<div v-else>
							<div class="w-full flex flex-row justify-start items-center gap-10">
								<draw-radish class="max-w-[90px] py-8" />
								<div
									class="basis-4/6 text-balance text-primary-foreground font-normal font-sans text-lg leading-tight ligatures-none">
									ouille, il n'y a pas de résultats pour cette recherche</div>
								</div>
							</div>
					</template>
				</ais-hits>
			</div>
			<div class="w-full h-96 flex items-center justify-center " v-else-if="showDefaultMessage">
				<div
					class=" font-sans font-bold p-14 text-alt text-xl lg:text-2xl text-center ligatures-none leading-none bg-secondary rounded-lg shadow-lg  container">
					pas d'idées ?
					<br /> essaie une recherche ou un filtre
					<br />
					<br />
					<div class="flex flex-row gap-2 justify-center items-center">
						<div
							class="inline-flex justify-center items-center h-8 px-4 font-mono font-medium text-base w-fit border border-primary-foreground/10 hover:border-primary-foreground/60 rounded whitespace-nowrap ring-offset-primary-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
							<nuxt-link to="/recettes/?q=rapide">
								rapide
							</nuxt-link>
						</div>
						<div
							class="inline-flex justify-center items-center h-8 px-4 font-mono font-medium text-base w-fit border border-primary-foreground/10 hover:border-primary-foreground/60 rounded whitespace-nowrap ring-offset-primary-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
							<nuxt-link to="/recettes/?diet=Végétarien">
								végétarien
							</nuxt-link>
						</div>
					</div>
				</div>
			</div>

			<div v-if="searchPerformed">
				<ais-pagination @page-change="pageChange">
					<template v-slot="{
						currentRefinement,
						pages,
						isFirstPage,
						isLastPage,
						refine,
						createURL,
						nbHits
					}">
						<div class="w-full py-10" v-show="nbHits > 0">
							<ul class="pagination">
								<li v-if="!isFirstPage">
									<a :href="createURL(currentRefinement - 1)" @click.prevent="refine(currentRefinement - 1)">
										<span class="sr-only">Précédent</span>
										<svg class="w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M14 7L9 12L14 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
												stroke-linejoin="round" />
										</svg>
									</a>
								</li>
								<li v-for="p in pages" :key="p">
									<a :href="createURL(p)" :class="[p === currentRefinement ? 'text-pink-200' : '']"
										@click.prevent="refine(p)">
										{{ p + 1 }}
									</a>
								</li>
								<li v-if="!isLastPage">
									<a :href="createURL(currentRefinement + 1)" @click.prevent="refine(currentRefinement + 1)">
										<span class="sr-only">Next</span>
										<svg class="w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M10 7L15 12L10 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
												stroke-linejoin="round" />
										</svg>
									</a>
								</li>
							</ul>
						</div>
					</template>
				</ais-pagination>
			</div>
		</ais-instant-search>
	</section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { AisInstantSearch, AisHits, AisPagination, AisConfigure, AisStateResults } from 'vue-instantsearch/vue3/es'
import CardRecipe from '~/components/CardRecipe.vue'
import AdvancedSearch from '~/components/AdvancedSearch.vue'
import GridOfCardsRecipes from '~/components/GridOfCardsRecipes.vue'
import SearchBar from '~/components/SearchBar.vue'
import DrawRadish from '~/molecules/DrawRadish.vue'
import { useSearchStore } from '~/store/search'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const { $prismic } = useNuxtApp()

const searchStore = useSearchStore()
const { searchFilters, searchQuery, launchSearchFromBar } = storeToRefs(searchStore)
const algoliaClient = useAlgoliaRef() //access to algoliasearch instance

const indexName = 'Recipes'
const query = ref('')
const searchClient = ref(null)
const filterQuery = ref('')
const page = ref(0)
const mobileAdvancedSearch = ref(false)
const searchPerformed = ref(false)
const showNoSearchParametersWarning = ref(false)
const showDefaultMessage = ref(true)

const { data: prismicDoc } = await useAsyncData('recettes-page', async () => {
	try {
		return await $prismic.client.getSingle('recipes')
	} catch (e) {
		console.error('Error fetching recettes page:', e)
		return null
	}
})

const hasActiveFilters = computed(() => {
	return Object.values(searchFilters.value).some(f => f.length > 0)
})

function toggleFilters() {
	mobileAdvancedSearch.value = !mobileAdvancedSearch.value
}

function buildFilterQuery(filters) {
	let fq = ''
	for (const cat in filters) {
		if (filters[cat].length > 0) {
			if (fq !== '') fq += ' AND '
			const catFilters = filters[cat].map(v => `${cat}:'${v}'`)
			fq += `(${catFilters.join(' OR ')})`
		}
	}
	return fq
}

function setFilterQuery() {
	filterQuery.value = buildFilterQuery(searchFilters.value)
}

function search(helper) {
	setFilterQuery()
	if (helper.state.query || (!helper.state.query && filterQuery.value !== '')) {
		helper.search()
		searchPerformed.value = true
		router.push({
			path: route.path,
			query: {
				q: helper.state.query,
				diet: searchFilters.value.diet,
				category: searchFilters.value.category,
				cuisine: searchFilters.value.cuisine,
				free: searchFilters.value.free,
				months: searchFilters.value.months,
				baseRecipe: searchFilters.value.baseRecipe,
				authorName: searchFilters.value.authorName,
				page: helper.state.page
			}
		})
	} else {
		searchPerformed.value = false
	}
}

function updateQuery() {
	query.value = searchQuery.value
	setFilterQuery()
	searchPerformed.value = true
	mobileAdvancedSearch.value = false
	showNoSearchParametersWarning.value = !query.value && !filterQuery.value
	showDefaultMessage.value = false
}

function capitalizeWords(arr) {
	return arr.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
	})
}

function sanitizeQueryParameter(routeObj, param) {
	if (routeObj.query[param]) {
		return capitalizeWords(Array.isArray(routeObj.query[param]) ? routeObj.query[param] : [routeObj.query[param]])
	}
	return []
}

function triggerSearchOnPageLoad() {
	query.value = route.query.q || ''
	page.value = route.query.page || 0

	const filtersFromUrl = {
		diet: sanitizeQueryParameter(route, 'diet'),
		category: sanitizeQueryParameter(route, 'category'),
		free: sanitizeQueryParameter(route, 'free'),
		cuisine: sanitizeQueryParameter(route, 'cuisine'),
		months: sanitizeQueryParameter(route, 'months'),
		baseRecipe: sanitizeQueryParameter(route, 'baseRecipe'),
		authorName: sanitizeQueryParameter(route, 'authorName')
	}

	searchStore.saveSearchFilters(filtersFromUrl)
	searchStore.saveSearchQuery(query.value)

	filterQuery.value = buildFilterQuery(filtersFromUrl)
	if (filterQuery.value || query.value) {
		searchPerformed.value = true
	}
}

function pageChange() {
	document.body.scrollIntoView()
}

watch(launchSearchFromBar, () => {
	updateQuery()
})

watch(() => route.query, () => {
	triggerSearchOnPageLoad()
	showDefaultMessage.value = false
})

onMounted(() => {
	searchClient.value = algoliaClient
	triggerSearchOnPageLoad()
})

useHead(() => {
	const doc = prismicDoc.value
	const metaTitle = doc?.data?.meta_title
	const metaDescription = doc?.data?.meta_description || ''
	const ogImage = doc?.data?.facebook_image?.url || ''
	const canonicalUrl = doc?.url
		? `https://www.fristouille.org${doc.url}/`
		: 'https://www.fristouille.org/recettes/'

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
		]
	}
})
</script>
