import { CustomCacheKey } from '@layer0/core/router';

const FIFTEEN_MINUTE_TTL = 60 * 15;
const ONE_HOUR_TTL = 60 * 60;
const ONE_DAY_TTL = 60 * 60 * 24;
const ONE_YEAR_TTL = 60 * 60 * 24 * 365;

const key = new CustomCacheKey().excludeAllQueryParametersExcept(
  'p',
  'n',
  'next',
  'site'
);

module.exports = {
  FIFTEEN_MINUTE_TTL,
  ONE_HOUR_TTL,
  ONE_DAY_TTL,
  ONE_YEAR_TTL,
  key,
  NEWS: {
    key,
    browser: {
      maxAgeSeconds: 0,
    },
    edge: {
      maxAgeSeconds: ONE_HOUR_TTL,
      staleWhileRevalidateSeconds: FIFTEEN_MINUTE_TTL,
    },
  },
  SERVICE_WORKER: {
    browser: {
      maxAgeSeconds: 0,
    },
    edge: {
      maxAgeSeconds: ONE_YEAR_TTL,
      staleWhileRevalidateSeconds: ONE_HOUR_TTL,
    },
  },
  THIRD_PARTY_SCRIPTS: {
    browser: {
      maxAgeSeconds: 0,
    },
    edge: {
      maxAgeSeconds: ONE_YEAR_TTL,
      staleWhileRevalidateSeconds: ONE_HOUR_TTL,
    },
  },
  STATIC_ASSETS: {
    browser: {
      maxAgeSeconds: 0,
    },
    edge: {
      maxAgeSeconds: ONE_YEAR_TTL,
      staleWhileRevalidateSeconds: ONE_HOUR_TTL,
    },
  },
  cacheResponse:
    (config) =>
    ({ cache }) =>
      cache(config),
};
