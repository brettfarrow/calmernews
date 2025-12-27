const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

module.exports = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig);
