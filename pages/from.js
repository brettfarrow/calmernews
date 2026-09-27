import Page from '../components/Page';
import News from '../components/News';
import LoadError from '../components/LoadError';
import { pageProps } from '../server/pageProps';

export const getServerSideProps = pageProps('from');

export default function FromPage({ data, cookies, errorStatus, errorMessage }) {
  return (
    <Page>
      {errorStatus ? (
        <LoadError message={errorMessage} />
      ) : (
        <News data={data} cookies={cookies} />
      )}
    </Page>
  );
}
