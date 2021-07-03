import fetch from 'isomorphic-fetch';
import get from 'lodash/get';
import React, { useState } from 'react';
import Posts from '../components/Posts';
import ToggleButton from '../components/ToggleButton';
import Link from 'next/link';
import { Prefetch } from '@layer0/react';
import { Head } from 'next/document';

function Index({ data, cookies }) {
  const p = get(data, 'page', 1);
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
    document.cookie = `${name}=${!value}`;
    setter(!value);
  };

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
      <div className="bg-coolGray-100 dark:bg-coolGray-700">
        <h1
          className={`text-gray-800 dark:text-gray-200 flex justify-center p-4`}
        >
          <Link href="/">
            <Prefetch>
              <a href="/">calmer news</a>
            </Prefetch>
          </Link>
        </h1>
        <Posts
          items={get(data, 'items', [])}
          showComments={showComments}
          showByline={showByline}
          showScore={showScore}
          start={get(data, 'start', 1)}
        />
        <div className={`grid ${p > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {p > 1 && (
            <div className={`flex justify-center`}>
              <Link href={get(data, 'previous', '')}>
                <Prefetch>
                  <a href={get(data, 'previous', '')}>
                    <button
                      className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold`}
                    >
                      Previous
                    </button>
                  </a>
                </Prefetch>
              </Link>
            </div>
          )}
          <div className={`flex justify-center`}>
            <Link href={get(data, 'more', '')}>
              <Prefetch>
                <a href={get(data, 'more', '')}>
                  <button
                    className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold`}
                  >
                    More
                  </button>
                </a>
              </Prefetch>
            </Link>
          </div>
        </div>
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
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { url } = ctx.req;
  const data = await fetch(`${process.env.HOST}/api?${url.split('?')[1]}`).then(
    (r) => r.json()
  );
  return {
    props: {
      data,
      cookies: ctx.req.cookies,
    },
  };
}

export default Index;
