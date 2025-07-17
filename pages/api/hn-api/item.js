const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Helper function to convert Unix timestamp to relative time
function timeAgo(unixTime) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTime;
  
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

// Helper function to extract domain from URL
function getDomain(url) {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

// Helper function to clean HTML content to plain text
function cleanContent(html) {
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
async function fetchItem(id) {
  try {
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  }
}

// Helper function to fetch comments recursively
async function fetchComments(commentIds, level = 0) {
  if (!commentIds || commentIds.length === 0) return [];
  
  const comments = [];
  
  for (let i = 0; i < commentIds.length; i++) {
    const commentId = commentIds[i];
    const comment = await fetchItem(commentId);
    
    if (comment && !comment.deleted && !comment.dead) {
      const transformedComment = {
        position: i,
        id: commentId,
        username: comment.by || '',
        age: timeAgo(comment.time),
        body: cleanContent(comment.text) || '[deleted]',
        level: level.toString(),
      };
      
      comments.push(transformedComment);
      
      // Recursively fetch child comments
      if (comment.kids && comment.kids.length > 0) {
        const childComments = await fetchComments(comment.kids, level + 1);
        comments.push(...childComments);
      }
    }
  }
  
  return comments;
}

export default async function handler(req, res) {
  const { query: { id } } = req;
  
  if (!id) {
    return res.status(400).json({ error: 'Item ID is required' });
  }
  
  try {
    // Fetch the main item
    const item = await fetchItem(id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Extract basic item information
    const title = item.title || '';
    const link = item.url || `https://news.ycombinator.com/item?id=${id}`;
    const host = getDomain(item.url);
    const score = item.score || 0;
    const byline = item.by || '';
    const age = timeAgo(item.time);
    
    // Get post body for Ask HN posts or stories with text
    const postBody = cleanContent(item.text) || '';
    
    // Fetch all comments
    const comments = item.kids ? await fetchComments(item.kids) : [];
    
    // Return data in expected format
    res.json({
      id: parseInt(id),
      title,
      host,
      link,
      score,
      byline,
      age,
      postBody,
      commentCount: comments.length,
      comments,
    });
    
  } catch (error) {
    console.error('Error fetching item from HN API:', error);
    res.status(500).json({ error: 'Failed to fetch item from Hacker News API' });
  }
}