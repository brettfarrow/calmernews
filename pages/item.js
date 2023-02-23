import getQueryParameter from '../utils/getQueryParameter';
import Comments from '../components/Comments';

const Item = ({ data, cookies }) => {
  return <Comments data={data} cookies={cookies} />;
};

Item.getInitialProps = async function (ctx) {
  if (ctx.req) {
    const { url } = ctx.req;
    const id = getQueryParameter(`${process.env.HOST}${url}`, 'id');
    const data = await fetch(`${process.env.HOST}/api/item?id=${id}`).then(
      (r) => r.json()
    );
    return {
      data,
      cookies: ctx.req.cookies,
    };
  } else {
    const id = get(ctx, 'query.id', 1);
    const data = await fetch(`/api/item?id=${id}`).then((r) => r.json());
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

export default Item;
