import { describe, expect, it } from 'vitest';
import { loadNews, loadItem } from '../server/hn';

// Keep changing HN content and network availability out of the default suite.
describe.skipIf(process.env.HN_LIVE_TESTS !== '1')(
  'live Hacker News markup',
  () => {
    it('loads news, follows its cursor, loads an item, and filters a domain', async () => {
      const feed = await loadNews({});
      expect(feed.items.length).toBeGreaterThan(0);
      expect(feed.more).toBeTruthy();
      const nextQuery = Object.fromEntries(
        new URL(feed.more as string, 'https://calmernews.com').searchParams,
      );
      const next = await loadNews(nextQuery);
      expect(next.page).toBe(2);
      expect(next.items.length).toBeGreaterThan(0);
      const item = await loadItem({ id: String(feed.items[0].id) });
      expect(item.title).toContain(feed.items[0].text);
      const domain = await loadNews({ site: 'github.com' }, true);
      expect(domain.items.length).toBeGreaterThan(0);
      expect(
        domain.items.every((story) => story.host.includes('github.com')),
      ).toBe(true);
      expect(domain.more).toBeTruthy();
      const domainNextQuery = Object.fromEntries(
        new URL(domain.more as string, 'https://calmernews.com').searchParams,
      );
      const domainNext = await loadNews(domainNextQuery, true);
      expect(domainNext.from).toBe(true);
      expect(domainNext.items.length).toBeGreaterThan(0);
      expect(domainNext.items[0].id).not.toBe(domain.items[0].id);
    });
  },
);
