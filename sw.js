const CACHE_NAME = 'landscape-clients-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalação: faz cache dos arquivos
self.addEventListener('install', event => {
  self.skipWaiting(); // FORÇA a ativação imediata do novo service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Ativação: limpa caches antigos e assume controle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      ).then(() => self.clients.claim()) // Assume controle de todas as abas
    )
  );
});

// Intercepta requisições e serve do cache (estratégia cache-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
