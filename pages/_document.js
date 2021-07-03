import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html className={`dark no-js`} lang="en">
        <Head>
          <link rel="manifest" href="manifest.json" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="cn" />
          <meta name="apple-mobile-web-app-title" content="cn" />
          <meta name="theme-color" content="#374151" />
          <meta name="msapplication-navbutton-color" content="#374151" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta
            name="msapplication-starturl"
            content="https://calmernews.com"
          />
          <link
            rel="icon"
            sizes="512x512"
            href="https://calmernews.com/logo-min.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="https://calmernews.com/logo-min.png"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
            rel="stylesheet"
          />
          <script
            defer
            data-domain="calmernews.com"
            src="https://plausible.io/js/plausible.js"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.classList.remove("no-js");`,
            }}
          />
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
