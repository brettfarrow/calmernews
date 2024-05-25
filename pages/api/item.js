import * as cheerio from 'cheerio';
import endpoints from './endpoints';
import DOMPurify from 'isomorphic-dompurify';

const cleanContent = (content) => {
  if (!content) return;
  return DOMPurify.sanitize(
    content
      .trim()
      .replace(/<p>/g, '\n') // remove opening paragraph tags
      .replace(/<\/p>/g, '\n') // replace with newline character
      .replace(/\n\n/g, '\n') // remove duplicate line breaks
      .replace(/\n(\s+)\n/g, ''), // remove any extra line breaks at end of comment
  );
};

export default async function item(req, res) {
  const {
    query: { id },
  } = req;

  const data = await fetch(`${endpoints.COMMENTS}?id=${id}`).then((r) =>
    r.text(),
  );

  const $ = cheerio.load(data);
  const title = $('.title span.titleline').text();
  const link = $('.title span.titleline a').first().attr('href');
  const host = $('span.sitestr').text();
  const score = Number(
    $('.subtext span.subline span.score')
      .text()
      .replace(/[^0-9]+/g, ''),
  );
  const byline =
    $('.subtext a.hnuser').text() ||
    $('table.fatitem span.comhead a.hnuser').text();
  const age = $('.subtext span.age a').text();

  // first option is for Ask HN / similar posts, second is for comment chains
  const postBody =
    cleanContent($('div.toptext').html()) ||
    cleanContent($('table.fatitem tbody tr.athing div.comment').html());

  let comments = [];
  $('tr.comtr').each((i, comment) => {
    const commentId = $(comment).attr('id');
    const username = $(comment).find('.comhead > a.hnuser').text();
    const age = $(comment).find('.comhead > span.age').text();
    $(comment).find('div.reply').remove(); // remove comment reply link
    const rawComment =
      $(comment).find('.comment > .commtext').html() || '[flagged]';
    console.log('rawComment', rawComment);
    const testComment = $(comment).find('.commtext').html() || '[flagged]';
    console.log('testComment', testComment);
    const body = cleanContent(rawComment);
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
    postBody,
    commentCount: comments.length,
    comments,
  });
}
