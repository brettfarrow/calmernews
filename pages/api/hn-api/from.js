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
  const { query: { site, next, p } } = req;
  
  if (!site) {
    return res.status(400).json({ error: 'Site parameter is required' });
  }
  
  try {
    // Fetch top stories (we'll need to search through more to find domain matches)
    const storyIdsResponse = await fetch(`${HN_API_BASE}/topstories.json`);
    const allStoryIds = await storyIdsResponse.json();
    
    // We need to search through more stories to find enough matches for the requested domain
    // Since HN API doesn't support filtering by domain, we'll fetch in batches
    const batchSize = 100;
    const maxBatches = 5; // Limit to prevent excessive API calls
    const pageSize = 30;
    const pageNumber = Math.max(1, Math.round(p) || 1);
    const targetCount = pageNumber * pageSize;
    
    let matchingStories = [];
    let processedCount = 0;
    
    for (let batch = 0; batch < maxBatches && matchingStories.length < targetCount; batch++) {
      const startIdx = batch * batchSize;
      const endIdx = Math.min(startIdx + batchSize, allStoryIds.length);
      const batchIds = allStoryIds.slice(startIdx, endIdx);
      
      if (batchIds.length === 0) break;
      
      const stories = await fetchItems(batchIds);
      
      // Filter stories by domain and transform to expected format
      const domainMatches = stories
        .filter(story => {
          if (!story || story.type !== 'story' || !story.url) return false;
          const storyDomain = getDomain(story.url);
          return storyDomain.toLowerCase().includes(site.toLowerCase());
        })
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
      
      matchingStories.push(...domainMatches);
      processedCount += stories.length;
    }
    
    // Paginate the results
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStories = matchingStories.slice(startIndex, endIndex);
    
    // Generate pagination URLs
    const hasMore = matchingStories.length > endIndex;
    const more = hasMore ? `/from?site=${site}&p=${pageNumber + 1}` : false;
    const previous = pageNumber > 1 ? `/from?site=${site}&p=${pageNumber - 1}` : '/';
    
    // Return data in expected format with "from" flag
    res.json({
      items: paginatedStories,
      more,
      previous,
      page: pageNumber,
      start: startIndex + 1,
      from: true, // This flag indicates it's a domain-filtered result
    });
    
  } catch (error) {
    console.error('Error fetching from HN API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Hacker News API' });
  }
}