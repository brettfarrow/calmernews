import '../styles/globals.css';
import PWABoilerplate from '../components/PWABoilerplate';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PWABoilerplate />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
