const SITE_HOSTNAME = 'https://news.ycombinator.com';

const endpoints = {
  HOME: SITE_HOSTNAME,
  NEWS: `${SITE_HOSTNAME}/news`,
  FROM: `${SITE_HOSTNAME}/from`,
  COMMENTS: `${SITE_HOSTNAME}/item`,
};

export default endpoints;
