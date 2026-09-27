import { Agent, fetch } from 'undici';
import { HttpError } from '../server/errors';

// HN accepts HTTP/2 with a project-identifying User-Agent more reliably
// than Node's default fetch client, particularly for domain feeds.
const agent = new Agent({ allowH2: true, connections: 8 });

export default async function hnFetch(url: string) {
  try {
    const response = await fetch(url, {
      dispatcher: agent,
      headers: { 'User-Agent': 'calmernews/5.3.0 (https://calmernews.com)' },
      signal: AbortSignal.timeout(10_000),
      redirect: 'error',
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new HttpError(
        502,
        'Hacker News is temporarily unavailable. Please try again.',
      );
    }
    return response;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(502, 'Unable to reach Hacker News. Please try again.');
  }
}
