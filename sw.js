const CACHE = 'mycorner-v3';
const BASE = '/sal-project';
const ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/pastel-home.html',
  BASE + '/pastel-jadwal.html',
  BASE + '/pastel-checklist.html',
  BASE + '/pastel-kalori.html',
  BASE + '/gothic-home.html',
  BASE + '/gothic-jadwal.html',
  BASE + '/gothic-checklist.html',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      }).catch(() => caches.match(BASE + '/index.html'));
    })
  );
});
