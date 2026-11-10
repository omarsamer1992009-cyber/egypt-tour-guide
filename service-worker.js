
const CACHE_NAME = "egypt-tour-guide-v2";

const CORE_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json"
];

// Install: save the essential website files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_FILES)
    )
  );

  self.skipWaiting();
});

// Activate: remove older versions of this app's cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) =>
            key.startsWith("egypt-tour-guide-") &&
            key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Fetch: use saved files when possible
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only cache files from this website
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Try the network first for pages
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(request, copy)
            );
          }
          return response;
        })
        .catch(async () => {
          return (
            await caches.match(request) ||
            await caches.match("./index.html")
          );
        })
    );
  } else {
    // For CSS, JavaScript, images and other files:
    // use the cache first, then save successful network responses.
    event.respondWith(
      caches.match(request).then(async (cached) => {
        if (cached) return cached;

        const response = await fetch(request);

        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, copy);
        }

        return response;
      })
    );
  }
});
