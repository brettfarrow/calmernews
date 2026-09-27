import { HttpError } from './errors';

export type Query = Record<string, string | string[] | undefined>;

export function scalar(query: Query, name: string): string | undefined {
  const value = query[name];
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value || value.length > 253) {
    throw new HttpError(400, `Invalid ${name} parameter.`);
  }
  return value;
}

export function positiveInteger(
  query: Query,
  name: string,
): string | undefined {
  const value = scalar(query, name);
  if (
    value !== undefined &&
    (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value)))
  ) {
    throw new HttpError(400, `Invalid ${name} parameter.`);
  }
  return value;
}

export function newsParams(query: Query, requireSite = false) {
  const params = new URLSearchParams();
  for (const name of ['p', 'n', 'next']) {
    const value = positiveInteger(query, name);
    if (value) params.set(name, value);
  }
  const site = scalar(query, 'site');
  if (requireSite && !site) throw new HttpError(400, 'Missing site parameter.');
  if (site) {
    if (!/^(?=.{1,253}$)[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(site)) {
      throw new HttpError(400, 'Invalid site parameter.');
    }
    params.set('site', site.toLowerCase());
  }
  return params;
}
