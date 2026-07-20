import { useRuntimeConfig } from "nuxt/app";

export function useBackendApi() {
  // const {
  //   searchFunction,
  //   ingredientsFunction,
  //   recipeFunction,
  // } = useRuntimeConfig();

  // const searchRecipes = (query: string, filters?: string) =>
  //   $fetch(searchFunction, {
  //     query: {
  //       query,
  //       ...(filters ? { filters } : {}),
  //     },
  //   });

  // const getIngredients = () => $fetch(ingredientsFunction);

  // const getRecipes = (filter: string, compositions?: boolean) =>
  //   $fetch(recipeFunction, {
  //     query: {
  //       filter,
  //       ...(compositions ? { compositions: "true" } : {}),
  //     },
  //   });

  // return {
  //   searchRecipes,
  //   getIngredients,
  //   getRecipes,
  // };
}
