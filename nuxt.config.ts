import axios from 'axios'
// create a function to fetch the routes from the API
const getRecipeRoutes = async (url) => {
  let recettes = axios({
        url: `${url}?filter=published`,
        method: "get",
  }).then((result) => {
    return result.data.map((recette) => {
      return `/recette/${recette.slug}/${recette.recipeId}`
    });
  });

  return Promise.all([recettes]).then((values) => {
    return values[0];
  });
};

export default defineNuxtConfig({
  ssr: true,
  hooks: {
   async 'prerender:routes' (ctx) {
      // fetch the routes from our function above
      const slugs = await getRecipeRoutes(process.env.QUERY_FUNCTION);
      // add the routes to the nuxt config
      for (const slug of slugs) {
        console.log(slug);
        ctx.routes.add(slug)
      }
    },
  },
  routeRules:{
    //generated on demand once until next deployment, cached on CDN
     '/recette/**': { isr: true },
     '/astuce/**': { isr: true }
  },
  nitro: {
    preset: 'netlify'
  },
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: "2026-03-17",
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/algolia",
    'vue3-carousel-nuxt',
    [
      "@nuxtjs/prismic",
      {
        endpoint: process.env.PRISMIC_ENDPOINT || "https://fristouille.prismic.io/api/v2",
        preview: false, // Désactive le mode preview
        toolbar: false,  // Désactive explicitement la toolbar
        // linkResolver: "@/utils/prismic-link-resolver",
        clientConfig: {
          routes: [
            { type: "homepage", path: "/" },
            { type: "recipes", path: "/recettes" },
            { type: "simplepage", path: "/:uid" },
            {
              type: "childpage",
              resolvers: { parent: "parent_page" },
              path: "/:parent/:uid",
            },
          ],
        },
      },
    ],
  ],
  algolia: {
    applicationId:
      process.env.ALGOLIA_APP_ID || process.env.ALGOLIA_APPLICATION_ID || "",
    apiKey: process.env.ALGOLIA_API_KEY || "",
    globalIndex: process.env.ALGOLIA_INDEX_NAME || "Recipes",
    instantSearch: true,
  },
  css: ["@/assets/css/main.css"],
  app: {
    head: {
      title: "Fristouille Migration",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  runtimeConfig: {
    public: {
      algoliaAppId: process.env.ALGOLIA_APP_ID || "",
      algoliaApiKey: process.env.ALGOLIA_API_KEY || "",
      searchFunction: process.env.SEARCH_INDEX_FUNCTION || "",
      recipeFunction: process.env.QUERY_FUNCTION || "",
      ingredientsFunction: process.env.INGREDIENTS_FUNCTION || "",
      baseUrl: process.env.BASE_URL || "",
      noPictureUrl: process.env.NOPICTURE_URL || "",
      plausibleDomain: process.env.PLAUSIBLE_DOMAIN || "",
      prismic: {
        endpoint: process.env.PRISMIC_ENDPOINT || "",
      },
    },
    prismicEndpoint: process.env.PRISMIC_ENDPOINT || "",
    airtableToken: process.env.AIRTABLE_TOKEN || "",
    algoliaIndexName: process.env.ALGOLIA_INDEX_NAME || "",
  },
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },
  pages: true,
  components: true,
});
