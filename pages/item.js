import getQueryParameter from '../utils/getQueryParameter';
import Page from '../components/Page';
import Comments from '../components/Comments';

const Item = ({ data }) => {
  return (
    <Page>
      <Comments data={data} />
    </Page>
  );
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
    ctx.res.setHeader('Cache-Control', 'public, must-revalidate, max-age=600');
    return {
      data,
    };
  }
};

export default Item;
