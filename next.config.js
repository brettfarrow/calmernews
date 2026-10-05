const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Vercel disables Node's require(ESM); bundle the sanitizer's ESM parser.
  transpilePackages: ['sanitize-html'],
  turbopack: {},
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
