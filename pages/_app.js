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
      </Head>
      <PWABoilerplate />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
