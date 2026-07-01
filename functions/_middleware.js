export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Detect bots
  const ua = request.headers.get('user-agent') || '';
  const isBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|sogou|360spider|haosou|yahoo|lighthouse|googlebot-mobile/i.test(ua);

  // Only handle root page redirects for real users
  if (pathname === '/' || pathname === '/index.html') {
    if (!isBot) {
      const acceptLang = request.headers.get('Accept-Language') || '';
      const lowLang = acceptLang.toLowerCase();
      if (lowLang.startsWith('ja')) {
        return Response.redirect(new URL('/ja', request.url), 302);
      }
      if (lowLang.startsWith('zh')) {
        return Response.redirect(new URL('/zh', request.url), 302);
      }
    }
  }

  // Continue to serve static assets
  return next();
}
