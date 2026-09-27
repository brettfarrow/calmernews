import type { GetServerSidePropsContext } from 'next';
import { loadItem, loadNews } from './hn';
import { responseError } from './errors';

export function pageProps(kind: 'news' | 'from' | 'item') {
  return async ({ query, req, res }: GetServerSidePropsContext) => {
    // HTML includes the user's display preferences; only the public API is cached.
    res.setHeader('Cache-Control', 'private, no-store');
    try {
      const data =
        kind === 'item'
          ? await loadItem(query)
          : await loadNews(query, kind === 'from');
      const cookies = Object.fromEntries(
        ['show_comments', 'show_byline', 'show_score'].map((name) => [
          name,
          req.cookies[name] === 'true',
        ]),
      );
      return { props: { data, cookies } };
    } catch (error) {
      const failure = responseError(error);
      res.statusCode = failure.status;
      return {
        props: { errorStatus: failure.status, errorMessage: failure.message },
      };
    }
  };
}
