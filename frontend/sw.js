const CACHE = 'ganaderia-pro-v2';
const APP_FILES = [
  '/',
  '/index.html',
  '/forms/login.html',
  '/forms/registro.html',
  '/forms/registro_ganado.html',
  '/forms/tratamientos.html',
  '/forms/produccion.html',
  '/forms/novedades.html',
  '/forms/inventario.html',
  '/forms/admin_dashboard.html',
  '/forms/ganadero_dashboard.html',
  '/forms/mayordomo_dashboard.html',
  '/forms/veterinario_dashboard.html',
  '/services/navigation.js',
  '/services/offlineSync.js',
  '/services/voiceAssistant.js',
  '/services/api.js',
  '/styles/theme.css',
  '/assets/css/tailwind.css',
  '/assets/css/all.min.css',
  '/assets/js/apexcharts.js',
  '/assets/webfonts/fa-solid-900.woff2',
  '/assets/webfonts/fa-brands-400.woff2',
  '/assets/webfonts/fa-regular-400.woff2',
  '/manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      console.log('Precaching offline assets...');
      return cache.addAll(APP_FILES);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Estrategia Stale-While-Revalidate para recursos locales
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchedResponse = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => null);

          return cachedResponse || fetchedResponse || caches.match('/index.html');
        });
      })
    );
  } else {
    // Para recursos externos (si los hubiera)
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});
