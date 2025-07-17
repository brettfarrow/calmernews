const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Helper function to convert Unix timestamp to relative time
export function timeAgo(unixTime) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTime;
  
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// Helper function to extract domain from URL
export function getDomain(url) {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

// Helper function to clean HTML content to plain text
export function cleanContent(html) {
  if (!html) return '';
  
  return html
    .replace(/<p>/g, '\n')
    .replace(/<\/p>/g, '\n')
    .replace(/<a[^>]*>/g, '')
    .replace(/<\/a>/g, '')
    .replace(/<i>/g, '')
    .replace(/<\/i>/g, '')
    .replace(/<code>/g, '')
    .replace(/<\/code>/g, '')
    .replace(/<pre>/g, '\n')
    .replace(/<\/pre>/g, '\n')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\n\n+/g, '\n')
    .trim();
}

// Helper function to fetch item from HN API
export async function fetchItem(id) {
  try {
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  }
}

// Helper function to fetch multiple items in parallel
export async function fetchItems(ids) {
  const promises = ids.map(id => fetchItem(id));
  const results = await Promise.all(promises);
  return results.filter(item => item !== null);
}

// Helper function to transform story to expected format
export function transformStory(story) {
  if (!story) return null;
  
  const host = getDomain(story.url) || 'news.ycombinator.com';
  
  return {
    id: story.id,
    age: timeAgo(story.time),
    comments: story.descendants || 0,
    host: host,
    href: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
    score: story.score || 0,
    text: story.title || '',
    user: story.by || ''
  };
}

// Helper function to generate pagination info
export function generatePagination(pageNumber, hasMore, basePath = '/news', extraParams = '') {
  const more = hasMore ? `${basePath}?p=${pageNumber + 1}${extraParams}` : false;
  const previous = pageNumber > 1 ? `${basePath}?p=${pageNumber - 1}${extraParams}` : '/';
  
  return { more, previous };
}