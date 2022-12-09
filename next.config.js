const { withLayer0, withServiceWorker } = require('@layer0/next/config');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withLayer0(
  withServiceWorker({
    layer0SourceMaps: true,
  }),
  withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
    },
  })
);
