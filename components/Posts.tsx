import Post from './Post';
import { PostsProps } from '../types/postTypes';

const Posts: React.FC<PostsProps> = ({
  from,
  items,
  start,
  showComments,
  showByline,
  showScore,
  children,
}) => {
  return (
    <>
      <ol
        start={start}
        className={`${
          from ? 'list-none' : 'list-decimal-zero'
        } !list-inside max-w-5xl mx-auto lg:text-lg`}
      >
        {items.map((post) => (
          <Post
            post={post}
            key={post.id}
            showComments={showComments}
            showByline={showByline}
            showScore={showScore}
          />
        ))}
      </ol>
      {children}
    </>
  );
};

export default Posts;
