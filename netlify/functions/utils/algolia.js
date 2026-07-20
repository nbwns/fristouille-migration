module.exports = {
    getAlgoliaObject: (recette) => {

			let algoliaObject = {
				objectID: recette.recipeId,
				name: recette.name,
				slug: recette.slug,
				createdOn: recette.createdOn,
				description: recette.description,
				pictureSmall: recette.pictureSmall,
				pictureMedium: recette.pictureMedium,
				diet: recette.diet,
				price: recette.price,
				free: recette.free,
				category: recette.category,
				cuisine: recette.cuisine,
				months: recette.months,
				preparationTime: (recette.preparationTime ?? 0)/60,
				cookTime: (recette.cookTime ?? 0)/60,
				totalTime: (parseInt(recette.cookTime ?? 0) + parseInt(recette.preparationTime ?? 0))/60,
				yield: recette.yield,
				baseRecipe: recette.baseRecipe,
				authorName: recette.authorName,
				createdOn: new Date(recette.createdOn).getTime()
			}

			algoliaObject.tags = recette.tagsList;
			algoliaObject.ingredients = recette.ingredientsList;

			return algoliaObject;
		}
}