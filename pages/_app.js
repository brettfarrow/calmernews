import '../styles/globals.css';
import Head from 'next/head';
import PWABoilerplate from '../components/PWABoilerplate';
import ErrorBoundary from '../components/ErrorBoundary';

function App({ Component, pageProps }) {
  const error = pageProps.error instanceof Error ? pageProps.error : null;
  const filteredProps = { ...pageProps };
  delete filteredProps.error;

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
      <ErrorBoundary error={error}>
        <Component {...filteredProps} />
      </ErrorBoundary>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  try {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
  } catch (error) {
    pageProps.error = error;
  }

  return { pageProps };
}

export default App;
