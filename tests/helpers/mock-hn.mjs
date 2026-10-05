import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import undici from 'undici';

assert.equal(process.features.require_module, false);

// Loaded only by the production smoke-test child process. Keep Next's actual
// compiled routes and sanitizer, replacing just the external HN HTTP response.
const fixtures = Object.fromEntries(
  ['item', 'news'].map((name) => [
    name,
    readFileSync(new URL(`../fixtures/${name}.html`, import.meta.url), 'utf8'),
  ]),
);

undici.fetch = async (input) => {
  const url = new URL(input);
  if (
    url.origin !== 'https://news.ycombinator.com' ||
    !['/item', '/news', '/from'].includes(url.pathname)
  ) {
    throw new Error(`Unexpected smoke-test upstream request: ${url}`);
  }
  return new Response(fixtures[url.pathname === '/item' ? 'item' : 'news'], {
    headers: { 'Content-Type': 'text/html' },
  });
};
