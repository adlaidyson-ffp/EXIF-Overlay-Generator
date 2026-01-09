const CACHE_NAME = 'exif-overlay-v16.1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Favicon/Icons
  'https://cdn-eu.fusedframe.co.uk/main-logos/jpg/squarefavicon-nocircle.jpg',
  // External Analytics Script (Included for silent loading/speed)
  'https://analytics.adffp.uk/script.js',
  

  
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
  
  // Montserrat
  './fonts/Montserrat/Montserrat-VariableFont_wght.ttf',
  './fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf',
  
  // Rubik Distressed
  './fonts/Rubik_Distressed/RubikDistressed-Regular.ttf',
  
  // Open Sans
  './fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf',
  
  // Roboto
  './fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf',
  
  // Barriecito
  './fonts/Barriecito/Barriecito-Regular.ttf',
  
  // Schoolbell
  './fonts/Schoolbell/Schoolbell-Regular.ttf',
  
  // Delius
  './fonts/Delius/Delius-Regular.ttf',
  
  // Jersey 10
  './fonts/Jersey_10/Jersey10-Regular.ttf',
  
  // EB Garamond
  './fonts/EBGaramond/EBGaramond-VariableFont_wght.ttf',
  './fonts/EBGaramond/EBGaramond-Italic-VariableFont_wght.ttf',
  
  // Inter
  './fonts/Inter/Inter-VariableFont_opsz,wght.ttf',
  './fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf',
  
  // Courier Prime
  './fonts/Courier_Prime/CourierPrime-Regular.ttf',
  './fonts/Courier_Prime/CourierPrime-Italic.ttf',
  './fonts/Courier_Prime/CourierPrime-Bold.ttf',
  './fonts/Courier_Prime/CourierPrime-BoldItalic.ttf'
  
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

// Install event - caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - cleaning up old caches
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

// Fetch event - serving from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});