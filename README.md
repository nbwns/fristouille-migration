# Fristouille Migration

Migration workspace of Fristouille to Nuxt 3 + Tailwind CSS v4, with pnpm and Nitro API routes.

## Stack

- Nuxt 3 (`nuxt`)
- Vue 3
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Pinia (`@pinia/nuxt`)
- Algolia via `@nuxtjs/algolia`

## Local Development

### Standard workflow

```bash
pnpm install
pnpm dev
```

- App URL: `http://localhost:3000`
- Main API flows run through Nitro routes in `server/api/*`
- `netlify functions:serve` is no longer required for day-to-day development

### When to use Netlify CLI

Use `netlify dev` only if you need to validate Netlify-specific behavior (deploy context, redirects, or Netlify-only tooling).

## Scripts

```bash
pnpm dev       # start Nuxt dev server
pnpm build     # production build
pnpm start     # start production server
pnpm generate  # static generation
```

## Environment Variables

Create a local `.env` file with at least:

- `ALGOLIA_APP_ID`
- `ALGOLIA_API_KEY`
- `ALGOLIA_INDEX_NAME`
- `AIRTABLE_TOKEN`
- `PRISMIC_ENDPOINT`

The app also supports additional optional variables used by legacy flows and external services.

## Project Structure (key folders)

- `pages/`: route views
- `components/`: reusable UI blocks
- `layouts/`: app layouts
- `assets/`: global styles and static source assets
- `server/api/`: Nitro API endpoints
- `server/utils/`: shared backend helpers (Airtable, data mapping)
- `composables/`: frontend composables (`useBackendApi`, etc.)
- `store/`: Pinia stores (legacy location kept during migration)

## Documentation

- Nuxt 3 docs: [https://nuxt.com/docs](https://nuxt.com/docs)
- Tailwind v4 docs: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
