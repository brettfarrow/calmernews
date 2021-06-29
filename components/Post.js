export default function Post({
  post,
  index,
  showComments,
  showByline,
  showScore,
}) {
  const ORIGIN_SITE_HOSTNAME = 'https://news.ycombinator.com';

  return (
    <li key={`item-${index}`} className={`text-gray-800 dark:text-gray-200`}>
      <a
        href={post.href}
        className={`text-indigo-700 dark:text-indigo-300 underline`}
      >
        {post.text}
      </a>{' '}
      {post.host === ORIGIN_SITE_HOSTNAME ? (
        <span>({post.host})</span>
      ) : (
        <span>
          (
          <a
            href={`/from?site=${post.host}`}
            className={`underline underline-white`}
          >
            {post.host}
          </a>
          )
        </span>
      )}
      <div className={`grid grid-cols-2`}>
        <span>
          {showScore && (
            <span className={`score mr-3`}>
              {post.score} {post.score === 1 ? 'point' : 'points'}
            </span>
          )}
          {showByline && (
            <span className={`byline`}>
              posted {post.age} by{' '}
              <a
                className={`underline underline-white`}
                href={`${ORIGIN_SITE_HOSTNAME}/user?id=${post.user}`}
              >
                {post.user}
              </a>
            </span>
          )}
        </span>
        <span>
          {showComments && (
            <span className={`comments`}>
              <a
                className={`underline underline-white`}
                href={`${ORIGIN_SITE_HOSTNAME}/item?id=${post.id}`}
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
