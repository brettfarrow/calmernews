import '../styles/globals.css';
import PWABoilerplate from '../components/PWABoilerplate';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
        <script
          defer
          data-domain="calmernews.com"
          src="https://plausible.io/js/plausible.js"
        />
      </Head>
      <PWABoilerplate />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
