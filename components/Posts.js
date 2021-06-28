import Post from '../components/Post';

export default function Posts({
  items,
  start,
  showComments,
  showByline,
  showScore,
}) {
  return (
    <ol start={start}>
      {items.map((post, index) => (
        <Post
          post={post}
          key={index}
          index={index}
          showComments={showComments}
          showByline={showByline}
          showScore={showScore}
        />
      ))}
    </ol>
  );
}
