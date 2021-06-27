import fetch from 'isomorphic-fetch';
import Post from '../components/Post';

function Index({ data }) {
  return (
    <div>
      <h1>hnnc</h1>
      <ol>
        {data.items.map((post, index) => (
          <Post post={post} index={index} />
        ))}
      </ol>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await fetch(`${process.env.HOST}/api`).then((r) => r.json());
  return {
    props: { data },
  };
}

export default Index;
