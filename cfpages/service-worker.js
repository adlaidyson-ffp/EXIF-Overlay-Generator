const CACHE_NAME = 'exif-overlay-sw-v3';

const ASSETS = [
  './',
  './manifest.json',
  './assets/libs/exif-js.js',
  './assets/libs/jszip.min.js',
  './assets/libs/filesaver.min.js',
  './assets/libs/lucide.min.js',
  './icons/favicon.jpg',
  './icons/headerfavicon.png',
  './src/styles.css',
  'https://get.microsoft.com/images/en-us%20dark.svg',
  
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

  // Manifest Icons (Fully sync'd from manifest.json)
  './icons/windows11/SmallTile.scale-100.png',
  './icons/windows11/SmallTile.scale-125.png',
  './icons/windows11/SmallTile.scale-150.png',
  './icons/windows11/SmallTile.scale-200.png',
  './icons/windows11/SmallTile.scale-400.png',
  './icons/windows11/Square150x150Logo.scale-100.png',
  './icons/windows11/Square150x150Logo.scale-125.png',
  './icons/windows11/Square150x150Logo.scale-150.png',
  './icons/windows11/Square150x150Logo.scale-200.png',
  './icons/windows11/Square150x150Logo.scale-400.png',
  './icons/windows11/WideTile.scale-100.png',
  './icons/windows11/WideTile.scale-125.png',
  './icons/windows11/WideTile.scale-150.png',
  './icons/windows11/WideTile.scale-200.png',
  './icons/windows11/WideTile.scale-400.png',
  './icons/windows11/LargeTile.scale-100.png',
  './icons/windows11/LargeTile.scale-125.png',
  './icons/windows11/LargeTile.scale-150.png',
  './icons/windows11/LargeTile.scale-200.png',
  './icons/windows11/LargeTile.scale-400.png',
  './icons/windows11/Square44x44Logo.scale-100.png',
  './icons/windows11/Square44x44Logo.scale-125.png',
  './icons/windows11/Square44x44Logo.scale-150.png',
  './icons/windows11/Square44x44Logo.scale-200.png',
  './icons/windows11/Square44x44Logo.scale-400.png',
  './icons/windows11/StoreLogo.scale-100.png',
  './icons/windows11/StoreLogo.scale-125.png',
  './icons/windows11/StoreLogo.scale-150.png',
  './icons/windows11/StoreLogo.scale-200.png',
  './icons/windows11/StoreLogo.scale-400.png',
  './icons/windows11/SplashScreen.scale-100.png',
  './icons/windows11/SplashScreen.scale-125.png',
  './icons/windows11/SplashScreen.scale-150.png',
  './icons/windows11/SplashScreen.scale-200.png',
  './icons/windows11/SplashScreen.scale-400.png',
  './icons/windows11/Square44x44Logo.targetsize-16.png',
  './icons/windows11/Square44x44Logo.targetsize-20.png',
  './icons/windows11/Square44x44Logo.targetsize-24.png',
  './icons/windows11/Square44x44Logo.targetsize-30.png',
  './icons/windows11/Square44x44Logo.targetsize-32.png',
  './icons/windows11/Square44x44Logo.targetsize-36.png',
  './icons/windows11/Square44x44Logo.targetsize-40.png',
  './icons/windows11/Square44x44Logo.targetsize-44.png',
  './icons/windows11/Square44x44Logo.targetsize-48.png',
  './icons/windows11/Square44x44Logo.targetsize-60.png',
  './icons/windows11/Square44x44Logo.targetsize-64.png',
  './icons/windows11/Square44x44Logo.targetsize-72.png',
  './icons/windows11/Square44x44Logo.targetsize-80.png',
  './icons/windows11/Square44x44Logo.targetsize-96.png',
  './icons/windows11/Square44x44Logo.targetsize-256.png',
  './icons/android/android-launchericon-512-512.png',
  './icons/android/android-launchericon-192-192.png',
  './icons/favicon512.png',
  './icons/favicon192.png'
];

// Install: Cache all assets
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
            return caches.match('./');
          }
        });
      })
  );
});