import '../styles/globals.css';
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
  }, []);

  return (
    <>
      <PWABoilerplate />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
