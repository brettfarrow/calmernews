import get from 'lodash/get';

export default function Post({ post, index, cookies }) {
  const showComments = get(cookies, 'show_comments', false) === 'true';
  const showByline = get(cookies, 'show_byline', false) === 'true';
  const showScore = get(cookies, 'show_score', false) === 'true';

  return (
    <li key={`item-${index}`} className={`text-gray-800 dark:text-gray-100`}>
      <a href={post.href} className={`text-indigo-500 underline`}>
        {post.text}
      </a>
      &nbsp;
      {post.host && <span>({post.host})</span>}
      <div className={`grid grid-cols-2 gap-1`}>
        {showByline && (
          <span className={`byline`}>
            posted {post.age} by {post.user}
          </span>
        )}
        <span className={`grid grid-cols-2 gap-1`}>
          {showScore && (
            <span className={`score`}>
              {post.score} {post.score === 1 ? 'point' : 'points'}
            </span>
          )}
          {showComments && (
            <span className={`comments`}>
              {post.comments ? (
                <>view {post.comments} comments</>
              ) : (
                <>discuss</>
              )}
            </span>
          )}
        </span>
      </div>
    </li>
  );
}
