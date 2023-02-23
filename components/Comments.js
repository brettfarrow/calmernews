const Comment = ({ comment }) => {
  return (
    <div style={{ marginLeft: `${comment.level * 20}px` }}>
      <p>Username: {comment.username}</p>
      <p>Age: {comment.age}</p>
      <p>Body: {comment.body}</p>
    </div>
  );
};

const CommentsList = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

const Comments = ({ data, cookies }) => {
  const { id, title, points, byline, age, commentCount, comments } = data;
  return (
    <div>
      <h1>{title}</h1>
      <p>ID: {id}</p>
      <p>Points: {points}</p>
      <p>Byline: {byline}</p>
      <p>Age: {age}</p>
      <p>Comment Count: {commentCount}</p>
      <CommentsList comments={comments} />
    </div>
  );
};

export default Comments;
