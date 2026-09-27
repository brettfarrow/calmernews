import type { NextApiHandler } from 'next';
import { responseError } from './errors';
import type { Query } from './query';

export function apiHandler(
  load: (query: Query) => Promise<unknown>,
): NextApiHandler {
  return async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      res.setHeader('Cache-Control', 'no-store');
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }
    try {
      const data = await load(req.query);
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=30, stale-while-revalidate=60',
      );
      res.status(200).json(data);
    } catch (error) {
      const failure = responseError(error);
      res.setHeader('Cache-Control', 'no-store');
      res.status(failure.status).json({ error: failure.message });
    }
  };
}
