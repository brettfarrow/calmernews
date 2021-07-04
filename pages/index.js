import fetch from 'isomorphic-fetch';
import get from 'lodash/get';
import React, { useState } from 'react';
import Posts from '../components/Posts';
import ToggleButton from '../components/ToggleButton';
import Link from 'next/link';
import { Prefetch } from '@layer0/react';
import Head from 'next/head';
import Script from 'next/script';

function Index({ data, cookies }) {
  const p = get(data, 'page', 1);
  const { from, more, previous } = data;
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
            <Prefetch url="/api">
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
        <div className={`grid ${p > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {p > 1 && (
            <div className={`flex justify-center`}>
              <button
                className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold`}
              >
                <Link href={previous}>
                  <Prefetch url={`/api${previous}`}>
                    <a className={`w-28 h-12 block leading-12`} href={previous}>
                      Previous
                    </a>
                  </Prefetch>
                </Link>
              </button>
            </div>
          )}
          {more && (
            <div className={`flex justify-center`}>
              <button
                className={`rounded text-center bg-purple-700 w-28 h-12 m-6 text-white font-bold`}
              >
                <Link href={more}>
                  <Prefetch url={`/api${more}`}>
                    <a className={`w-28 h-12 block leading-12`} href={more}>
                      More
                    </a>
                  </Prefetch>
                </Link>
              </button>
            </div>
          )}
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
      <Script
        src="https://plausible.io/js/plausible.js"
        data-domain="calmernews.com"
        afterInteractive
      />
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
