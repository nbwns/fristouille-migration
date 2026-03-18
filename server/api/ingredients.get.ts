import { fetchAllRecords, getAirtableBase } from "../utils/airtable";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!config.airtableToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Airtable credentials",
    });
  }

  try {
    const base = getAirtableBase(config.airtableToken);
    const records = await fetchAllRecords(base, "Ingrédients", {
      view: "RecipeCategories page",
    });

    return records.map((record: any) => {
      const fields = record?.fields || {};
      return {
        name: fields.Name ?? null,
        aisle: fields.Aisle ?? null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch ingredients",
    });
  }
});
