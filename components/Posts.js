import Post from '../components/Post';

export default function Posts({ items, showComments, showByline, showScore }) {
  return (
    <ol>
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
