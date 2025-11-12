const CACHE='sonari-v7-ultra';
const ASSETS=['./','./index.html','./listen.html','./plans.html','./stories.html','./about.html','./support.html','./privacy.html','./terms.html','./press.html','./style.css','./js/app.js','./js/i18n.js','./js/waves.js','./img/logo.svg','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))) });
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });
