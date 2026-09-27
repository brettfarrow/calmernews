import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  NextApiRequest,
  NextApiResponse,
  NextApiHandler,
  GetServerSidePropsContext,
} from 'next';
import news from '../pages/api/news';
import from from '../pages/api/from';
import item from '../pages/api/item';
import hnFetch from '../utils/hnFetch';
import { HttpError } from '../server/errors';
import { pageProps } from '../server/pageProps';
import type { Query } from '../server/query';

vi.mock('../utils/hnFetch', () => ({ default: vi.fn() }));
const newsHtml = readFileSync(
  new URL('./fixtures/news.html', import.meta.url),
  'utf8',
);
const itemHtml = readFileSync(
  new URL('./fixtures/item.html', import.meta.url),
  'utf8',
);

function upstream(html: string) {
  vi.mocked(hnFetch).mockResolvedValue({ text: async () => html } as Awaited<
    ReturnType<typeof hnFetch>
  >);
}

async function request(
  handler: NextApiHandler,
  query: Query = {},
  method = 'GET',
) {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    setHeader: vi.fn(),
  };
  await handler(
    { query, method } as NextApiRequest,
    res as unknown as NextApiResponse,
  );
  return {
    ...res,
    body: res.json.mock.calls[0][0],
    code: res.status.mock.calls[0][0],
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  upstream(newsHtml);
});

describe('news API', () => {
  it('parses actual handler output, associates metadata with jobs, and resolves safe links', async () => {
    const res = await request(news);
    expect(res.code).toBe(200);
    expect(res.body.items).toMatchObject([
      { id: 123, href: '/item?id=123', comments: 1, score: 42, user: 'alice' },
      {
        id: 124,
        href: 'https://example.com/jobs',
        comments: 0,
        score: 0,
        user: '',
      },
      { id: 125, href: '', score: 3, user: 'bob' },
    ]);
    expect(res.body.more).toBe('/news?p=2&next=120&n=31');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=60',
    );
  });

  it('builds previous links on the last page without a next cursor', async () => {
    upstream(newsHtml.replace(/<a class="morelink"[^>]*>More<\/a>/, ''));
    const res = await request(news, { p: '3', next: '120', n: '61' });
    expect(res.body).toMatchObject({
      more: false,
      previous: '/news?p=2',
      page: 3,
      start: 61,
    });
  });

  it('preserves domain pagination and the from flag', async () => {
    upstream(
      newsHtml.replace(
        'news?p=2&amp;next=120&amp;n=31',
        'from?site=example.com&amp;p=3&amp;next=120',
      ),
    );
    const res = await request(from, {
      site: 'example.com',
      p: '2',
      next: '125',
    });
    expect(res.body).toMatchObject({
      from: true,
      more: '/from?site=example.com&p=3&next=120',
      previous: '/from?site=example.com',
    });
    expect(hnFetch).toHaveBeenCalledWith(
      'https://news.ycombinator.com/from?p=2&next=125&site=example.com',
    );
  });

  it('does not return an external pagination link', async () => {
    upstream(
      newsHtml.replace(
        'news?p=2&amp;next=120&amp;n=31',
        'https://evil.example/news?p=2',
      ),
    );
    expect((await request(news)).body.more).toBe(false);
  });

  it.each([
    { p: ['1', '2'] },
    { p: '-1' },
    { p: '1.5' },
    { p: 'Infinity' },
    { p: '9007199254740992' },
    { site: 'example.com&x=1' },
    { next: '' },
  ])('rejects invalid input before fetching: %j', async (query) => {
    expect((await request(news, query)).code).toBe(400);
    expect(hnFetch).not.toHaveBeenCalled();
  });

  it('requires a domain on the domain route', async () => {
    expect((await request(from)).code).toBe(400);
    expect(hnFetch).not.toHaveBeenCalled();
  });
});

describe('item API', () => {
  it('sanitizes story bodies and comments while retaining code and paragraphs', async () => {
    upstream(itemHtml);
    const res = await request(item, { id: '123' });
    expect(res.code).toBe(200);
    expect(res.body).toMatchObject({
      id: '123',
      link: '/item?id=123',
      score: 42,
      commentCount: 2,
    });
    expect(res.body.postBody).toContain(
      '<pre><code>line 1\nline 2</code></pre>',
    );
    expect(res.body.postBody).toContain('<p>Second paragraph</p>');
    expect(res.body.comments[0]).toMatchObject({
      id: '456',
      level: 2,
      username: 'bob',
    });
    expect(res.body.comments[0].body).toContain('<i>italic</i>');
    expect(res.body.comments[1].body).toBe('[flagged]');
    expect(JSON.stringify(res.body)).not.toMatch(
      /javascript:|onclick|onmouseover|<script|<svg|<iframe/,
    );
  });

  it.each([{}, { id: ['123', '456'] }, { id: '123&other=456' }, { id: '0' }])(
    'rejects invalid item IDs: %j',
    async (query) => {
      expect((await request(item, query)).code).toBe(400);
      expect(hnFetch).not.toHaveBeenCalled();
    },
  );

  it('returns 404 for missing items', async () => {
    upstream('<html>No such item.</html>');
    expect((await request(item, { id: '123' })).code).toBe(404);
  });
});

describe('request failures and SSR', () => {
  it('rejects unsupported methods without contacting HN', async () => {
    const res = await request(news, {}, 'POST');
    expect(res.code).toBe(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', 'GET, HEAD');
    expect(hnFetch).not.toHaveBeenCalled();
  });

  it.each([
    new HttpError(502, 'Upstream unavailable'),
    new Error('sensitive internal detail'),
  ])(
    'does not cache upstream errors or expose internal failures',
    async (error) => {
      vi.mocked(hnFetch).mockRejectedValue(error);
      const res = await request(news);
      expect(res.code).toBe(502);
      expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
      expect(res.body.error).not.toContain('sensitive');
    },
  );

  it('rejects an upstream error document instead of caching an empty feed', async () => {
    upstream('<html>Rate limited</html>');
    expect((await request(news)).code).toBe(502);
  });

  it('loads SSR data directly and exposes only display preference cookies', async () => {
    const res = { setHeader: vi.fn() };
    const context = {
      query: { p: '2' },
      req: { cookies: { show_score: 'true', session: 'private' } },
      res,
    } as unknown as GetServerSidePropsContext;
    const result = await pageProps('news')(context);
    expect(result.props).toMatchObject({
      data: { page: 2 },
      cookies: { show_score: true },
    });
    expect(JSON.stringify(result)).not.toContain('private');
    expect(hnFetch).toHaveBeenCalledTimes(1);
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'private, no-store',
    );
  });

  it('provides a readable SSR error with the correct HTTP status', async () => {
    const res = { statusCode: 200, setHeader: vi.fn() };
    const context = {
      query: {},
      req: { cookies: {} },
      res,
    } as unknown as GetServerSidePropsContext;
    const result = await pageProps('item')(context);
    expect(result.props).toMatchObject({
      errorStatus: 400,
      errorMessage: 'Missing id parameter.',
    });
    expect(res.statusCode).toBe(400);
  });
});
