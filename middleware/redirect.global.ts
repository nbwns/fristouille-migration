import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

function redirectFromRecettes(pathname: string) {
  const legacyPrefix = "/recettes/";
  if (!pathname.startsWith(legacyPrefix) || pathname === legacyPrefix) {
    return pathname;
  }

  // Legacy route format: /recettes/<term>
  // Avoid redirecting nested paths and empty terms to prevent loops.
  const rawTerm = pathname.slice(legacyPrefix.length).trim();
  if (!rawTerm || rawTerm.includes("/")) {
    return pathname;
  }

  return `/recettes/?q=${encodeURIComponent(rawTerm)}`;
}

export default defineNuxtRouteMiddleware((to) => {
  const lowerPath = to.path.toLowerCase();
  if (to.path !== lowerPath) {
    return navigateTo(lowerPath, { redirectCode: 301 });
  }

  const redirectUrl = redirectFromRecettes(to.path);
  if (redirectUrl !== to.path) {
    return navigateTo(redirectUrl, { redirectCode: 301 });
  }
});
