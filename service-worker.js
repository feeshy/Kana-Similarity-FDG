var CACHE = 'kana-fdg-v1.2';
var URLS = [
  '/', '/ja.html', '/zh.html',
  'app.js', 'config.js', 'style.css',
  'assets/data.csv',
  'assets/d3.v7.trimmed.js',
  'assets/ZenKakuGothicNew-Regular-kana.woff2',
  'assets/KleeOne-600-kana.woff2'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(URLS);
    }).then(self.skipWaiting)
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(clients.claim)
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  var path = url.pathname;
  if (path === '/ja') { e.respondWith(caches.match('/ja.html')); return; }
  if (path === '/zh') { e.respondWith(caches.match('/zh.html')); return; }
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req);
    })
  );
});
