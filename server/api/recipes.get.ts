import { fetchAllRecords, getAirtableBase } from "../utils/airtable";
import { mapRecipeCompositionRecord, mapRecipeRecord } from "../utils/recipes";

function parseCompositionsFlag(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }
  return value === "true" || value === "1";
}

function getSelectParams(filter: string) {
  if (filter === "published") {
    return { view: "Publiées" };
  }

  if (/^[A-Za-z0-9_-]+$/.test(filter)) {
    return { filterByFormula: `{recipeId} = '${filter}'` };
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Invalid filter parameter",
  });
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filter = typeof query.filter === "string" ? query.filter : "";
  const sendCompositions = parseCompositionsFlag(query.compositions);

  if (!filter) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required filter parameter",
    });
  }

  const config = useRuntimeConfig(event);
  if (!config.airtableToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Airtable credentials",
    });
  }

  try {
    const base = getAirtableBase(config.airtableToken);
    const records = await fetchAllRecords(base, "Recettes", getSelectParams(filter));

    if (sendCompositions) {
      return records.map(mapRecipeCompositionRecord);
    }

    return records.map(mapRecipeRecord);
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch recipes",
    });
  }
});
