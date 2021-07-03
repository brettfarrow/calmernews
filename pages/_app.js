import PlausibleProvider from 'next-plausible';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="calmernews.com">
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}
