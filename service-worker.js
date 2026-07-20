const CACHE_NAME = 'kana-fdg-v2.0';
const STATIC_ASSETS = [
  'app.js', 'fdg.js', 'chart.js', 'style.css', 'assets/data.csv',
  'assets/d3.v7.trimmed.js', 'assets/ZenKakuGothicNew-Regular-kana.woff2',
  'assets/KleeOne-600-kana.woff2', 'assets/favicon.svg', 'assets/maskable.svg'
];

// Installation: Precache shared assets + current language HTML
self.addEventListener('install', (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);

      // Determine language from the page that registered this SW
      let lang = 'en';
      try {
        const clients = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
        if (clients.length > 0) {
          const path = new URL(clients[0].url).pathname;
          const first = path.split('/').filter(Boolean)[0];
          if (['en', 'ja', 'zh'].includes(first)) lang = first;
        }
      } catch (e) {}

      // Precache current language pages (offline-first visit)
      for (const page of [`/${lang}`, `/${lang}/chart`]) {
        try {
          const res = await fetch(`${page}?sw-bypass=1`);
          if (res.ok && !res.redirected) {
            const cleanRes = new Response(await res.blob(), { headers: res.headers });
            await cache.put(page, cleanRes);
          }
        } catch (err) { /* page may not exist yet, skip */ }
      }

      self.skipWaiting();
    })()
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
      // Normalize trailing slash: /ja/ → /ja, /en/chart/ → /en/chart
      const normPath = pathname.replace(/\/$/, '') || '/';

      // SW-level redirect on root path / based solely on browser language
      if (normPath === '/' || normPath === '/index.html') {
        const lang = (navigator.language || '').toLowerCase().slice(0, 2);
        if (lang === 'ja' || lang === 'zh') {
          return Response.redirect(new URL(`/${lang}/`, self.location.origin).href, 302);
        }
      }

      const cached = await caches.match(normPath);

      const fetchAndUpdate = async () => {
        try {
          const netRes = await fetch(req);
          if (netRes.redirected) return Response.redirect(netRes.url, 302);
          if (netRes.ok && netRes.type !== 'opaqueredirect') {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(normPath, netRes.clone());
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
