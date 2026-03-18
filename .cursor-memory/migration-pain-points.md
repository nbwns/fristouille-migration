# Migration Pain Points

## 1) Options API -> `<script setup>`
- Une partie importante des pages est en Options API (`data`, `computed`, `methods`, `asyncData`, `head`).
- Certains fichiers mélangent déjà `setup()` + Options API (ex: page recettes), ce qui complique la migration incrémentale.
- Les hooks et dépendances client-only (`window`, `localStorage`, `document`) doivent etre encapsulés proprement dans `onMounted`/guards côté client.

## 2) Vuex -> Pinia
- Vuex root (`store/index.js`) a ete supprime pour eviter la coexistence des patterns.
- Les stores Pinia restent dans `store/` (legacy path) et pourront etre deplaces vers `stores/` plus tard.
- Risque residuel: imports explicites `~/store/*` encore presents, a harmoniser quand les pages/plugins seront finalises.

## 3) Incompatibilités Nuxt 2 -> Nuxt 3
- `nuxt.config.js` Nuxt 2 (shape legacy: `target`, `buildModules`, `publicRuntimeConfig`, `loading`, `generate`).
- Modules à remplacer/adapter:
  - `@nuxtjs/axios` -> `$fetch`/`useFetch`.
  - `@nuxtjs/pwa` (stratégie Nuxt 3 différente).
  - `@nuxtjs/prismic` v1 -> version Nuxt 3 compatible.
  - `@nuxtjs/composition-api` obsolète en Nuxt 3 (Composition API native).
- Plugins Nuxt 2 (`Vue.use`) à réécrire en `defineNuxtPlugin`.
- Middleware Nuxt 2 (`redirect`) à convertir en `defineNuxtRouteMiddleware` + `navigateTo`.
- Routes dynamiques `_param` à renommer en `[param]`.

## 4) Réseau et APIs (axios -> fetch/Nitro)
- Appels `$axios` dispersés dans les pages et dans `nuxt.config.js` (sitemap/generate).
- Dépendance forte aux URLs de fonctions externes en build-time.
- Contrats JSON construits directement dans les functions Netlify, avec mapping Airtable fragile si schéma évolue.

## 5) Airtable/Netlify -> Nitro `server/api`
- `queryRecipes` et `queryIngredients` sont centraux et doivent etre portés vers `server/api`.
- Risques:
  - validation insuffisante des paramètres (`filter`, `compositions`) dans le code actuel.
  - duplication de mapping recette/Algolia (`buildIndex`, `algoliaConnector`).
  - gestion CORS et erreurs à normaliser en Nitro.

## 6) Tailwind v3 -> v4
- CSS actuelle repose sur `@tailwind base/components/utilities`, `@layer`, `@apply` massifs.
- `postcss.config.js` et plugins doivent etre adaptés au pipeline v4.
- `tailwind.config.js` très personnalisé (tokens, fonts, couleurs, radius) à conserver sans régression visuelle.
- Risque élevé de régression sur classes utilitaires custom et thème dark mode.

## 7) SEO / Metadata / Routing
- Beaucoup de `head()` par page à migrer vers `useHead`.
- Canonical/OG/JSON-LD construits manuellement dans plusieurs pages.
- Incohérences potentielles de casse d'URL (`Recette/recette`, `Recettes/recettes`) à sécuriser pendant la migration.

## 8) Package manager npm -> pnpm
- Présence de `package-lock.json` (npm) à remplacer par `pnpm-lock.yaml`.
- Scripts doc/CI/deploy et conventions d'équipe à uniformiser en `pnpm`.
- Vérifier compatibilité des scripts Netlify/build avec `pnpm`.
