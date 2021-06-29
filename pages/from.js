import fromDomain from './index';

export async function getServerSideProps(ctx) {
  const { url } = ctx.req;
  const data = await fetch(
    `${process.env.HOST}/api/from?${url.split('?')[1]}`
  ).then((r) => r.json());
  return {
    props: {
      data,
      cookies: ctx.req.cookies,
    },
  };
}

export default fromDomain;
