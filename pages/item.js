import getQueryParameter from '../utils/getQueryParameter';

const Comment = ({ comment }) => {
  return (
    <div style={{ marginLeft: `${comment.level * 20}px` }}>
      <p>Username: {comment.username}</p>
      <p>Age: {comment.age}</p>
      <p>Body: {comment.body}</p>
    </div>
  );
};

const Comments = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

const Item = ({ data, cookies }) => {
  const { id, title, points, byline, age, commentCount, comments } = data;
  return (
    <div>
      <h1>{title}</h1>
      <p>ID: {id}</p>
      <p>Points: {points}</p>
      <p>Byline: {byline}</p>
      <p>Age: {age}</p>
      <p>Comment Count: {commentCount}</p>
      <Comments comments={comments} />
    </div>
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
