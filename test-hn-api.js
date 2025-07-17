#!/usr/bin/env node

/**
 * Test script for the new Hacker News API endpoints
 * This demonstrates backwards compatibility with the original scraping-based API
 */

const baseUrl = 'http://localhost:3000/api';

async function testEndpoint(name, url) {
  console.log(`\n🧪 Testing ${name}:`);
  console.log(`📍 URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success (${response.status})`);
      console.log(`📊 Data structure:`, {
        keys: Object.keys(data),
        itemCount: data.items?.length || 'N/A',
        hasMore: data.more ? 'Yes' : 'No',
        page: data.page || 'N/A'
      });
      
      if (data.items && data.items.length > 0) {
        console.log(`📰 First item:`, {
          id: data.items[0].id,
          title: data.items[0].text?.substring(0, 50) + '...',
          score: data.items[0].score,
          comments: data.items[0].comments,
          host: data.items[0].host
        });
      }
      
      if (data.comments && data.comments.length > 0) {
        console.log(`💬 Comments: ${data.comments.length} total`);
        console.log(`📝 First comment preview:`, data.comments[0].body?.substring(0, 100) + '...');
      }
    } else {
      console.log(`❌ Error (${response.status}): ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`💥 Network Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Testing Hacker News API Endpoints');
  console.log('=' .repeat(50));
  
  // Test main feed
  await testEndpoint('Main Feed (Page 1)', `${baseUrl}/hn-api?p=1`);
  
  // Test news feed
  await testEndpoint('News Feed (Page 1)', `${baseUrl}/hn-api/news?p=1`);
  
  // Test pagination
  await testEndpoint('News Feed (Page 2)', `${baseUrl}/hn-api/news?p=2`);
  
  // Get an item ID from the feed first
  try {
    const feedResponse = await fetch(`${baseUrl}/hn-api?p=1`);
    const feedData = await feedResponse.json();
    
    if (feedData.items && feedData.items.length > 0) {
      const itemId = feedData.items[0].id;
      await testEndpoint(`Item Details (ID: ${itemId})`, `${baseUrl}/hn-api/item?id=${itemId}`);
    }
  } catch (error) {
    console.log('Could not fetch item for testing:', error.message);
  }
  
  // Test domain filtering
  await testEndpoint('GitHub Stories', `${baseUrl}/hn-api/from?site=github.com`);
  
  console.log('\n🎉 Testing Complete!');
  console.log('\n📚 Usage Examples:');
  console.log('1. Replace /api/ with /api/hn-api/ in your existing code');
  console.log('2. All query parameters work the same way');
  console.log('3. Response format is identical to the original API');
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testEndpoint, runTests };