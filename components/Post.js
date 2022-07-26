export default function Post({
  post,
  index,
  showComments,
  showByline,
  showScore,
  experience,
}) {
  const HN_HOSTNAME = 'https://news.ycombinator.com';
  const REDDIT_HOSTNAME = 'https://old.reddit.com';

  const isSelfPost = (host) => {
    // hacker news self posts start with HN domain
    // subreddit self posts start with the prefix
    return host === HN_HOSTNAME || host.startsWith('self.');
  };

  const getLinkDomain = (host) => {
    if (experience === 'hackernews') {
      return `/from?site=${host}`;
    } else {
      return `/r/domain/${host}`;
    }
  };

  const getCommentURL = (subreddit, commentId) => {
    if (experience === 'hackernews') {
      return `${HN_HOSTNAME}/item?id=${post.id}`;
    } else {
      return `${REDDIT_HOSTNAME}/r/${subreddit}/comments/${commentId}/`;
    }
  };

  const getBylineURL = (user) => {
    if (experience === 'hackernews') {
      return `${HN_HOSTNAME}/user?id=${user}`;
    } else {
      return `${REDDIT_HOSTNAME}/user/${user}`;
    }
  };

  return (
    <li key={`item-${index}`} className={`text-gray-800 dark:text-gray-200`}>
      <a
        href={post.href}
        className={`text-indigo-700 dark:text-indigo-300 underline`}
      >
        {post.text}
      </a>{' '}
      {isSelfPost(post.host) ? (
        <span>({post.host})</span>
      ) : (
        <span>
          (
          <a
            href={getLinkDomain(post.host, experience)}
            className={`underline underline-link`}
          >
            {post.host}
          </a>
          )
        </span>
      )}
      <div className={`grid grid-cols-1 sm:grid-cols-2`}>
        {(showScore || showByline) && (
          <span>
            {showScore && (
              <span className={`score mr-3`}>
                {post.score} {post.score === 1 ? 'point' : 'points'}
              </span>
            )}
            {showByline && (
              <span className={`byline block sm:inline`}>
                posted {post.age} by{' '}
                <a
                  className={`underline underline-link`}
                  href={getBylineURL(post.user, experience)}
                >
                  {post.user}
                </a>
              </span>
            )}
          </span>
        )}
        <span>
          {showComments && (
            <span className={`comments`}>
              <a
                className={`underline underline-link`}
                href={getCommentURL(post.subreddit, post.id)}
              >
                {post.comments ? (
                  <>view {post.comments} comments</>
                ) : (
                  <>discuss</>
                )}
              </a>
            </span>
          )}
        </span>
      </div>
    </li>
  );
}
