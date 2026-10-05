import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const probe = createServer();
probe.listen(0, '127.0.0.1');
await once(probe, 'listening');
const { port } = probe.address();
await new Promise((resolve, reject) =>
  probe.close((error) => (error ? reject(error) : resolve())),
);

// Vercel disables require(ESM) at runtime even on Node 24. A regular build or
// Vitest run alone does not exercise this production module-loading boundary.
const child = spawn(
  process.execPath,
  [
    '--no-experimental-require-module',
    '--import',
    './tests/helpers/mock-hn.mjs',
    './node_modules/next/dist/bin/next',
    'start',
    '--hostname',
    '127.0.0.1',
    '--port',
    String(port),
  ],
  {
    cwd: root,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);
let output = '';
let startupError;
child.on('error', (error) => {
  startupError = error;
});
child.stdout.on('data', (data) => (output += data));
child.stderr.on('data', (data) => (output += data));
const base = `http://127.0.0.1:${port}`;

try {
  const deadline = Date.now() + 30_000;
  while (true) {
    if (startupError) throw startupError;
    assert.equal(child.exitCode, null, 'Production server exited early');
    try {
      const ready = await fetch(`${base}/404`, {
        signal: AbortSignal.timeout(1000),
      });
      await ready.arrayBuffer();
      if (ready.status === 404) break;
    } catch {
      // The process can take a moment to bind its port.
    }
    assert.ok(Date.now() < deadline, 'Production server did not become ready');
    await delay(100);
  }

  for (const path of [
    '/',
    '/news?p=2',
    '/from?site=example.com',
    '/item?id=49727450',
    '/api',
    '/api/news?p=2',
    '/api/from?site=example.com',
    '/api/item?id=49727450',
  ]) {
    const response = await fetch(`${base}${path}`, {
      signal: AbortSignal.timeout(10_000),
    });
    const body = await response.text();
    assert.equal(response.status, 200, `${path} returned ${response.status}`);
    const isApi = path.startsWith('/api');
    const data = isApi
      ? JSON.parse(body)
      : JSON.parse(
          body.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)?.[1] ||
            'null',
        )?.props.pageProps.data;
    assert.ok(data, `${path} did not return route data`);
    if (path.includes('/item')) {
      assert.equal(data.id, '49727450');
      assert.equal(data.title, 'Ask HN: a question');
      assert.ok(
        data.postBody.includes('<pre><code>line 1\nline 2</code></pre>'),
      );
      assert.equal(data.comments.length, 2);
      for (const html of [data.postBody, ...data.comments.map((c) => c.body)]) {
        assert.doesNotMatch(html, /<script|<iframe|<svg|\son\w+=|javascript:/i);
      }
      assert.ok(data.comments[0].body.includes('nofollow noopener noreferrer'));
    } else {
      assert.equal(data.items[0].text, 'Ask HN: a question');
      assert.equal(data.items.length, 3);
    }
    console.log(
      `PASS ${path}: rendered fixture data with require(ESM) disabled`,
    );
  }

  for (const path of ['/item', '/api/item']) {
    const response = await fetch(`${base}${path}`, {
      signal: AbortSignal.timeout(10_000),
    });
    await response.arrayBuffer();
    assert.equal(response.status, 400, `${path} must validate missing IDs`);
    console.log(`PASS ${path}: expected 400 validation response`);
  }
  assert.doesNotMatch(output, /ERR_REQUIRE_ESM|Failed to load external module/);
} catch (error) {
  console.error(output);
  throw error;
} finally {
  if (child.exitCode === null && child.signalCode === null && !startupError) {
    const closed = once(child, 'close');
    child.kill('SIGTERM');
    const forceStop = setTimeout(() => child.kill('SIGKILL'), 5000);
    forceStop.unref();
    await closed;
    clearTimeout(forceStop);
  }
}
