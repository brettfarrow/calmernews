import getQueryParameter from '../utils/getQueryParameter';
import Comments from '../components/Comments';

const Item = ({ data }) => {
  return <Comments data={data} />;
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
    };
  } else {
    const id = get(ctx, 'query.id', 1);
    const data = await fetch(`/api/item?id=${id}`).then((r) => r.json());
    return {
      data,
    };
  }
};

export default Item;
