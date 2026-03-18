import algoliasearch from "algoliasearch";

const SEARCH_ATTRIBUTES = [
  "name",
  "slug",
  "pictureSmall",
  "pictureMedium",
  "diet",
  "totalTime",
  "authorName",
  "objectID",
];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchQuery = typeof query.query === "string" ? query.query : "";
  const filters = typeof query.filters === "string" ? query.filters : undefined;

  const config = useRuntimeConfig(event);
  const appId = config.public.algoliaAppId;
  const apiKey = config.public.algoliaApiKey;
  const indexName = config.algoliaIndexName;

  if (!appId || !apiKey || !indexName) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Algolia configuration",
    });
  }

  try {
    const client = algoliasearch(appId, apiKey);
    const index = client.initIndex(indexName);
    const results = await index.search(searchQuery, {
      hitsPerPage: 4,
      filters,
      attributesToRetrieve: SEARCH_ATTRIBUTES,
      attributesToHighlight: [],
    });

    return results.hits;
  } catch (error) {
    console.error("Failed to search index:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to search index",
    });
  }
});
