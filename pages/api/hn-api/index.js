// Backwards compatible API using official Hacker News API
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

// Helper function to fetch item details
async function fetchItem(id) {
  try {
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  }
}

// Helper function to fetch multiple items in parallel
async function fetchItems(ids) {
  const promises = ids.map(id => fetchItem(id));
  const results = await Promise.all(promises);
  return results.filter(item => item !== null);
}

export default async function handler(req, res) {
  const { query: { n, p, next, site } } = req;
  
  try {
    // Determine which stories to fetch based on parameters
    let storyListEndpoint = 'topstories';
    
    if (site) {
      // For "from" queries, we need to fetch top stories and filter by domain
      // This is a limitation since HN API doesn't support filtering by domain directly
      storyListEndpoint = 'topstories';
    }
    
    // Fetch story IDs
    const storyIdsResponse = await fetch(`${HN_API_BASE}/${storyListEndpoint}.json`);
    const allStoryIds = await storyIdsResponse.json();
    
    // Calculate pagination
    const pageSize = 30;
    const pageNumber = Math.max(1, Math.round(p) || 1);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Get story IDs for current page
    const currentPageIds = allStoryIds.slice(startIndex, endIndex);
    
    // Fetch story details
    const stories = await fetchItems(currentPageIds);
    
    // Transform stories to match expected format
    const transformedStories = stories
      .filter(story => story && story.type === 'story')
      .map(story => {
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
      });
    
    // Filter by site if specified
    let filteredStories = transformedStories;
    if (site) {
      filteredStories = transformedStories.filter(story => 
        story.host.toLowerCase().includes(site.toLowerCase())
      );
    }
    
    // Generate pagination URLs
    const hasMore = endIndex < allStoryIds.length;
    const more = hasMore ? `/news?p=${pageNumber + 1}` : false;
    const previous = pageNumber > 1 ? `/news?p=${pageNumber - 1}` : '/';
    
    // Return data in expected format
    res.json({
      items: filteredStories,
      more,
      previous,
      page: pageNumber,
      start: startIndex + 1,
    });
    
  } catch (error) {
    console.error('Error fetching from HN API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Hacker News API' });
  }
}