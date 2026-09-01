const CACHE_NAME = 'felho-tervezo-v1';
const ASSETS = [
  './ez.html',
  './c.css',
  './J.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});