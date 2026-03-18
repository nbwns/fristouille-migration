export default defineNuxtPlugin(async () => {
  if (!import.meta.client) {
    return;
  }

  // Legacy PWA service worker can serve stale assets with wrong MIME in dev.
  // Ensure localhost/dev sessions always run without SW/cache interference.
  if (import.meta.dev || window.location.hostname === "localhost") {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
    return;
  }

  const workbox = await window.$workbox;
  if (!workbox) {
    return;
  }

  workbox.addEventListener("installed", (event) => {
    if (!event.isUpdate) {
      return;
    }
    window.location.reload();
  });
});