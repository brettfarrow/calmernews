export default function Post({
  post,
  index,
  showComments,
  showByline,
  showScore,
}) {
  const HN_HOSTNAME = 'https://news.ycombinator.com';

  const isSelfPost = (host) => {
    return host === HN_HOSTNAME || host.startsWith('self.');
  };

  const getLinkDomain = (host) => {
    return `/from?site=${host}`;
  };

  const getCommentURL = (commentId) => {
    return `/item?id=${commentId}`;
  };

  const getBylineURL = (user) => {
    return `${HN_HOSTNAME}/user?id=${user}`;
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
          <a
            href={getLinkDomain(post.host)}
            className={`underline underline-link underline-host`}
          >
            ({post.host})
          </a>
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
                  href={getBylineURL(post.user)}
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
                href={getCommentURL(post.id)}
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
