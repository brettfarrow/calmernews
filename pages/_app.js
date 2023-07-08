import '../styles/globals.css';
import Head from 'next/head';
import PWABoilerplate from '../components/PWABoilerplate';

function MyApp({ Component, pageProps }) {
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
