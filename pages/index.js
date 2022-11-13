import React from 'react';
import Page from '../components/Page';

function Index({ data, cookies }) {
  return <Page data={data} cookies={cookies} />;
}

Index.getInitialProps = async (ctx) => {
  if (ctx.req) {
    const { url } = ctx.req;
    const data = await fetch(
      `${process.env.HOST}/api?${url.split('?')[1]}`
    ).then((r) => r.json());
    return {
      data,
      cookies: ctx.req.cookies,
    };
  } else {
    const data = await fetch('/api').then((r) => r.json());
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

export default Index;
