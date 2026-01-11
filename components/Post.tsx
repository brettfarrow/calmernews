import { PostItem } from '../types/postTypes';

type PostProps = {
  post: PostItem,
  index: number,
  showComments: boolean,
  showByline: boolean,
  showScore: boolean,
};

const Post: React.FC<PostProps> = ({
  post,
  index,
  showComments,
  showByline,
  showScore,
}) => {
  const HN_HOSTNAME = 'https://news.ycombinator.com';

  const isSelfPost = (host: string) => {
    return host === HN_HOSTNAME || host.startsWith('self.');
  };

  const getLinkDomain = (host: string) => {
    return `/from?site=${host}`;
  };

  const getCommentURL = (commentId: number) => {
    return `/item?id=${commentId}`;
  };

  const getBylineURL = (user: string) => {
    return `${HN_HOSTNAME}/user?id=${user}`;
  };

  return (
    <li
      key={`item-${index}`}
      className={`text-gray-800 dark:text-gray-200 px-4 md:px-12 py-4 md:py-3`}
    >
      <a
        href={post.href}
        className={`text-indigo-700 dark:text-indigo-300 underline`}
      >
        {post.text}
      </a>{' '}
      {isSelfPost(post.host) ? (
        <span className="text-gray-500 dark:text-gray-400 text-sm">({post.host})</span>
      ) : (
        <span className="text-sm">
          <a
            href={getLinkDomain(post.host)}
            className={`underline underline-link underline-host`}
            aria-label={`More posts from ${post.host}`}
          >
            ({post.host})
          </a>
        </span>
      )}
      {(showScore || showByline || showComments) && (
        <div className={`meta-row grid grid-cols-1 sm:grid-cols-2 gap-x-4`}>
          {(showScore || showByline) && (
            <span>
              {showScore && (
                <span className={`score`}>
                  {post.score} {post.score === 1 ? 'point' : 'points'}
                </span>
              )}
              {showScore && showByline && <span className="text-gray-400 dark:text-gray-500"> · </span>}
              {showByline && (
                <span className={`byline`}>
                  {post.age} by{' '}
                  <a
                    className={`underline underline-link`}
                    href={getBylineURL(post.user)}
                    aria-label={`View ${post.user}'s profile on Hacker News`}
                  >
                    {post.user}
                  </a>
                </span>
              )}
            </span>
          )}
          {showComments && (
            <span className={`comments`}>
              <a
                className={`underline underline-link`}
                href={getCommentURL(post.id)}
              >
                {post.comments ? (
                  <>{post.comments} comments</>
                ) : (
                  <>discuss</>
                )}
              </a>
            </span>
          )}
        </div>
      )}
    </li>
  );
}

export default Post;
