import sanitizeHtml from 'sanitize-html';
import endpoints from './endpoints';

// Resolve HN's relative links and reject executable URL schemes everywhere.
export function safeLink(value?: string): string {
  if (!value) return '';
  try {
    const url = new URL(value, endpoints.HOME);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    if (url.origin === endpoints.HOME && url.pathname === '/item') {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return url.href;
  } catch {
    return '';
  }
}

export function cleanContent(content?: string | null): string {
  return sanitizeHtml(content || '', {
    allowedTags: [
      'p',
      'br',
      'a',
      'b',
      'strong',
      'i',
      'em',
      'pre',
      'code',
      'blockquote',
      'ul',
      'ol',
      'li',
    ],
    allowedAttributes: { a: ['href', 'title', 'rel'] },
    allowedSchemes: ['https', 'http'],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: 'a',
        attribs: {
          href: safeLink(attributes.href),
          title: attributes.title || '',
          rel: 'nofollow noopener noreferrer',
        },
      }),
    },
  });
}
