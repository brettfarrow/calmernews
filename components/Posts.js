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
        } !list-inside max-w-5xl mx-auto lg:text-lg`}
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
