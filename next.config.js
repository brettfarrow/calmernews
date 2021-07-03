const { withLayer0, withServiceWorker } = require('@layer0/next/config');
const { withPlausibleProxy } = require('next-plausible');

module.exports = withPlausibleProxy()({
  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }

    return config;
  },
  ...withLayer0(
    withServiceWorker({
      layer0SourceMaps: true,
    })
  ),
});
