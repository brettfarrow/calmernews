import Post from '../components/Post';

export default function Posts({
  from,
  items,
  start,
  showComments,
  showByline,
  showScore,
  children,
}) {
  return (
    <>
      <ol
        start={start}
        className={`${
          from ? 'list-disc' : 'list-decimal-zero'
        } max-w-4xl mx-auto`}
      >
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
      {children}
    </>
  );
}
