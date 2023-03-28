import Head from 'next/head';
import React, { useState } from 'react';
import Posts from './Posts';
import ToggleButton from './ToggleButton';
import NavButtons from './NavButtons';

import { get } from 'lodash';
import getInitialValue from '../utils/getInitialValue';

export default function News({ data, cookies }) {
  const p = get(data, 'page', 1);
  const { from, more, previous, experience } = data;
  const localStorage = typeof window !== 'undefined' ? window.localStorage : {};
  const [showComments, setShowComments] = useState(
    getInitialValue('show_comments', cookies, localStorage, false) === 'true'
  );
  const [showByline, setShowByline] = useState(
    getInitialValue('show_byline', cookies, localStorage, false) === 'true'
  );
  const [showScore, setShowScore] = useState(
    getInitialValue('show_score', cookies, localStorage, false) === 'true'
  );

  const toggleClick = (name, setter, value) => {
    document.cookie = `${name}=${!value}; Max-Age=2147483647`;
    try {
      localStorage.setItem(name, !value);
    } catch (e) {
      console.error(e);
    }
    setter(!value);
  };
  return (
    <>
      <Head>
        <title>calmer news{p > 1 ? ` | page ${p}` : ''}</title>
      </Head>
      <Posts
        from={from}
        items={get(data, 'items', [])}
        showComments={showComments}
        showByline={showByline}
        showScore={showScore}
        start={get(data, 'start', 1)}
        experience={experience}
      >
        <NavButtons more={more} previous={previous} p={p} />
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
      </Posts>
    </>
  );
}
