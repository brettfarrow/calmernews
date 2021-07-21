const { Router } = require('@layer0/core/router');
const { nextRoutes } = require('@layer0/next');
const {
  NEWS,
  SERVICE_WORKER,
  STATIC_ASSETS,
  THIRD_PARTY_SCRIPTS,
  cacheResponse,
} = require('./cache');
const { existsSync, readFileSync } = require('fs');
const { join } = require('path');

// Read the Next.js build ID from '.next/BUILD_ID'
const buildIdPath = join(process.cwd(), '.next', 'BUILD_ID');

function getPrerenderRequests() {
  const prerenderRequests = [
    { path: '/' },
    { path: '/api' },
    { path: '/from' },
  ];
  for (let i = 1; i <= 10; i++) {
    prerenderRequests.push({ path: `/news?p=${i}` });
    prerenderRequests.push({ path: `/api/news?p=${i}` });
  }

  if (existsSync(buildIdPath)) {
    // Derive the API requests from the HTML page URLs
    const buildId = readFileSync(buildIdPath, 'utf8');
    const apiPaths = prerenderRequests
      .filter((i) => i.path.startsWith('/news?p='))
      .map((p) => {
        const [pathname, search] = p.path.split('?');
        return {
          path: `/data/${buildId}${pathname}.json?${search}`,
        };
      });
    prerenderRequests.push(...apiPaths);
  }

  return prerenderRequests;
}

module.exports = new Router()
  .prerender(getPrerenderRequests)
  .match('/service-worker.js', ({ cache, serviceWorker }) => {
    cache(SERVICE_WORKER);
    return serviceWorker('.next/static/service-worker.js');
  })
  .match('/', cacheResponse(NEWS))
  .match('/api', cacheResponse(NEWS))
  .match('/news', cacheResponse(NEWS))
  .match('/api/news', cacheResponse(NEWS))
  .match('/from', cacheResponse(NEWS))
  .match('/api/from', cacheResponse(NEWS))
  .match('/_next/data/:__build__/from.json', cacheResponse(NEWS))
  .match('/_next/data/:__build__/index.json', cacheResponse(NEWS))
  .match('/_next/data/:__build__/news.json', cacheResponse(NEWS))
  .match('/js/measure.js', ({ cache, proxy, removeUpstreamResponseHeader }) => {
    cache(THIRD_PARTY_SCRIPTS);
    proxy('plausible', { path: '/js/plausible.js' });
    removeUpstreamResponseHeader('cache-control');
  })
  .post('/api/event', ({ proxy }) => {
    proxy('plausible');
  })
  .match('/favicon.ico', ({ serveStatic, cache }) => {
    cache(STATIC_ASSETS);
    serveStatic('public/images/favicon.ico');
  })
  .match('/robots.txt', ({ serveStatic, cache }) => {
    cache(STATIC_ASSETS);
    serveStatic('public/robots.txt');
  })
  .match('/manifest.json', ({ serveStatic, cache }) => {
    cache(STATIC_ASSETS);
    serveStatic('public/manifest.json');
  })
  .match('/images/:path*', ({ serveStatic, cache }) => {
    cache(STATIC_ASSETS);
    serveStatic('public/images/:path*');
  })
  .use(nextRoutes);
