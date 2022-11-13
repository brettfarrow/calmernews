const { Router } = require('@edgio/core/router');
const { nextRoutes } = require('@edgio/next');
const {
  NEWS,
  SERVICE_WORKER,
  STATIC_ASSETS,
  THIRD_PARTY_SCRIPTS,
  cacheResponse,
} = require('./cache');

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
  .match('/r', cacheResponse(NEWS))
  .match('/api/r', cacheResponse(NEWS))
  .match('/r/:subreddit*', cacheResponse(NEWS))
  .match('/api/r/:subreddit*', cacheResponse(NEWS))
  .match('/r/domain/:domain*', cacheResponse(NEWS))
  .match('/api/r/domain/:domain*', cacheResponse(NEWS))
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
