import cheerio from 'cheerio';
import endpoints from './endpoints';
import fetch from 'isomorphic-fetch';
import qs from 'qs';

export default async function index(req, res) {
  const {
    query: { n, p, next },
  } = req;

  const params = {};
  if (n) params.n = n;
  if (p) params.p = p;
  if (next) params.next = next;
  const url = `${endpoints.NEWS}?${qs.stringify(params)}`;
  const data = await fetch(url).then((r) => r.text());

  const $ = cheerio.load(data);
  const stories = $('tr.athing').toArray();
  const more = $('a.morelink').attr('href');
  const storyInfo = $('table.itemlist tr')
    .not('.spacer')
    .not('.athing')
    .toArray()
    .slice(0, 30);

  const parsed = stories.map((story, index) => {
    const id = Number($(story).attr('id') || '');

    const link = $(story).find('a.storylink');
    const href = link.attr('href') || '';
    const text = link.text() || '';

    const host = $(story).find('span.sitestr').text() || '';
    const age = $(storyInfo[index]).find('span.age').text() || '';
    const score = Number(
      ($(storyInfo[index]).find('span.score').text() || '').replace(
        /[^0-9]+/g,
        ''
      )
    );
    const comments = Number(
      (
        $(storyInfo[index]).find('td.subtext').children().last().text() || ''
      ).replace(/[^0-9]+/g, '')
    );
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
    start: pageNumber > 1 ? (pageNumber - 1) * 30 + 1 : 1,
  });
}
