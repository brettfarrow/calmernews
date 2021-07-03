import Head from 'next/head';

export default function PWABoilerplate() {
  return (
    <Head>
      <link rel="manifest" href="manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="calmer news" />
      <meta name="apple-mobile-web-app-title" content="calmer news" />
      <meta name="theme-color" content="#374151" />
      <meta name="msapplication-navbutton-color" content="#374151" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="msapplication-starturl" content="https://calmernews.com" />
      <link
        rel="icon"
        sizes="512x512"
        href="https://calmernews.com/images/logo.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="512x512"
        href="https://calmernews.com/images/logo.png"
      />
    </Head>
  );
}
