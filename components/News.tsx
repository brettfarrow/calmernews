import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Posts from './Posts';
import ToggleButton from './ToggleButton';
import NavButtons from './NavButtons';

import { NewsData } from '../types/postTypes';

type NewsProps = {
  data: NewsData;
  cookies: Record<string, string | boolean>;
};

const getInitialFromCookies = (
  name: string,
  cookies: NewsProps['cookies'],
): boolean => cookies[name] === 'true' || cookies[name] === true;

const News: React.FC<NewsProps> = ({ data, cookies }) => {
  const p = data.page;
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
    const syncFromLocalStorage = (
      key: string,
      setter: (v: boolean) => void,
    ) => {
      try {
        const value = window.localStorage.getItem(key);
        if (value !== null) setter(value === 'true');
      } catch {
        // Cookies still work when browser storage is unavailable.
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
    document.cookie = `${name}=${!value}; Max-Age=31536000; Path=/; SameSite=Lax`;
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
        items={data.items}
        showComments={showComments}
        showByline={showByline}
        showScore={showScore}
        start={data.start}
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
