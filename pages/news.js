import React from 'react';
import Page from '../components/Page';
import News from '../components/News';
import get from 'lodash/get';
import fetchWithTimeout from '../utils/fetchWithTimeout';

function NewsPage({ data, cookies }) {
  return (
    <Page>
      <News data={data} cookies={cookies} />
    </Page>
  );
}

NewsPage.getInitialProps = async function (ctx) {
  if (ctx.req) {
    const { url } = ctx.req;
    const data = await fetchWithTimeout(
      `${process.env.HOST}/api/news?${url.split('?')[1]}`
    ).then((r) => r.json());
    return {
      data,
      cookies: ctx.req.cookies,
    };
  } else {
    const p = get(ctx, 'query.p', 1);
    const data = await fetchWithTimeout(`/api/news?p=${p}`).then((r) => r.json());
    const cookies = document.cookie.split('; ').reduce((prev, current) => {
      const [name, ...value] = current.split('=');
      prev[name] = value.join('=');
      return prev;
    }, {});
    return {
      data,
      cookies,
    };
  }
};

export default NewsPage;
