const { withLayer0, withServiceWorker } = require('@layer0/next/config');

module.exports = withLayer0(
  withServiceWorker({
    layer0SourceMaps: true,
    env: {
      HOST: 'http://localhost:3000', // TODO: process.env.NODE_ENV === 'production' ? `https://example.com/` : `http://localhost:3000`
    },
  })
);
