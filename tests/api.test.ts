import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';

const HN = 'https://news.ycombinator.com';

// Mirrors the parsing logic in pages/api/index.js
async function fetchNewsFeed(path = '/news') {
  const res = await fetch(`${HN}${path}`);
  expect(res.ok).toBe(true);
  const html = await res.text();
  const $ = cheerio.load(html);

  const stories = $('tr.athing').toArray();
  const storyInfo = $('table#hnmain tr td.subtext')
    .not('.spacer')
    .not('.athing')
    .toArray()
    .slice(0, 30);

  const moreLink = $('a.morelink').attr('href');

  const parsed = stories.map((story, index) => {
    const id = Number($(story).attr('id') || '');
    const link = $(story).find('span.titleline a').first();
    const host = $(story).find('span.sitestr').text() || HN;
    const href = host ? link.attr('href') : `${host}/${link.attr('href')}`;
    const text = link.text() || '';

    const age = $(storyInfo[index]).find('span.age').text() || '';
    const score = Number(
      ($(storyInfo[index]).find('span.score').text() || '').replace(
        /[^0-9]+/g,
        '',
      ),
    );
    const lastLink =
      $(
        $(storyInfo[index]).find('span.subline a[href^="item"]').last(),
      ).text() || '';
    const comments =
      lastLink.includes('comments') || lastLink.includes('discuss')
        ? Number(lastLink.replace(/[^0-9]+/g, ''))
        : 0;
    const user = $(storyInfo[index]).find('a.hnuser').text() || '';

    return { id, age, comments, host, href, score, text, user };
  });

  return { items: parsed, moreLink };
}

// Mirrors the parsing logic in pages/api/item.js
async function fetchItem(id: string) {
  const res = await fetch(`${HN}/item?id=${id}`);
  expect(res.ok).toBe(true);
  const html = await res.text();
  const $ = cheerio.load(html);

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
  const postBody = $('div.toptext').html() || '';

  const comments: any[] = [];
  $('tr.comtr').each((i, comment) => {
    const commentId = $(comment).attr('id');
    const username = $(comment).find('.comhead > a.hnuser').text();
    const commentAge = $(comment).find('.comhead > span.age').text();
    $(comment).find('div.reply').remove();
    const rawComment =
      $(comment).find('.comment > .commtext').html() || '[flagged]';
    const level = $(comment).find('td.ind').attr('indent');

    comments.push({
      position: i,
      id: commentId,
      username,
      age: commentAge,
      body: rawComment,
      level,
    });
  });

  return { id, title, host, link, score, byline, age, postBody, commentCount: comments.length, comments };
}

describe('HN News Feed (/api/news)', () => {
  it('should return stories from the front page', async () => {
    const { items } = await fetchNewsFeed();

    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(30);
  });

  it('each story should have a valid numeric id', async () => {
    const { items } = await fetchNewsFeed();

    for (const item of items) {
      expect(item.id).toBeTypeOf('number');
      expect(item.id).toBeGreaterThan(0);
      expect(Number.isInteger(item.id)).toBe(true);
    }
  });

  it('each story should have a non-empty title', async () => {
    const { items } = await fetchNewsFeed();

    for (const item of items) {
      expect(item.text).toBeTypeOf('string');
      expect(item.text.length).toBeGreaterThan(0);
    }
  });

  it('each story should have a valid href', async () => {
    const { items } = await fetchNewsFeed();

    for (const item of items) {
      expect(item.href).toBeTypeOf('string');
      expect(item.href.length).toBeGreaterThan(0);
    }
  });

  it('each story should have an age string', async () => {
    const { items } = await fetchNewsFeed();

    for (const item of items) {
      expect(item.age).toBeTypeOf('string');
      // Age should match patterns like "2 hours ago", "1 day ago", etc.
      expect(item.age).toMatch(
        /\d+\s+(second|minute|hour|day|month|year)s?\s+ago/,
      );
    }
  });

  it('each story should have a non-negative numeric score', async () => {
    const { items } = await fetchNewsFeed();

    for (const item of items) {
      expect(item.score).toBeTypeOf('number');
      expect(item.score).toBeGreaterThanOrEqual(0);
    }
  });

  it('each story should have a non-negative comment count', async () => {
    const { items } = await fetchNewsFeed();

    for (const item of items) {
      expect(item.comments).toBeTypeOf('number');
      expect(item.comments).toBeGreaterThanOrEqual(0);
    }
  });

  it('most stories should have a user', async () => {
    const { items } = await fetchNewsFeed();

    // Job posts don't have users, but most stories should
    const withUser = items.filter((item) => item.user.length > 0);
    expect(withUser.length).toBeGreaterThan(items.length * 0.8);
  });

  it('should have a more link for pagination', async () => {
    const { moreLink } = await fetchNewsFeed();

    expect(moreLink).toBeTypeOf('string');
    expect(moreLink).toContain('p=');
  });

  it('should return stories from page 2', async () => {
    const { items } = await fetchNewsFeed('/news?p=2');

    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(30);

    // Page 2 stories should have different IDs than page 1
    const page1 = await fetchNewsFeed();
    const page1Ids = new Set(page1.items.map((i) => i.id));
    const overlap = items.filter((i) => page1Ids.has(i.id));
    expect(overlap.length).toBeLessThan(items.length);
  });
});

