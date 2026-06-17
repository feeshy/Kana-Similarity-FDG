var CACHE = 'kana-fdg-v1';
var URLS = [
  '/', '/ja.html', '/zh.html',
  'app.js', 'config.js', 'style.css',
  'assets/data.csv'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(URLS);
    }).then(self.skipWaiting)
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(clients.claim());
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
