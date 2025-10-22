const CACHE_NAME = "mi-pwa-cache-v1";
const BASE_PATH = "./";

const urlsToCache = [
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.json`,
  `${BASE_PATH}offline.html`,
  `${BASE_PATH}icons/android.png`
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response; // Si hay internet, responde directo desde red
      })
      .catch(() => {
        return caches.match(event.request).then((res) => {
          // Si está en caché, lo devuelve. Si no, manda offline.html
          return res || caches.match(`${BASE_PATH}offline.html`);
        });
      })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Notificación sin datos";
  event.waitUntil(
    self.registration.showNotification("Mi PWA", { body: data })
  );
});
