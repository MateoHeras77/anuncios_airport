const CACHE_NAME = "airport-announcements-v2";
const PRECACHE_URLS = ["/", "/manifest.webmanifest", "/icon.svg"]; 

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  // Network First, Fallback to Cache Strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, clone it and put it in cache
        // But only if it's a valid http response (not an error like 500)
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
             cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        })
      )
  );
});
