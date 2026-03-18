export function useBackendApi() {
  const searchRecipes = (query: string, filters?: string) =>
    $fetch("/api/search", {
      query: {
        query,
        ...(filters ? { filters } : {}),
      },
    });

  const getIngredients = () => $fetch("/api/ingredients");

  const getRecipes = (filter: string, compositions?: boolean) =>
    $fetch("/api/recipes", {
      query: {
        filter,
        ...(compositions ? { compositions: "true" } : {}),
      },
    });

  return {
    searchRecipes,
    getIngredients,
    getRecipes,
  };
}
