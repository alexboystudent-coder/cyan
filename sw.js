const CACHE_NAME = 'cyberworkout-v2';
const assetsToCache = [
    './index.html',
    './c.css',
    './c1.css',
    './c2.css',
    './pr.css',
    './ez1.html',
    './ez2.html',
    './ez3.html',
    './ez4.html',
    './ez5.html',
    './J.js',
    './j1.js',
    './j2.js',
    './j3.js',
    './j4.js',
    './manifest.json',
    './icon-512.png'
];

// Telepítés esemény: az összes aktív fájl letöltése és mentése
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

// Aktiválás esemény: a régi gyorsítótárak takarítása
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch esemény: offline kiszolgálás a cache-ből
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