describe('HN From/Domain Filter (/api/from)', () => {
  it('should return stories filtered by domain', async () => {
    const { items } = await fetchNewsFeed('/from?site=github.com');

    expect(items.length).toBeGreaterThan(0);

    for (const item of items) {
      expect(item.id).toBeTypeOf('number');
      expect(item.id).toBeGreaterThan(0);
      expect(item.text.length).toBeGreaterThan(0);
    }
  });

  it('domain-filtered stories should reference the correct host', async () => {
    const { items } = await fetchNewsFeed('/from?site=github.com');

    for (const item of items) {
      expect(item.host.toLowerCase()).toContain('github.com');
    }
  });
});

describe('HN Item/Comments (/api/item)', () => {
  // Use a known high-traffic story that's likely to stay around
  // We'll fetch the front page first and grab a real ID
  let storyId: string;

  it('should fetch a real story from the front page', async () => {
    const { items } = await fetchNewsFeed();
    // Pick a story that has comments
    const withComments = items.find((item) => item.comments > 0);
    expect(withComments).toBeDefined();
    storyId = String(withComments!.id);
  });

  it('should return valid story metadata', async () => {
    const item = await fetchItem(storyId);

    expect(item.id).toBe(storyId);
    expect(item.title).toBeTypeOf('string');
    expect(item.title.length).toBeGreaterThan(0);

    expect(item.score).toBeTypeOf('number');
    expect(item.score).toBeGreaterThanOrEqual(0);

    expect(item.byline).toBeTypeOf('string');
    expect(item.byline.length).toBeGreaterThan(0);

    expect(item.age).toBeTypeOf('string');
    expect(item.age).toMatch(
      /\d+\s+(second|minute|hour|day|month|year)s?\s+ago/,
    );
  });

  it('should return comments with valid structure', async () => {
    const item = await fetchItem(storyId);

    expect(item.commentCount).toBeTypeOf('number');
    expect(item.commentCount).toBeGreaterThan(0);
    expect(item.comments.length).toBe(item.commentCount);

    for (const comment of item.comments) {
      expect(comment.id).toBeTypeOf('string');
      expect(comment.id.length).toBeGreaterThan(0);

      expect(comment.position).toBeTypeOf('number');
      expect(comment.position).toBeGreaterThanOrEqual(0);

      expect(comment.body).toBeTypeOf('string');
      expect(comment.body.length).toBeGreaterThan(0);

      expect(comment.level).toBeTypeOf('string');
      // Level should be a numeric string representing nesting depth
      expect(Number(comment.level)).toBeGreaterThanOrEqual(0);
    }
  });

  it('comments should have sequential positions', async () => {
    const item = await fetchItem(storyId);

    for (let i = 0; i < item.comments.length; i++) {
      expect(item.comments[i].position).toBe(i);
    }
  });

  it('most comments should have a username', async () => {
    const item = await fetchItem(storyId);

    // Some comments may be [dead] or [deleted], but most should have usernames
    const withUsername = item.comments.filter(
      (c: any) => c.username.length > 0,
    );
    expect(withUsername.length).toBeGreaterThan(item.comments.length * 0.5);
  });

  it('most comments should have an age', async () => {
    const item = await fetchItem(storyId);

    const withAge = item.comments.filter((c: any) => c.age.length > 0);
    expect(withAge.length).toBeGreaterThan(item.comments.length * 0.5);
  });
});

