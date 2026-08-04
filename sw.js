/* ==========================================================
   Miracle · Service Worker
   离线缓存：优先使用缓存，安装到主屏后可离线访问。
   ========================================================== */
const CACHE_NAME = 'miracle-pwa-v4';
const SHELL = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/js/core.js',
  './assets/js/app.js',
  './assets/js/home.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // 导航请求：先网络，离线时回首页缓存
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => { putCache(r.clone()); return r; })
        .catch(() => caches.match('./index.html')
          .then(c => c || caches.match('/index.html'))
          .then(c => c || new Response('<h1>离线不可用</h1>', { status: 503, headers: { 'Content-Type': 'text/html' } })))
    );
    return;
  }

  // 静态资源：缓存优先，没命中再请求并写入缓存
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(r => {
        if (r.ok) putCache(r.clone());
        return r;
      }).catch(() => new Response('offline', { status: 503 }));
    })
  );
});

function putCache(res) {
  caches.open(CACHE_NAME).then(c => c.put(res.url, res)).catch(() => {});
}
