export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. 预留 SW 物理直通口：若含有 sw-bypass=1 参数，直接放行，返回原始物理文件内容
  if (url.searchParams.get('sw-bypass') === '1') {
    return next();
  }

  // 2. Bot 爬虫友好：如果是搜索引擎爬虫，一律直接放行，确保正常收录
  const ua = request.headers.get('user-agent') || '';
  const isBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|sogou|360spider|haosou|yahoo|lighthouse|googlebot-mobile/i.test(ua);

  // 3. 单向入口分流：仅在根目录根据 Accept-Language 进行首次分流
  if (pathname === '/' || pathname === '/index.html') {
    if (!isBot) {
      const acceptLang = request.headers.get('Accept-Language') || '';
      const lowLang = acceptLang.toLowerCase();
      if (lowLang.startsWith('en')) {
        return Response.redirect(new URL('/en/', request.url), 302);
      }
      if (lowLang.startsWith('ja')) {
        return Response.redirect(new URL('/ja/', request.url), 302);
      }
      if (lowLang.startsWith('zh')) {
        return Response.redirect(new URL('/zh/', request.url), 302);
      }
    }
  }

  return next();
}
