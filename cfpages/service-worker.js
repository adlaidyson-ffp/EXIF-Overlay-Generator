const CACHE_NAME = 'exif-overlay-sw-v2.0';

const ASSETS = [
  './',
  './manifest.json',
  './assets/libs/exif-js.js',
  './assets/libs/jszip.min.js',
  './assets/libs/filesaver.min.js',
  './assets/libs/lucide.min.js',
  './icons/favicon.jpg',
  
  // Playfair Display
  './fonts/Playfair/Playfair-VariableFont_opsz,wdth,wght.ttf',
  './fonts/Playfair/Playfair-Italic-VariableFont_opsz,wdth,wght.ttf',
  
  // Rubik Burned
  './fonts/Rubik_Burned/RubikBurned-Regular.ttf',
  
  // Lato
  './fonts/Lato/Lato-Regular.ttf',
  './fonts/Lato/Lato-Bold.ttf',
  './fonts/Lato/Lato-Italic.ttf',
  
  // Story Script
  './fonts/Story_Script/StoryScript-Regular.ttf',
  
  // Orbitron
  './fonts/Orbitron/Orbitron-VariableFont_wght.ttf',
  
  // Oswald
  './fonts/Oswald/Oswald-VariableFont_wght.ttf',
  
  // Shadows Into Light
  './fonts/Shadows_Into_Light/ShadowsIntoLight-Regular.ttf',
  
  // EBGaramond
  './fonts/EBGaramond/EBGaramond-VariableFont_wght.ttf',
  './fonts/EBGaramond/EBGaramond-Italic-VariableFont_wght.ttf',
  
  // Inter
  './fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
  './fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
  
  // Courier Prime
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use map + Promise.allSettled so one 404 doesn't kill the whole PWA installation
      return Promise.allSettled(
        ASSETS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            await cache.put(url, response);
          } catch (err) {
            console.warn(`PWA Warning: Could not cache ${new URL(url, location.href).href}. Check if file exists.`);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});