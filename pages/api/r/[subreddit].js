import * as cheerio from 'cheerio';
import endpoints from '../endpoints';
import fetch from 'isomorphic-fetch';

function getFetchPath(url) {
  // Remove the api prefix for client side navigation
  let path = url.replace('/api', '');

  // show the home page instead of the subreddit list page
  if (path === '/r/') {
    path = '';
  }

  // for list of posts by domain
  if (path.includes('/domain/')) {
    path = path.replace('/r', '');
  }

  return path;
}

export default async function subreddit(req, res) {
  const {
    url,
    query: { count },
  } = req;
  const path = getFetchPath(url);
  const isDomainRequest = path.includes('/domain/');
  const ID_PREFIX = 't3_'; // the unused prefix for reddit comment URLs

  const fetchUrl = `${endpoints.REDDIT.HOME}${path}`;
  const data = await fetch(fetchUrl).then((r) => r.text());

  const $ = cheerio.load(data);
  const things = $('div.thing').not('.promoted').not('.stickied').toArray();

  const nextButtonHref = $('span.next-button a').attr('href') || '';
  const prevButtonHref = $('span.prev-button a').attr('href') || '';
  const more = `${isDomainRequest && '/r'}${nextButtonHref.replace(
    endpoints.REDDIT.HOME,
    ''
  )}`;
  const previous = `${
    prevButtonHref && isDomainRequest && '/r'
  }${prevButtonHref.replace(endpoints.REDDIT.HOME, '')}`;

  const items = things.map((post) => {
    const id = ($(post).attr('data-fullname') || '').replace(ID_PREFIX, '');

    const link = $(post).find('a.title.may-blank');
    const host = $(post).find('p.title span.domain a').text();
    const href = link.attr('href');
    const text = link.text();

    const age = $(post).find('p.tagline time.live-timestamp').text() || '';
    const score = Number($(post).attr('data-score'));
    const comments = Number($(post).attr('data-comments-count'));
    const user = $(post).attr('data-author');
    const subreddit = $(post).attr('data-subreddit');

    return {
      id,
      age,
      comments,
      host,
      href,
      score,
      subreddit,
      text,
      user,
    };
  });

  res.json({
    items,
    more,
    previous,
    start: Number(count || 0) + 1,
    experience: 'reddit',
  });
}
