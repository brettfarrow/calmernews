const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig);
