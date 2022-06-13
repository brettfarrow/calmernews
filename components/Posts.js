import Post from '../components/Post';

export default function Posts({
  from,
  items,
  start,
  showComments,
  showByline,
  showScore,
  experience,
}) {
  return (
    <ol start={start} className={`${from ? 'list-disc' : 'list-decimal-zero'}`}>
      {items.map((post, index) => (
        <Post
          post={post}
          key={index}
          index={index}
          showComments={showComments}
          showByline={showByline}
          showScore={showScore}
          experience={experience}
        />
      ))}
    </ol>
  );
}
