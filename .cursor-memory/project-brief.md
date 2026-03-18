# Fristouille Migration Brief

## Contexte
- Projet source: application Nuxt 2 en production (`fristouille`) avec contenu Prismic, recherche Algolia et recettes Airtable via Netlify Functions.
- Projet cible: migration complète dans ce repo dédié `fristouille-migration` (isolé du repo production).

## Stack actuelle (audit)
- Framework: `nuxt@2.16.x` (SSR + génération statique partielle).
- Données frontend: `@nuxtjs/axios` + `asyncData`.
- CMS: `@nuxtjs/prismic` (v1), `nuxt-sm`, `vue-slicezone`.
- Search: `vue-instantsearch` + Algolia (mix client direct et function proxy).
- Backend serverless: `netlify/functions/*` pour Airtable/Algolia.
- Styling: Tailwind CSS v3 + PostCSS8 + `@tailwindcss/nesting` + `@tailwindcss/typography`.
- State: Pinia uniquement (fichiers conserves temporairement dans `store/`).
- Package manager actuel: npm (`package-lock.json`).

## Stack cible
- Framework: Nuxt 3 (Nitro, Vue 3 natif).
- Data fetching: `$fetch`, `useFetch`, `useAsyncData`.
- API interne: `server/api/*` (portage des Netlify Functions).
- State: Pinia uniquement (suppression Vuex).
- Composants/pages: migration progressive vers `<script setup lang="ts">` quand pertinent.
- Styling: Tailwind CSS v4 (pipeline CSS/PostCSS adapté).
- Package manager: `pnpm` (lockfile et scripts/CI alignés).

## Contraintes non négociables
- Toute migration se fait uniquement dans ce repo `fristouille-migration`.
- Aucun changement ne doit être appliqué au repo production.

## Protocole d'exécution continu
"Avant chaque nouvelle tâche de codage, l'agent doit lire `migration-plan.md`, mettre à jour `active-context.md`, écrire le code, vérifier que ça fonctionne, et enfin mettre à jour `progress.md`."
