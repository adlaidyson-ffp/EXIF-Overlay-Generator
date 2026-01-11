const CACHE_NAME = 'exif-overlay-sw-v2.5';

const ASSETS = [
  './',
  './manifest.json',
  './assets/libs/exif-js.js',
  './assets/libs/jszip.min.js',
  './assets/libs/filesaver.min.js',
  './assets/libs/lucide.min.js',
  './icons/favicon.jpg',
  './src/styles.css',
  
  // Fonts
  './fonts/Playfair/Playfair-VariableFont_opsz,wdth,wght.ttf',
  './fonts/Playfair/Playfair-Italic-VariableFont_opsz,wdth,wght.ttf',
  './fonts/Rubik_Burned/RubikBurned-Regular.ttf',
  './fonts/Lato/Lato-Regular.ttf',
  './fonts/Lato/Lato-Bold.ttf',
  './fonts/Lato/Lato-Italic.ttf',
  './fonts/Story_Script/StoryScript-Regular.ttf',
  './fonts/Orbitron/Orbitron-VariableFont_wght.ttf',
  './fonts/Oswald/Oswald-VariableFont_wght.ttf',
  './fonts/Shadows_Into_Light/ShadowsIntoLight-Regular.ttf',
  './fonts/EBGaramond/EBGaramond-VariableFont_wght.ttf',
  './fonts/EBGaramond/EBGaramond-Italic-VariableFont_wght.ttf',
  './fonts/Courier_Prime/CourierPrime-Regular.ttf',
  './fonts/Courier_Prime/CourierPrime-Italic.ttf',
  './fonts/Courier_Prime/CourierPrime-Bold.ttf',
  './fonts/Courier_Prime/CourierPrime-BoldItalic.ttf',
  
  // Icons
  './icons/aperture.png',
  './icons/exposure.png',
  './icons/iso.png',
  './icons/focal-length.png',
  './icons/camera.png',
  './icons/lens.png',
  './icons/facebook.svg',
  './icons/instagram.svg',
  './icons/x.svg',
  './icons/mastodon.svg',
  './icons/tiktok.svg',
  './icons/snapchat.svg'
];

// Install: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Network-first falling back to cache
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and same-origin requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache valid responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // For navigation requests, always return the root/index if not found
          if (event.request.mode === 'navigate') {
            return caches.match('./') || caches.match('./index.html');
          }
        });
      })
  );
});