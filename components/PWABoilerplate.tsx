import Head from 'next/head';

const PWABoilerplate: React.FC = () => {
  return (
    <Head>
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="calmer news" />
      <meta name="apple-mobile-web-app-title" content="calmer news" />
      <meta name="theme-color" content="#1F2937" />
      <meta name="msapplication-navbutton-color" content="#1F2937" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
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
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/images/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/images/favicon-16x16.png"
      />
      <link
        rel="mask-icon"
        href="/images/safari-pinned-tab.svg"
        color="#1F2937"
      />
      <meta name="msapplication-TileColor" content="#1F2937" />
    </Head>
  );
};

export default PWABoilerplate;
