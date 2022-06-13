const SITE_HOSTNAME = 'https://news.ycombinator.com';
const REDDIT_HOSTNAME = 'https://old.reddit.com';
const endpoints = {
  HOME: SITE_HOSTNAME,
  NEWS: `${SITE_HOSTNAME}/news`,
  NEWEST: `${SITE_HOSTNAME}/newest`,
  ASK: `${SITE_HOSTNAME}/ask`,
  SHOW: `${SITE_HOSTNAME}/show`,
  FROM: `${SITE_HOSTNAME}/from`,
  USER: `${SITE_HOSTNAME}/user`,
  COMMENTS: `${SITE_HOSTNAME}/item`,
  REDDIT: {
    HOME: REDDIT_HOSTNAME,
    SUBREDDIT_PATH: `${REDDIT_HOSTNAME}/r/`,
  },
};

export default endpoints;
