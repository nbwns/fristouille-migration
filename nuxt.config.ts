export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  compatibilityDate: "2026-03-17",
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/algolia",
    [
      "@nuxtjs/prismic",
      {
        endpoint:
          process.env.PRISMIC_ENDPOINT ||
          "https://fristouille.prismic.io/api/v2",
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
      searchIndexFunction: process.env.SEARCH_INDEX_FUNCTION || "",
      queryFunction: process.env.QUERY_FUNCTION || "",
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