describe('HN HTML Structure Selectors', () => {
  // These tests verify that the CSS selectors used for scraping still match
  // the actual HN HTML structure. If these fail, HN likely changed their markup.

  it('front page should have tr.athing elements for stories', async () => {
    const res = await fetch(`${HN}/news`);
    const html = await res.text();
    const $ = cheerio.load(html);

    expect($('tr.athing').length).toBeGreaterThan(0);
  });

  it('stories should have span.titleline with links', async () => {
    const res = await fetch(`${HN}/news`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const titleLinks = $('tr.athing span.titleline a').length;
    expect(titleLinks).toBeGreaterThan(0);
  });

  it('should have subtext rows with score, age, and user info', async () => {
    const res = await fetch(`${HN}/news`);
    const html = await res.text();
    const $ = cheerio.load(html);

    expect($('span.score').length).toBeGreaterThan(0);
    expect($('span.age').length).toBeGreaterThan(0);
    expect($('a.hnuser').length).toBeGreaterThan(0);
  });

  it('should have a.morelink for pagination', async () => {
    const res = await fetch(`${HN}/news`);
    const html = await res.text();
    const $ = cheerio.load(html);

    expect($('a.morelink').length).toBe(1);
    expect($('a.morelink').attr('href')).toContain('p=');
  });

  it('item page should have tr.comtr elements for comments', async () => {
    // First get a story with comments
    const feedRes = await fetch(`${HN}/news`);
    const feedHtml = await feedRes.text();
    const $feed = cheerio.load(feedHtml);
    const firstId = $feed('tr.athing').first().attr('id');

    const res = await fetch(`${HN}/item?id=${firstId}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // The item page should at least have the story title
    expect($('.title span.titleline').length).toBeGreaterThan(0);

    // Comment selectors
    const comtrs = $('tr.comtr');
    if (comtrs.length > 0) {
      // Verify comment sub-selectors
      expect(comtrs.first().find('.comhead > a.hnuser').length + comtrs.first().find('.comhead > span.age').length).toBeGreaterThan(0);
      expect(comtrs.first().find('td.ind').length).toBe(1);
      expect(comtrs.first().find('td.ind').attr('indent')).toBeDefined();
    }
  });

  it('subtext should have item links for comment counts', async () => {
    const res = await fetch(`${HN}/news`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // The selector used to get comment counts
    const itemLinks = $('span.subline a[href^="item"]');
    expect(itemLinks.length).toBeGreaterThan(0);
  });
});

describe('Data Consistency', () => {
  it('story IDs from feed should resolve as valid items', async () => {
    const { items } = await fetchNewsFeed();

    // Test a few stories to avoid hammering HN
    const sample = items.slice(0, 3);
    for (const story of sample) {
      const item = await fetchItem(String(story.id));
      expect(item.title.length).toBeGreaterThan(0);
      // Item page title includes hostname suffix (e.g. "(site.com)"),
      // feed parser only gets the link text. So item title should start with feed title.
      expect(item.title).toContain(story.text);
    }
  });

  it('score from feed and item page should be close', async () => {
    const { items } = await fetchNewsFeed();
    const story = items[0];
    const item = await fetchItem(String(story.id));

    // Scores may drift slightly between requests, allow some tolerance
    expect(Math.abs(item.score - story.score)).toBeLessThan(50);
  });
});
