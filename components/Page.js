import React, { useEffect, useState } from 'react';
import Posts from './Posts';
import ToggleButton from './ToggleButton';
import NavButtons from './NavButtons';
import Link from 'next/link';
import { Prefetch } from '@layer0/react';
import Head from 'next/head';
import Script from 'next/script';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useRouter } from 'next/router';
import LoadingButton from './LoadingButton';
import { get } from 'lodash';

export default function News({ data, cookies }) {
  const p = get(data, 'page', 1);
  const { from, more, previous } = data;
  const router = useRouter();

  const [loading, setLoading] = useState({
    loading: false,
    button: false,
  });

  const [showComments, setShowComments] = useState(
    get(cookies, 'show_comments', false) === 'true'
  );
  const [showByline, setShowByline] = useState(
    get(cookies, 'show_byline', false) === 'true'
  );
  const [showScore, setShowScore] = useState(
    get(cookies, 'show_score', false) === 'true'
  );

  const toggleClick = (name, setter, value) => {
    document.cookie = `${name}=${!value}; Max-Age=2147483647`;
    setter(!value);
  };

  const handleRefresh = () => {
    setTimeout(() => router.reload(), 0);
  };

  const resetLoadingButton = () => {
    if (loading) {
      setTimeout(() => {
        setLoading({
          loading: false,
          button: false,
        });
      }, 1000);
    }
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', resetLoadingButton);
    return () => {
      router.events.off('routeChangeComplete', resetLoadingButton);
    };
  }, []);

  useEffect(() => {
    resetLoadingButton();
  }, [data]);

  const refreshingContent = (
    <LoadingButton customClasses={`animate-spin w-8 h-8 my-0 mx-auto`} />
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
              <Prefetch url="/api">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/">calmer news</a>
              </Prefetch>
            </Link>
          </h1>
          <Posts
            from={from}
            items={get(data, 'items', [])}
            showComments={showComments}
            showByline={showByline}
            showScore={showScore}
            start={get(data, 'start', 1)}
          />
          <NavButtons
            loading={loading}
            setLoading={setLoading}
            more={more}
            previous={previous}
            p={p}
            router={router}
          />
          <footer className={`flex justify-center pb-16`}>
            <ToggleButton
              name={'Byline'}
              value={showByline}
              onClick={() => {
                toggleClick('show_byline', setShowByline, showByline);
              }}
            />
            <ToggleButton
              name={'Comments'}
              value={showComments}
              onClick={() => {
                toggleClick('show_comments', setShowComments, showComments);
              }}
            />
            <ToggleButton
              name={'Score'}
              value={showScore}
              onClick={() => {
                toggleClick('show_score', setShowScore, showScore);
              }}
            />
          </footer>
        </div>
      </PullToRefresh>
      <Script
        src="/js/measure.js"
        data-domain="calmernews.com"
        afterInteractive
      />
    </>
  );
}
