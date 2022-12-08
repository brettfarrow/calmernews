const { withEdgio, withServiceWorker } = require('@edgio/next/config');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withEdgio(
  withServiceWorker({
    edgioSourceMaps: true,
  }),
  withPWA({
    pwa: {
      dest: 'public',
      runtimeCaching,
    },
  })
);
