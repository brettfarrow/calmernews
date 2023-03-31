import '../styles/globals.css';
import Head from 'next/head';
import PWABoilerplate from '../components/PWABoilerplate';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      setTimeout(() => {
        if (window?.plausible) window.plausible('pageview');
      }, 1000);

      router.events.on('routeChangeStart', handleRouteChange);

      // If the component is unmounted, unsubscribe
      // from the event with the `off` method:
      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
      };
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="A modified UI for Hacker News, starting with dark mode and no comments (by default). Not affiliated with Y Combinator or Hacker News in any way."
        />
      </Head>
      <PWABoilerplate />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
