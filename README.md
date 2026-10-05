# Calmer News

A modified UI for Hacker News, starting with no comments. Not affiliated with Y Combinator or Hacker News in any way.

Use Node.js 24 and install dependencies with `npm ci`.

- `npm run dev`: development server on port 3002.
- `npm run build && npm start`: production build and server on port 3002.
- `npm test`: deterministic regression tests; no network access required.
- `npm run build && npm run test:production`: smoke-test compiled pages and APIs
  with fixture HN responses and Vercel's `require(ESM)` support disabled.
- `HN_LIVE_TESTS=1 npx vitest run tests/live.test.ts`: opt-in check against current Hacker News markup.
- `npm run lint` and `npm run typecheck`: code checks.
- `npm run format:check`: check formatting; `npm run prettier` applies fixes.
- `npm audit`: dependency advisory check.

`npm ci` (or `npm install`) installs the local Husky pre-commit hook automatically.
Before each commit, it formats and lints staged files with lint-staged, then runs
the full type check and regression suite. Formatting and lint fixes are restaged
automatically; failures stop the commit. Type checks and tests use the current
working tree, including unstaged changes. Run `npm run precommit` manually to
repeat these checks, or `npm run prepare` to reinstall the hook.

GitHub Actions runs formatting, lint, type checks, regression tests, and a
production build and runtime smoke test on every PR and every push to `main`,
using Node.js from `.nvmrc`. CodeQL also scans PRs targeting `main`, pushes to
`main`, and weekly.
The optional live Hacker News test stays disabled in CI. In GitHub's branch
rules for `main`, require `Lint, types, tests, and build` and `Analyze` to pass
before merging; adding workflow files alone does not enforce merge protection.

Deployments use the existing [Vercel Git integration](https://vercel.com/docs/git/vercel-for-github):
PR branches receive preview deployments, and `main` is the production branch.
Keep this repository connected in Vercel with `main` selected as its production
branch. No Vercel token or deployment workflow is needed in GitHub Actions.
Vercel deployments run independently of CI; required GitHub checks gate merges,
not preview deployments.

Pages and API routes share the loaders in `server/hn.ts`. Server-rendered pages call them directly; a `HOST` environment variable is no longer needed. Display preferences are read from cookies, with browser storage as a fallback. Only the three display preference cookies are included in page props.

Hacker News requests have a ten-second deadline and reject unsuccessful responses. Successful public API responses may be cached by a CDN for 30 seconds, with another 60 seconds of stale-while-revalidate. Pages remain private because their initial display preferences depend on cookies. Domain feeds use HN's forward cursor and browser history for going back.

Story bodies and comments are sanitized on the server with a restricted set of formatting tags and HTTP(S) links. Render these fragments intact; splitting or modifying sanitized HTML can change its meaning and break code blocks. Fixtures cover malicious markup, pagination, validation, and upstream failures. The live test checks the same loaders used in production rather than a copy of the scraping code.
