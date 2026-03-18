# System Architecture (As-Is)

## Vue d'ensemble
- Application Nuxt 2 structurée en `pages/`, `components/`, `layouts/`, `plugins/`, `store/`.
- Source éditoriale: Prismic (pages, slices, contenu SEO).
- Source métier recettes/ingrédients: Airtable, exposé via Netlify Functions.
- Recherche: Algolia (indexé depuis Airtable, consommé côté client et via function proxy).

## Structure applicative
- `pages/`
  - `index.vue`: homepage (Prismic + featured recipes via function de search).
  - `Recettes/index.vue`: moteur de recherche principal (Algolia client direct + Pinia).
  - `Recette/_slug/_id.vue`: détail recette (Airtable + liaison article Prismic via `prismicPageId`).
  - `_section/index.vue` et `_section/_uid/index.vue`: pages éditoriales Prismic et listes.
- `layouts/`
  - `default.vue`: shell global, navigation, footer, dark mode.
  - `error.vue`: rendu erreurs Nuxt 2.
- `components/`
  - Composants UI et métier (cards, recipe sections, navigation, search filters, etc.).
- `plugins/`
  - `vue-instantsearch.js`: enregistrement plugin Vue.
  - `pwa-update.js`: logique update Workbox.
  - `link-resolver.js`, `html-serializer.js`, `labels.js`: intégration Prismic/texte.
- `store/`
  - `search.js`, `darkMode.js`: stores Pinia actifs.
  - `index.js` Vuex root supprime pendant la migration.

## Flux de données actuel
1. Prismic alimente le contenu des pages (`asyncData`, requêtes `$prismic.api.*`).
2. Pages Nuxt appellent des URLs de functions via `$axios` (`QUERY_FUNCTION`, `INGREDIENTS_FUNCTION`, `SEARCH_INDEX_FUNCTION`).
3. Netlify Functions interrogent Airtable/Algolia puis renvoient du JSON.
4. Certaines pages (notamment recherche) interrogent Algolia directement côté client.

## Airtable (as-is)
- Point d'entrée principal:
  - `netlify/functions/queryRecipes.js` -> table `Recettes`, modes:
    - `filter=published`
    - `filter=<recipeId>`
    - `compositions=true` (payload réduit)
  - `netlify/functions/queryIngredients.js` -> table `Ingrédients`, vue `RecipeCategories page`.
- Auth via `AIRTABLE_TOKEN`.

## Algolia (as-is)
- `netlify/functions/buildIndex.js`: reconstruit l'index à partir des recettes Airtable.
- `netlify/functions/searchIndex.js`: endpoint de recherche/featured.
- `pages/Recettes/index.vue`: recherche Algolia directe en navigateur.

## Gestion d'état
- Etat de recherche: Pinia (`useSearchStore`), utilisé dans search bar/advanced search/page recettes.
- Dark mode: Pinia (`useDarkModeStore`), initialisé dans `layouts/default.vue`.
- Etat désormais Pinia-only; le dossier `store/` reste un emplacement legacy a rationaliser (deplacement futur vers `stores/` possible).

## Points techniques clés Nuxt 2
- `nuxt.config.js` contient:
  - `buildModules`/`modules` Nuxt 2.
  - `publicRuntimeConfig`.
  - `generate.routes` (build statique de routes recettes).
  - sitemap alimenté par function externe.
- Middleware: `middleware/redirect.js` avec signature Nuxt 2.
- Routage dynamique en convention underscore (`_slug`, `_id`, `_section`, `_uid`).
