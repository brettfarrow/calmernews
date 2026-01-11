import Head from 'next/head';
import Comment from './Comment';
import NavButtons from './NavButtons';
import { Comment as CommentType } from '../types/postTypes';

type CommentsProps = {
  data: {
    id: number;
    title: string;
    score: number;
    byline: string;
    age: string;
    commentCount: number;
    comments: CommentType[];
    link: string;
    postBody: string;
  };
};

const Comments: React.FC<CommentsProps> = ({ data }) => {
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

  let postBodySplit: string[] = [];
  if (postBody) {
    postBodySplit = postBody.split('\n');
  }

  const pageTitle = title ? `calmer news | ${title}` : 'calmer news';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <article className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl lg:text-2xl">
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
        <div className="meta-row pb-6 text-sm">
          {score > 0 && (
            <>
              <span className="score">{score} points</span>
              <span className="text-gray-400 dark:text-gray-500"> · </span>
            </>
          )}
          <span className="byline">
            posted by{' '}
            <a
              className="underline-link underline"
              href={`${HN_HOSTNAME}/user?id=${byline}`}
              aria-label={`View ${byline}'s profile on Hacker News`}
            >
              {byline}
            </a>{' '}
            {age}
          </span>
          <span className="text-gray-400 dark:text-gray-500"> · </span>
          <span>{commentCount} comments</span>
          <span className="text-gray-400 dark:text-gray-500"> · </span>
          <span>
            <a
              className="underline-link underline"
              href={`${HN_HOSTNAME}/item?id=${id}`}
              aria-label="View this post on Hacker News"
            >
              view on hn
            </a>
          </span>
        </div>
        <section aria-label="Comments">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </section>
        <NavButtons />
      </article>
    </>
  );
};

export default Comments;
