import React from 'react';
import Page from '../components/Page';
import get from 'lodash/get';

function News({ data, cookies }) {
  return <Page data={data} cookies={cookies} />;
}

News.getInitialProps = async function (ctx) {
  if (ctx.req) {
    const { url } = ctx.req;
    const data = await fetch(
      `${process.env.HOST}/api/news?${url.split('?')[1]}`
    ).then((r) => r.json());
    return {
      data,
      cookies: ctx.req.cookies,
    };
  } else {
    const p = get(ctx, 'query.p', 1);
    const data = await fetch(`/api/news?p=${p}`).then((r) => r.json());
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

export default News;
