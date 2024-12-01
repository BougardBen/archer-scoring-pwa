/* eslint-disable no-restricted-globals */

// Les ressources à mettre en cache
const CACHE_NAME = "archer-scoring-v1";
const urlsToCache = [
  "/archer-scoring-pwa/",
  "/archer-scoring-pwa/index.html",
  "/archer-scoring-pwa/static/js/main.0d78696f.js",
  "/archer-scoring-pwa/static/css/main.2cd8c39c.css",
  "/archer-scoring-pwa/manifest.json",
  "/archer-scoring-pwa/logo192.png",
  "/archer-scoring-pwa/logo512.png",
  "/archer-scoring-pwa/favicon.ico",
];

// Installation du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert");
      return cache.addAll(urlsToCache);
    })
  );
});

// Récupération des ressources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne la ressource du cache si elle existe
      if (response) {
        return response;
      }
      // Sinon fait la requête au réseau
      return fetch(event.request).then((response) => {
        // Ne met en cache que si la requête est réussie
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        // Met en cache une copie de la réponse
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
