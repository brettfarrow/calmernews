import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Posts from './Posts';
import ToggleButton from './ToggleButton';
import NavButtons from './NavButtons';

import { get } from 'lodash';
import { PostItem } from '../types/postTypes';

// Get initial value from cookies only (for SSR consistency)
const getInitialFromCookies = (name: string, cookies: object): boolean => {
  const value = get(cookies, name);
  return value === 'true' || value === true;
};

type NewsProps = {
  data: {
    page: number;
    items: PostItem[];
    more?: string;
    previous?: string;
    from?: boolean;
  };
  cookies: object;
};

const News: React.FC<NewsProps> = ({ data, cookies }) => {
  const p = get(data, 'page', 1);
  const { from, more, previous } = data;
  const title = `calmer news${p > 1 ? ` | page ${p}` : ''}`;

  // Initialize from cookies only to match server render
  const [showComments, setShowComments] = useState(
    getInitialFromCookies('show_comments', cookies),
  );
  const [showByline, setShowByline] = useState(
    getInitialFromCookies('show_byline', cookies),
  );
  const [showScore, setShowScore] = useState(
    getInitialFromCookies('show_score', cookies),
  );

  // Sync from localStorage after mount (client-side only)
  useEffect(() => {
    const syncFromLocalStorage = (key: string, setter: (v: boolean) => void) => {
      const value = window.localStorage.getItem(key);
      if (value !== null) {
        setter(value === 'true');
      }
    };
    syncFromLocalStorage('show_comments', setShowComments);
    syncFromLocalStorage('show_byline', setShowByline);
    syncFromLocalStorage('show_score', setShowScore);
  }, []);

  const toggleClick = (
    name: string,
    setter: (value: boolean) => void,
    value: boolean,
  ) => {
    document.cookie = `${name}=${!value}; Max-Age=2147483647`;
    try {
      window.localStorage.setItem(name, String(!value));
    } catch (e) {
      console.error(e);
    }
    setter(!value);
  };
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Posts
        from={from}
        items={get(data, 'items', [])}
        showComments={showComments}
        showByline={showByline}
        showScore={showScore}
        start={get(data, 'start', 1)}
      >
        <NavButtons more={more} previous={previous} p={p} />
        <footer className={`flex justify-center pb-16`}>
          <ToggleButton
            name={'byline'}
            value={showByline}
            onClick={() => {
              toggleClick('show_byline', setShowByline, showByline);
            }}
          />
          <ToggleButton
            name={'comments'}
            value={showComments}
            onClick={() => {
              toggleClick('show_comments', setShowComments, showComments);
            }}
          />
          <ToggleButton
            name={'score'}
            value={showScore}
            onClick={() => {
              toggleClick('show_score', setShowScore, showScore);
            }}
          />
        </footer>
      </Posts>
    </>
  );
};

export default News;
