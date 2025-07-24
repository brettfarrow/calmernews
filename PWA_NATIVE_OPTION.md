# Option 2: Native PWA Implementation

If you prefer to remove the next-pwa dependency entirely and implement PWA functionality natively, here's how:

## 1. Remove next-pwa dependency

```bash
npm uninstall next-pwa
```

## 2. Update next.config.js

```javascript
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

## 3. Update package.json

Remove the next-pwa overrides from package.json:

```json
{
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

## 4. Create a custom service worker

Create `public/sw.js`:

```javascript
const CACHE_NAME = 'calmernews-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

## 5. Register the service worker

Update `pages/_app.js` to register the service worker:

```javascript
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return <Component {...pageProps} />;
}
```

## 6. Update the manifest.json

Your existing `public/manifest.json` is already good, but ensure it has these key properties:

```json
{
  "name": "calmer news",
  "short_name": "calmer news",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#1F2937",
  "background_color": "#1F2937",
  "icons": [
    {
      "src": "https://calmernews.com/images/logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

## 7. Add meta tags in _document.js

Ensure your `pages/_document.js` includes PWA meta tags:

```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html className="dark no-js" lang="en">
        <Head>
          {/* PWA meta tags */}
          <meta name="application-name" content="Calmer News" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Calmer News" />
          <meta name="description" content="A calmer way to read the news" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#1F2937" />
          
          {/* Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Apple touch icons */}
          <link rel="apple-touch-icon" href="/images/logo.png" />
          
          {/* Your existing meta tags */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          {/* ... rest of your existing head content */}
        </Head>
        <body className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

## Benefits of Native Implementation

1. **No external dependencies** - Reduces bundle size and potential security vulnerabilities
2. **Full control** - Customize service worker behavior exactly as needed
3. **Future-proof** - No need to wait for package updates for new Next.js versions
4. **Better performance** - Eliminate the overhead of next-pwa processing
5. **Simpler debugging** - Direct control over service worker logic

## Implementation Steps

If you want to switch to native PWA:

1. Run the commands above to remove next-pwa
2. Update the configuration files as shown
3. Test that the service worker registers correctly
4. Verify that the app can be installed as a PWA

The choice is yours - both options work perfectly with Next.js 15 and React 19!