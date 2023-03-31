import Head from 'next/head';
import Comment from './Comment';
import NavButtons from './NavButtons';

const Comments = ({ data }) => {
  const HN_HOSTNAME = 'https://news.ycombinator.com';
  const {
    id,
    title,
    score,
    byline,
    age,
    commentCount,
    comments,
    link,
    postBody,
  } = data;

  let postBodySplit = '';
  if (postBody) {
    postBodySplit = postBody.split('\n');
  }

  return (
    <>
      <Head>
        <title>calmer news | {title}</title>
      </Head>
      <div className="max-w-4xl mx-auto p-4">
        <h2>
          <a
            href={link}
            className="text-indigo-700 dark:text-indigo-300 underline"
          >
            {title}
          </a>
        </h2>
        {postBodySplit && (
          <div className={title ? 'mt-2' : ''}>
            {postBodySplit.map((line, index) => (
              <span
                key={index}
                className={
                  postBodySplit.length !== index + 1
                    ? 'post-body block mb-4'
                    : 'post-body'
                }
                dangerouslySetInnerHTML={{ __html: line }}
              />
            ))}
          </div>
        )}
        <div className="subline pb-6 text-sm text-gray-800 dark:text-gray-200">
          {score > 0 && <span className="score">{score} points</span>}
          <span className="byline">
            posted by{' '}
            <a className="underline" href={`${HN_HOSTNAME}/user?id=${byline}`}>
              {byline}
            </a>{' '}
            {age}
          </span>
          <div className="sm:inline">
            <span>{commentCount} comments</span>
            <span>
              <a className="underline" href={`${HN_HOSTNAME}/item?id=${id}`}>
                view on hn
              </a>
            </span>
          </div>
        </div>
        <div>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
        <NavButtons />
      </div>
    </>
  );
};

export default Comments;
