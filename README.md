# Calmer News

A modified UI for Hacker News, starting with no comments. Not affiliated with Y Combinator or Hacker News in any way.

Use Node.js 24 and install dependencies with `npm ci`.

- `npm run dev`: development server on port 3002.
- `npm run build && npm start`: production build and server on port 3002.
- `npm test`: deterministic regression tests; no network access required.
- `HN_LIVE_TESTS=1 npx vitest run tests/live.test.ts`: opt-in check against current Hacker News markup.
- `npm run lint` and `npm run typecheck`: code checks.
- `npm audit`: dependency advisory check.

Pages and API routes share the loaders in `server/hn.ts`. Server-rendered pages call them directly; a `HOST` environment variable is no longer needed. Display preferences are read from cookies, with browser storage as a fallback. Only the three display preference cookies are included in page props.

Hacker News requests have a ten-second deadline and reject unsuccessful responses. Successful public API responses may be cached by a CDN for 30 seconds, with another 60 seconds of stale-while-revalidate. Pages remain private because their initial display preferences depend on cookies. Domain feeds use HN's forward cursor and browser history for going back.

Story bodies and comments are sanitized on the server with a restricted set of formatting tags and HTTP(S) links. Render these fragments intact; splitting or modifying sanitized HTML can change its meaning and break code blocks. Fixtures cover malicious markup, pagination, validation, and upstream failures. The live test checks the same loaders used in production rather than a copy of the scraping code.
