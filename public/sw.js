// Subh Lagan Sarees Service Worker v1.0.0
const CACHE_NAME = 'subh-lagan-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/logo.png',
  '/logo-icon.png',
  '/logo-icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
];

// Install: Cache core shell and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('PWA: Some core assets failed to pre-cache', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches & take control immediately
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
    }).then(() => self.clients.claim())
  );
});

// Fetch: Smart network-first for navigation & API bypass
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests
  if (req.method !== 'GET') return;

  // NEVER cache API requests or external services like cloudinary/mongo
  if (url.pathname.startsWith('/api') || url.hostname.includes('onrender.com')) {
    return;
  }

  // Handle SPA navigation requests: Network First, fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedIndex = await cache.match('/index.html');
        return cachedIndex || new Response(
          '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Subh Lagan - Offline</title><style>body{font-family:sans-serif;background:#FAF7F2;color:#681B2C;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px;}</style></head><body><div><h2>You are currently offline</h2><p>Please check your internet connection to continue browsing Subh Lagan sarees.</p></div></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
    return;
  }

  // Handle static assets (JS, CSS, images, fonts): Cache-First / Stale-While-Revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?|ico)$/) ||
     url.pathname.startsWith('/assets/'))
  ) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(req)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(req, networkResponse.clone());
                });
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(req).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
          return networkResponse;
        });
      })
    );
  }
});

