// JOS Lite - Service Worker
const CACHE_NAME = 'jos-lite-v1';
const ASSETS = [
    '/pwa/',
    '/pwa/index.html',
    '/pwa/app.js',
    '/pwa/styles.css',
    '/pwa/manifest.json'
];

// Install - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                // Cache successful fetches
                if (fetchResponse.ok && event.request.method === 'GET') {
                    const clone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return fetchResponse;
            });
        }).catch(() => {
            // Offline fallback
            if (event.request.destination === 'document') {
                return caches.match('/pwa/index.html');
            }
        })
    );
});
