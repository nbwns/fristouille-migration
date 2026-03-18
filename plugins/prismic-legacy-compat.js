import { asText } from "@prismicio/client";

export default defineNuxtPlugin({
  name: "prismic-legacy-compat",
  enforce: "post",
  setup(nuxtApp) {
  const patchLegacyAsText = () => {
    const nuxtPrismic = nuxtApp.$prismic;
    if (nuxtPrismic && typeof nuxtPrismic.asText !== "function") {
      nuxtPrismic.asText = asText;
    }

    const vuePrismic = nuxtApp.vueApp?.config?.globalProperties?.$prismic;
    if (vuePrismic && typeof vuePrismic.asText !== "function") {
      vuePrismic.asText = asText;
    }
  };

  patchLegacyAsText();
  nuxtApp.hook("app:created", patchLegacyAsText);
  },
});
