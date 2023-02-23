import * as cheerio from 'cheerio';
import endpoints from './endpoints';

export default async function item(req, res) {
  const {
    query: { id },
  } = req;

  const data = await fetch(`${endpoints.COMMENTS}?id=${id}`).then((r) =>
    r.text()
  );

  const $ = cheerio.load(data);
  const title = $('.title span.titleline').text();
  const link = $('.title span.titleline a').first().attr('href');
  const host = $('span.sitestr').text();
  const score = Number(
    $('.subtext span.subline span.score')
      .text()
      .replace(/[^0-9]+/g, '')
  );
  const byline = $('.subtext a.hnuser').text();
  const age = $('.subtext span.age a').text();

  let comments = [];
  $('tr.comtr').each((i, comment) => {
    const commentId = $(comment).attr('id');
    const username = $(comment).find('.comhead > a.hnuser').text();
    const age = $(comment).find('.comhead > span.age').text();
    $(comment).find('div.reply').remove(); // remove comment reply link
    const body = $(comment).find('.comment > span.commtext').text().trim();
    const level = $(comment).find('td.ind').attr('indent');

    comments.push({
      position: i,
      id: commentId,
      username,
      age,
      body,
      level,
    });
  });

  res.json({
    id,
    title,
    host,
    link,
    score,
    byline,
    age,
    commentCount: comments.length,
    comments,
  });
}
