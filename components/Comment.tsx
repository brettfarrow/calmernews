import { Comment as CommentType } from '../types/postTypes';

const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => {
  const HN_HOSTNAME = 'https://news.ycombinator.com';
  return (
    <div style={{ marginLeft: `${comment.level * 24}px` }} className="pb-4">
      <div className="text-gray-600 dark:text-gray-100 pb-2 text-sm">
        <a
          className="text-indigo-700 dark:text-indigo-300 hover:underline decoration-indigo-700 dark:decoration-indigo-300 underline-offset-[3px]"
          href={`${HN_HOSTNAME}/user?id=${encodeURIComponent(comment.username)}`}
          aria-label={`View ${comment.username}'s profile on Hacker News`}
        >
          {comment.username}
        </a>{' '}
        (
        <a
          className="underline hover:text-gray-800 hover:dark:text-white transition-colors duration-150"
          href={`/item?id=${comment.id}`}
          aria-label={`Permalink to this comment from ${comment.age}`}
        >
          {comment.age}
        </a>
        )
      </div>
      <div
        className="comment text-gray-800 dark:text-gray-200 pb-3 leading-relaxed lg:text-lg"
        dangerouslySetInnerHTML={{ __html: comment.body }}
      />
    </div>
  );
};

export default Comment;
