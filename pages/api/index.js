import * as cheerio from 'cheerio';
import endpoints from './endpoints';
import qs from 'qs';
import fetchWithTimeout from '../../utils/fetchWithTimeout';

export default async function index(req, res) {
  const {
    query: { n, p, next, site },
  } = req;

  const params = {};
  if (n) params.n = n;
  if (p) params.p = Math.round(p) || 0; // to better match HN parsing
  if (next) params.next = next;
  if (site) params.site = site;
  const url = site
    ? `${endpoints.FROM}?${qs.stringify(params)}`
    : `${endpoints.NEWS}?${qs.stringify(params)}`;
  const data = await fetchWithTimeout(url).then((r) => r.text());

  const $ = cheerio.load(data);
  const stories = $('tr.athing').toArray();
  const originalUrl = req?.url?.replace('/api', '');
  const path = originalUrl?.split('/')[1]?.split('?')[0] || '';
  const moreLink = $('a.morelink').attr('href');
  const more = moreLink
    ? `/${path.includes('from') ? '' : 'news'}${$('a.morelink').attr('href')}`
    : false;
  const storyInfo = $('table#hnmain tr td.subtext')
    .not('.spacer')
    .not('.athing')
    .toArray()
    .slice(0, 30);

  const parsed = stories.map((story, index) => {
    const id = Number($(story).attr('id') || '');

    const link = $(story).find('span.titleline a').first() || '';
    const host = $(story).find('span.sitestr').text() || endpoints.HOME;
    const href = host ? link.attr('href') : `${host}/${link.attr('href')}`;
    const text = link.text() || '';

    const age = $(storyInfo[index]).find('span.age').text() || '';
    const score = Number(
      ($(storyInfo[index]).find('span.score').text() || '').replace(
        /[^0-9]+/g,
        ''
      )
    );
    const lastLink =
      $(
        $(storyInfo[index]).find('span.subline a[href^="item"]').last()
      ).text() || '';
    const comments =
      lastLink.includes('comments') || lastLink.includes('discuss')
        ? Number(lastLink.replace(/[^0-9]+/g, ''))
        : 0;
    const user = $(storyInfo[index]).find('a.hnuser').text() || '';

    return {
      id,
      age,
      comments,
      host,
      href,
      score,
      text,
      user,
    };
  });

  const pageNumber = Number(p);

  res.json({
    items: parsed,
    more,
    previous:
      pageNumber > 1
        ? more.replace(`p=${pageNumber + 1}`, `p=${pageNumber - 1}`)
        : '/',
    page: pageNumber || 1,
    start: pageNumber > 1 ? (pageNumber - 1) * 30 + 1 : 1,
  });
}
