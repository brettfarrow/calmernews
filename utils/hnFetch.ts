import { Agent, fetch } from 'undici';

// Hacker News rejects plain Node fetch (HTTP/1.1 with a blocklisted bot
// User-Agent like "undici") with 429 "Sorry." on some endpoints such as
// /from. HTTP/2 plus a project-identifying UA passes their checks.
const agent = new Agent({ allowH2: true });

const headers = {
  'User-Agent': 'calmernews/5.3.0 (https://calmernews.com)',
};

export default function hnFetch(url: string) {
  return fetch(url, { dispatcher: agent, headers });
}
