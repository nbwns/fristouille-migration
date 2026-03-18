# Migration Plan (Atomique et séquentiel)

## Regle de securite absolue
- Tous les travaux sont executes uniquement dans ce repo `fristouille-migration`.
- Le repo production `fristouille` ne doit pas etre modifie.

## Etape 0 - Baseline de travail
- Objectif: verrouiller le contexte de migration.
- Actions:
  - Verifier le remote Git et la branche de travail du repo migration.
  - Initialiser/valider `.cursor-memory/*`.
- Validation:
  - Le repo de migration est actif, clean, et documente.

## Etape 1 - Migration npm vers pnpm
- Objectif: uniformiser le package manager avant les grosses migrations.
- Actions:
  - Remplacer `package-lock.json` par `pnpm-lock.yaml`.
  - Mettre a jour scripts/doc (`README`, commandes de build/dev).
  - Adapter CI/Netlify a `pnpm` (install/build).
- Validation:
  - `pnpm install` reussi.
  - `pnpm dev`, `pnpm build` et `pnpm generate` (si conserve) passent.

## Etape 2 - Baseline Nuxt 3
- Objectif: faire demarrer l'app en Nuxt 3 avec configuration minimale saine.
- Actions:
  - Migrer `nuxt.config.js` vers `nuxt.config.ts`.
  - Retirer/remplacer modules Nuxt 2 incompatibles.
  - Reconfigurer runtime config/public env Nuxt 3.
- Validation:
  - App boot en Nuxt 3 sans erreur bloquante.

## Etape 3 - Tailwind v4
- Objectif: migrer pipeline CSS sans casser le design system.
- Actions:
  - Mettre a jour dependances Tailwind/PostCSS v4.
  - Adapter `assets/css/main.css` (imports/layers/utilitaires).
  - Porter les tokens/theme custom et verifier dark mode.
- Validation:
  - Build CSS OK + pas de regression majeure visuelle sur ecrans cles.

## Etape 4 - Portage API Airtable/Algolia vers Nitro
- Objectif: supprimer la dependance runtime aux Netlify Functions pour le coeur data.
- Actions:
  - Creer `server/api/recipes`, `server/api/ingredients`, `server/api/search`.
  - Migrer logique Airtable et mapping JSON.
  - Centraliser le mapping Algolia et normaliser gestion d'erreurs.
- Validation:
  - Endpoints Nitro repondent avec les memes contrats (ou versionnes explicitement).

## Etape 5 - Data fetching frontend
- Objectif: retirer `$axios` legacy.
- Actions:
  - Migrer `asyncData` vers `useAsyncData`/`useFetch`.
  - Remplacer appels externes par appels internes Nitro (`/api/*`).
- Validation:
  - Home, listing recettes, detail recette, sections editoriales fonctionnent.

## Etape 6 - Store (Vuex -> Pinia)
- Objectif: finaliser un store unique.
- Actions:
  - Supprimer dependance et conventions Vuex.
  - Stabiliser stores Pinia et usages composants/pages.
- Validation:
  - Recherche/filtres/dark mode stables sans Vuex.

## Etape 7 - SFC et plugins
- Objectif: moderniser progressivement le code Vue.
- Actions:
  - Migrer prioritairement layouts/pages critiques vers `<script setup>`.
  - Recrire plugins Nuxt 2 en plugins Nuxt 3 (`defineNuxtPlugin`).
  - Migrer middleware vers `defineNuxtRouteMiddleware`.
- Validation:
  - Navigation et plugins critiques fonctionnent en Nuxt 3.

## Etape 8 - SEO, routing, generation
- Objectif: preserv er URL/SEO et stabiliser rendering.
- Actions:
  - Migrer `head()` vers `useHead`.
  - Verifier routes dynamiques `[param]`, redirections et canonical.
  - Repenser sitemap/prerender selon Nuxt 3.
- Validation:
  - Metadonnees SEO OK + URLs critiques inchang ees ou redirigees proprement.

## Etape 9 - Stabilisation finale
- Objectif: valider la migration en conditions quasi-prod.
- Actions:
  - Tests fonctionnels bout-en-bout des parcours critiques.
  - Verification perf/erreurs runtime/build.
  - Nettoyage final des dependances legacy.
- Validation:
  - Build de production OK, parcours critiques OK, checklist completee.
