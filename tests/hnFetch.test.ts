import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetch } from 'undici';
import hnFetch from '../utils/hnFetch';

vi.mock('undici', () => ({ Agent: class {}, fetch: vi.fn() }));
beforeEach(() => vi.resetAllMocks());

describe('HN transport', () => {
  it('sets a deadline, identifies the app, and refuses redirects', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true } as Awaited<
      ReturnType<typeof fetch>
    >);
    await hnFetch('https://news.ycombinator.com/news');
    expect(fetch).toHaveBeenCalledWith(
      'https://news.ycombinator.com/news',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
        redirect: 'error',
        headers: { 'User-Agent': expect.stringContaining('calmernews/') },
      }),
    );
  });

  it('cancels upstream error bodies and rejects non-success responses', async () => {
    const cancel = vi.fn();
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
      body: { cancel },
    } as unknown as Awaited<ReturnType<typeof fetch>>);
    await expect(
      hnFetch('https://news.ycombinator.com/news'),
    ).rejects.toMatchObject({ status: 502 });
    expect(cancel).toHaveBeenCalledOnce();
  });

  it('maps a transport timeout to a controlled upstream error', async () => {
    vi.mocked(fetch).mockRejectedValue(
      new DOMException('timed out', 'TimeoutError'),
    );
    await expect(
      hnFetch('https://news.ycombinator.com/news'),
    ).rejects.toMatchObject({ status: 502 });
  });
});
