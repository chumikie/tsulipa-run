const CACHE_NAME = 'brs48cr-cache-v1';
const urlsToCache = [
  '/',
  '/favicon.svg',
  '/favicon-32.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache se estiver offline
        }
        return fetch(event.request); // Baixa da internet se possível
      })
  );
});
