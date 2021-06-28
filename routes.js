const { Router } = require('@layer0/core/router');
const { nextRoutes } = require('@layer0/next');
const { NEWS, SERVICE_WORKER, cacheResponse } = require('./cache');

module.exports = new Router()
  .match('/service-worker.js', ({ cache, serviceWorker }) => {
    cache(SERVICE_WORKER);
    return serviceWorker('.next/static/service-worker.js');
  })
  .match('/', cacheResponse(NEWS))
  .match('/api', cacheResponse(NEWS))
  .match('/news', cacheResponse(NEWS))
  .match('/api/news', cacheResponse(NEWS))
  .match('/_next/data/:__build__/news.json', cacheResponse(NEWS))
  .use(nextRoutes);
