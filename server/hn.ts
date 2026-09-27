import * as cheerio from 'cheerio';
import endpoints from './endpoints';
import hnFetch from '../utils/hnFetch';
import { cleanContent, safeLink } from './content';
import { HttpError } from './errors';
import { newsParams, positiveInteger, type Query } from './query';
import type { Comment, NewsData, ItemData } from '../types/postTypes';

export async function loadItem(query: Query): Promise<ItemData> {
  const id = positiveInteger(query, 'id');
  if (!id) throw new HttpError(400, 'Missing id parameter.');
  const data = await (
    await hnFetch(`${endpoints.COMMENTS}?${new URLSearchParams({ id })}`)
  ).text();
  const $ = cheerio.load(data);
  const title = $('.title span.titleline').text();
  const link = safeLink($('.title span.titleline a').first().attr('href'));
  if (!$('table.fatitem').length) throw new HttpError(404, 'Item not found.');
  const host = $('span.sitestr').text();
  const score = Number(
    $('.subtext span.subline span.score')
      .text()
      .replace(/[^0-9]+/g, ''),
  );
  const byline =
    $('.subtext a.hnuser').text() ||
    $('table.fatitem span.comhead a.hnuser').text();
  const age =
    $('.subtext span.age a').text() ||
    $('table.fatitem span.comhead span.age').text();

  // first option is for Ask HN / similar posts, second is for comment chains
  const postBody =
    cleanContent($('div.toptext').html()) ||
    cleanContent($('table.fatitem tbody tr.athing .commtext').html());

  const comments: Comment[] = [];
  $('tr.comtr').each((i, comment) => {
    const commentId = $(comment).attr('id') || '';
    const username = $(comment).find('.comhead > a.hnuser').text();
    const age = $(comment).find('.comhead > span.age').text();
    $(comment).find('div.reply').remove(); // remove comment reply link
    const rawComment =
      $(comment).find('.comment > .commtext').html() || '[flagged]';
    const body = cleanContent(rawComment);
    const level = Math.max(
      0,
      Number($(comment).find('td.ind').attr('indent')) || 0,
    );

    comments.push({
      position: i,
      id: commentId,
      username,
      age,
      body,
      level,
    });
  });

  return {
    id,
    title,
    host,
    link,
    score,
    byline,
    age,
    postBody,
    commentCount: comments.length,
    comments,
  };
}

export async function loadNews(
  query: Query,
  requireSite = false,
): Promise<NewsData> {
  const params = newsParams(query, requireSite);
  const from = params.has('site');
  const endpoint = from ? endpoints.FROM : endpoints.NEWS;
  const data = await (await hnFetch(`${endpoint}?${params}`)).text();
  const $ = cheerio.load(data);
  if (!$('#hnmain').length)
    throw new HttpError(502, 'Invalid response from Hacker News.');

  const items = $('tr.athing')
    .toArray()
    .flatMap((story) => {
      const row = $(story);
      const link = row.find('span.titleline a').first();
      const id = Number(row.attr('id'));
      if (!link.length || !Number.isSafeInteger(id) || id <= 0) return [];
      // Metadata belongs to the next row, even when a job has no score or author.
      const info = row.next().find('td.subtext');
      const lastLink = info.find('a[href^="item"]').last().text();
      return [
        {
          id,
          href: safeLink(link.attr('href')),
          host: row.find('span.sitestr').text() || endpoints.HOME,
          text: link.text(),
          age: info.find('span.age').text(),
          score: Number(
            info
              .find('span.score')
              .text()
              .replace(/[^0-9]+/g, ''),
          ),
          comments: /comments?|discuss/.test(lastLink)
            ? Number(lastLink.replace(/[^0-9]+/g, ''))
            : 0,
          user: info.find('a.hnuser').text(),
        },
      ];
    });

  let more: string | false = false;
  const moreLink = $('a.morelink').attr('href');
  if (moreLink) {
    const url = new URL(moreLink, endpoint);
    if (
      url.origin === endpoints.HOME &&
      url.pathname === (from ? '/from' : '/news')
    ) {
      more = `${url.pathname}${url.search}`;
    }
  }
  // Domain feeds paginate with a forward-only cursor, not a page number.
  const page = from ? 1 : Number(params.get('p') || 1);
  // A next cursor cannot be used to navigate backwards. Rebuild from the page
  // number and domain so the last page works without relying on a more link.
  const previousParams = new URLSearchParams();
  if (from) previousParams.set('site', params.get('site')!);
  if (page > 2) previousParams.set('p', String(page - 1));
  const previous = from
    ? `/from?${previousParams}`
    : page > 2
      ? `/news?${previousParams}`
      : '/';
  return { items, more, previous, page, start: (page - 1) * 30 + 1, from };
}
