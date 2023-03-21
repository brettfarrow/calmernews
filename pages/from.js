import React from 'react';
import get from 'lodash/get';
import Page from '../components/Page';
import News from '../components/News';

function From({ data, cookies }) {
  return (
    <Page>
      <News data={data} cookies={cookies} />
    </Page>
  );
}

From.getInitialProps = async function (ctx) {
  if (ctx.req) {
    const { url } = ctx.req;
    const data = await fetch(
      `${process.env.HOST}/api/from?${url.split('?')[1]}`
    ).then((r) => r.json());
    return {
      data: {
        ...data,
        from: true,
      },
      cookies: ctx.req.cookies,
    };
  } else {
    const site = get(ctx, 'query.site');
    const next = get(ctx, 'query.next');
    const apiUrl = `/api/from?site=${site}${next ? `&next=${next}` : ''}`;
    const data = await fetch(apiUrl).then((r) => r.json());
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

export default From;
