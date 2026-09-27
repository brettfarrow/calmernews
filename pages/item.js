import Page from '../components/Page';
import Comments from '../components/Comments';
import LoadError from '../components/LoadError';
import { pageProps } from '../server/pageProps';

export const getServerSideProps = pageProps('item');

export default function ItemPage({ data, cookies, errorStatus, errorMessage }) {
  return (
    <Page>
      {errorStatus ? (
        <LoadError message={errorMessage} />
      ) : (
        <Comments data={data} />
      )}
    </Page>
  );
}
