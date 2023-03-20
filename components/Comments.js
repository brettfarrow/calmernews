import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PullToRefresh from 'react-simple-pull-to-refresh';
import LoadingButton from './LoadingButton';
import { useRouter } from 'next/router';

const HN_HOSTNAME = 'https://news.ycombinator.com';

const FormattedComment = ({ className, text }) => {
  const splitText = text.split('\n');
  return (
    <div className={className}>
      {splitText.map((line, index) => (
        <span
          key={index}
          className={splitText.length !== index + 1 ? 'block mb-5' : ''}
        >
          {line}
        </span>
      ))}
    </div>
  );
};

const Comment = ({ comment }) => {
  return (
    <div style={{ marginLeft: `${comment.level * 30}px` }} className="pb-4">
      <div className="text-gray-700 dark:text-gray-300 pb-2">
        <a
          className="text-indigo-600 dark:text-indigo-200 underline"
          href={`${HN_HOSTNAME}/user?id=${comment.username}`}
        >
          {comment.username}
        </a>{' '}
        (
        <a
          className="text-indigo-600 dark:text-indigo-200 underline"
          href={`/item?id=${comment.id}`}
        >
          {comment.age}
        </a>
        )
      </div>
      <FormattedComment
        className="text-gray-800 dark:text-gray-200 pb-4"
        text={comment.body}
      />
    </div>
  );
};

const CommentsList = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

const Comments = ({ data }) => {
  const { id, title, score, byline, age, commentCount, comments, link } = data;
  const router = useRouter();

  const [loading, setLoading] = useState({
    loading: false,
    button: false,
  });

  const handleRefresh = () => {
    setTimeout(() => router.reload(), 0);
  };

  const refreshingContent = (
    <LoadingButton customClasses={`animate-spin w-8 h-8 my-8 mx-auto`} />
  );

  return (
    <>
      <Head>
        <title>calmer news</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="A modified UI for Hacker News, starting with dark mode and no comments (by default). Not affiliated with Y Combinator or Hacker News in any way."
        />
      </Head>
      <PullToRefresh
        pullingContent={''}
        onRefresh={handleRefresh}
        refreshingContent={refreshingContent}
      >
        <div className="bg-coolGray-100 dark:bg-coolGray-700">
          <h1
            className={`text-gray-800 dark:text-gray-200 flex justify-center p-4`}
          >
            <Link href="/" passHref>
              calmer news
            </Link>
          </h1>
          <div className="max-w-4xl mx-auto">
            <h2>
              <a
                href={link}
                className="text-indigo-700 dark:text-indigo-300 underline"
              >
                {title}
              </a>
            </h2>
            <div className="subline pb-6 text-sm text-gray-800 dark:text-gray-200">
              <span>{score} points</span>
              <span>
                posted by{' '}
                <a
                  className="underline"
                  href={`${HN_HOSTNAME}/user?id=${byline}`}
                >
                  {byline}
                </a>
              </span>
              <span>{age}</span>
              <span>{commentCount} comments</span>
              <span>
                <a className="underline" href={`${HN_HOSTNAME}/item?id=${id}`}>
                  view on hn
                </a>
              </span>
            </div>
            <CommentsList comments={comments} />
            <div className={`flex justify-center`}>
              <button
                className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold transition duration-500 ease-in-out hover:bg-purple-800`}
                onClick={() => {
                  setLoading({
                    loading: true,
                    button: 'back',
                  });
                  router.back();
                }}
                disabled={loading.button === false ? false : true}
              >
                {loading.loading && loading.button === 'back' ? (
                  <LoadingButton
                    customClasses={`animate-spin w-8 h-8 mx-10 my-2 text-white`}
                  />
                ) : loading.button === 'previous' ? (
                  ''
                ) : (
                  'Back'
                )}
              </button>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </>
  );
};

export default Comments;
