const CACHE_NAME = 'kana-fdg-v1.3';
const STATIC_ASSETS = [
  'app.js', 'config.js', 'style.css', 'assets/data.csv',
  'assets/d3.v7.trimmed.js', 'assets/ZenKakuGothicNew-Regular-kana.woff2',
  'assets/KleeOne-600-kana.woff2', 'assets/favicon.svg', 'assets/maskable.svg'
];

const HTML_PAGES = ['/', '/ja', '/zh'];

// Installation: Precache assets & clean HTML responses (redirect defense)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(STATIC_ASSETS);
      await Promise.all(HTML_PAGES.map(async (page) => {
        try {
          const res = await fetch(`${page}?sw-bypass=1`);
          if (!res.ok || res.redirected) throw new Error();
          const cleanRes = new Response(await res.blob(), { headers: res.headers });
          await cache.put(page, cleanRes);
        } catch (err) { console.error(`Precache failed for ${page}`); }
      }));
    }).then(() => self.skipWaiting())
  );
});

// Activation: Clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor: SWR + Navigation Redirects
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const pathname = url.pathname;

  // A. Handle Navigation Requests (HTML pages)
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      // SW-level redirect on root path / based solely on browser language
      if (pathname === '/' || pathname === '/index.html') {
        const lang = (navigator.language || '').toLowerCase().slice(0, 2);
        if (lang === 'ja' || lang === 'zh') {
          return Response.redirect(new URL(`/${lang}`, self.location.origin).href, 302);
        }
      }

      const cached = await caches.match(pathname);

      const fetchAndUpdate = async () => {
        try {
          const netRes = await fetch(req);
          if (netRes.redirected) return Response.redirect(netRes.url, 302);
          if (netRes.ok && netRes.type !== 'opaqueredirect') {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(pathname, netRes.clone());
          }
          return netRes;
        } catch (err) { return cached || Promise.reject(err); }
      };

      if (cached) {
        e.waitUntil(fetchAndUpdate());
        return cached;
      }
      return fetchAndUpdate();
    })());
    return;
  }

  // B. Handle Static Assets (SWR)
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const fetchAndUpdate = async () => {
      try {
        const netRes = await fetch(req);
        if (netRes.ok && !netRes.redirected && netRes.type !== 'opaqueredirect') {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(req, netRes.clone());
        }
        return netRes;
      } catch (err) { return cached || Promise.reject(err); }
    };

    if (cached) {
      e.waitUntil(fetchAndUpdate());
      return cached;
    }
    return fetchAndUpdate();
  })());
});
