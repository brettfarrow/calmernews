import { describe, expect, it } from 'vitest';
import * as cheerio from 'cheerio';
import { cleanContent, safeLink } from '../server/content';

describe('HTML sanitization', () => {
  it.each([
    '<a href="javascript:alert(1)">click</a>',
    '<a href="jav&#x61;script:alert(1)">click</a>',
    '<a href="java\nscript:alert(1)">click</a>',
    '<a href="data:text/html,test">click</a>',
    '<svg><a xlink:href="javascript:alert(1)">click</a></svg>',
    '<math><mtext><img src=x onerror=alert(1)></mtext></math>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
    '<form action="https://evil.example"><input autofocus onfocus="alert(1)"></form>',
    '<p style="background:url(https://evil.example)" id="location" onclick="alert(1)">text</p>',
  ])('removes executable content from %s', (html) => {
    const result = cleanContent(html);
    const $ = cheerio.load(result, undefined, false);
    expect(
      $('script, style, svg, math, iframe, img, form, input'),
    ).toHaveLength(0);
    $('*').each((_, element) => {
      if (!('attribs' in element)) return;
      expect(
        Object.keys(element.attribs).every((name) =>
          ['href', 'title', 'rel'].includes(name),
        ),
      ).toBe(true);
    });
    $('a').each((_, element) => {
      expect($(element).attr('href') || '').not.toMatch(
        /^(?:javascript|data):/i,
      );
    });
  });

  it('keeps literal placeholder text and multiline code intact', () => {
    expect(
      cleanContent('<p>{{PRE_TAG_0}}</p><pre><code>a\nb</code></pre>'),
    ).toBe('<p>{{PRE_TAG_0}}</p><pre><code>a\nb</code></pre>');
  });

  it('resolves relative links and preserves safe external links', () => {
    expect(safeLink('item?id=123')).toBe('/item?id=123');
    expect(safeLink('user?id=alice')).toBe(
      'https://news.ycombinator.com/user?id=alice',
    );
    expect(safeLink('//example.com')).toBe('https://example.com/');
    expect(safeLink('https://example.com/path')).toBe(
      'https://example.com/path',
    );
    expect(safeLink('javascript:alert(1)')).toBe('');
  });
});
