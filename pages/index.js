import fetch from 'isomorphic-fetch';
import get from 'lodash/get';
import React, { useState } from 'react';
import Posts from '../components/Posts';
import ToggleButton from '../components/ToggleButton';
import Link from 'next/link';
import { Prefetch } from '@layer0/react';

function Index({ data, cookies }) {
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
      <div className={`grid`}>
        <Link href={get(data, 'more', '')}>
          <button
            className={`rounded flex content-center justify-self-center text-center bg-purple-700 w-24 h-12 mb-6 text-white font-bold py-3 px-7`}
          >
            <Prefetch>
              <a href={get(data, 'more', '')}>More</a>
            </Prefetch>
          </button>
        </Link>
      </div>
      <footer className={`flex justify-center pb-16`}>
        <ToggleButton
          name={'Comments'}
          value={showComments}
          onClick={() => {
            toggleClick('show_comments', setShowComments, showComments);
          }}
        />
        <ToggleButton
          name={'Byline'}
          value={showByline}
          onClick={() => {
            toggleClick('show_byline', setShowByline, showByline);
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
