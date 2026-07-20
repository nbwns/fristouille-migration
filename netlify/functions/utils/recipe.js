function mapRecipeRecord(record) {
  const fields = record?.fields || {};

  return {
    recipeId: fields.RecipeID ?? null,
    name: fields.Name ?? null,
    description: fields.Description ?? null,
    picture: fields.Picture ?? null,
    pictureSmall: fields.PictureSmall ?? null,
    pictureMedium: fields.PictureMedium ?? null,
    diet: fields.Diet ?? null,
    preparationTime: fields.PreparationTime ?? null,
    cookTime: fields.CookTime ?? null,
    yield: fields.Yield ?? null,
    procedure: fields.Procedure ?? null,
    ingredients: fields.Ingredients ?? null,
    price: fields.Price ?? null,
    difficulty: fields.Difficulty ?? null,
    months: fields.Months ?? null,
    category: fields.Category ?? null,
    cuisine: fields.Cuisine ?? null,
    free: fields.Free ?? null,
    baseRecipe: fields.BaseRecipe ?? null,
    createdOn: fields.CreatedOn ?? null,
    prismicPageId: fields.PrismicPageID ?? null,
    slug: fields.Slug ?? null,
    authorName: Array.isArray(fields.AuthorName) ? fields.AuthorName[0] ?? null : null,
    authorWeb: Array.isArray(fields.AuthorWeb) ? fields.AuthorWeb[0] ?? null : null,
    source: fields.Source ?? null,
    tagsList: fields.TagsList ?? null,
    compositionsJson: fields.CompositionsJSON ?? null,
    ingredientsList: fields.IngredientsList ?? null,
    compositionsStructuredData: fields.CompositionsStructuredData ?? null,
  };
}

function mapRecipeCompositionRecord(record) {
  const fields = record?.fields || {};

  return {
    recipeId: fields.RecipeID ?? null,
    recipeName: fields.Name ?? null,
    yield: fields.Yield ?? null,
    compositionsJson: fields.CompositionsJSON ?? null,
  };
}

module.exports = {
    mapRecipeRecord: mapRecipeRecord,
    mapRecipeCompositionRecord: mapRecipeCompositionRecord
}
