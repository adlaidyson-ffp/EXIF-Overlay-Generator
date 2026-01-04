const CACHE_NAME = 'exif-overlay-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/exif-js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
  'https://unpkg.com/lucide@latest',
  'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap',
  'https://cdn-eu.fusedframe.co.uk/main-logos/png/squarelogo-light-crop.png',
  'https://cdn-eu.fusedframe.co.uk/services/exif-overlay-generator/icons/aperture.png',
  'https://cdn-eu.fusedframe.co.uk/services/exif-overlay-generator/icons/camera.png',
  'https://cdn-eu.fusedframe.co.uk/services/exif-overlay-generator/icons/exposure.png',
  'https://cdn-eu.fusedframe.co.uk/services/exif-overlay-generator/icons/focal-length.png',
  'https://cdn-eu.fusedframe.co.uk/services/exif-overlay-generator/icons/iso.png',
  'https://cdn-eu.fusedframe.co.uk/services/exif-overlay-generator/icons/lens.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});