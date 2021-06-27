import fetch from 'isomorphic-fetch';
import get from 'lodash/get';
import React, { useState } from 'react';
import Posts from '../components/Posts';

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

  return (
    <div class="bg-coolGray-100 dark:bg-coolGray-700">
      <h1 className={`text-gray-800 dark:text-gray-200`}>calmer news</h1>
      <Posts
        items={data.items}
        showComments={showComments}
        showByline={showByline}
        showScore={showScore}
      />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const data = await fetch(`${process.env.HOST}/api`).then((r) => r.json());
  return {
    props: {
      data,
      cookies: ctx.req.cookies,
    },
  };
}

export default Index;
