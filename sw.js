
const CACHE_NAME = "nombre-del-cache";


const urlsToCache = ["index.html", "offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache.addAll(urlsToCache)));
});


self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("offline.html"))
      );
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Notificacion sin datos";
  event.waitUntil(self.registration.showNotification("Mi PWA", { body: data }));
});