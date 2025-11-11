const CACHE_NAME = 'sonari-v1';
const ASSETS = [
  './',
  './index.html',
  './listen.html',
  './premium.html',
  './sleep.html',
  './focus.html',
  './about.html',
  './support.html',
  './style.css',
  './logo.svg',
  './js/app.js',
  './manifest.json'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request))
  );
});
