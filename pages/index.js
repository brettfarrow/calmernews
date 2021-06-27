import fetch from 'isomorphic-fetch';
import Post from '../components/Post';

function Index({ data, cookies }) {
  return (
    <div>
      <h1>hnnc</h1>
      <ol>
        {data.items.map((post, index) => (
          <Post post={post} key={index} index={index} />
        ))}
      </ol>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const data = await fetch(`${process.env.HOST}/api`).then((r) => r.json());
  return {
    props: {
      data,
      cookies: ctx.req.cookies,
    },
  };
}

export default Index;
