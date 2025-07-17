# Hacker News API Migration

This document outlines the new backwards-compatible API endpoints that use the official Hacker News API instead of HTML parsing.

## Overview

The new API endpoints are located in `/pages/api/hn-api/` and provide the same data structure as the original endpoints, ensuring complete backwards compatibility with the existing frontend components.

## Endpoints

### 1. Main/News Feed (`/api/hn-api/` and `/api/hn-api/news`)

**Purpose**: Fetches the main Hacker News feed with top stories.

**Parameters**:
- `p` (optional): Page number for pagination (default: 1)
- `n` (optional): Number of items per page (not implemented, defaults to 30)
- `site` (optional): Filter by domain (limited effectiveness due to HN API constraints)

**Response Format**:
```json
{
  "items": [
    {
      "id": 123456,
      "age": "2 hours ago",
      "comments": 45,
      "host": "example.com",
      "href": "https://example.com/article",
      "score": 120,
      "text": "Article Title",
      "user": "username"
    }
  ],
  "more": "/news?p=2",
  "previous": "/",
  "page": 1,
  "start": 1
}
```

### 2. Individual Item (`/api/hn-api/item`)

**Purpose**: Fetches detailed information about a specific story or comment, including all nested comments.

**Parameters**:
- `id` (required): The Hacker News item ID

**Response Format**:
```json
{
  "id": 123456,
  "title": "Story Title",
  "host": "example.com",
  "link": "https://example.com/article",
  "score": 120,
  "byline": "username",
  "age": "2 hours ago",
  "postBody": "Story text content for Ask HN posts",
  "commentCount": 25,
  "comments": [
    {
      "position": 0,
      "id": 123457,
      "username": "commenter",
      "age": "1 hour ago",
      "body": "Comment text",
      "level": "0"
    }
  ]
}
```

### 3. Domain Filter (`/api/hn-api/from`)

**Purpose**: Fetches stories filtered by domain/site.

**Parameters**:
- `site` (required): Domain to filter by
- `p` (optional): Page number for pagination (default: 1)

**Response Format**: Same as main feed, plus:
```json
{
  "from": true
}
```

## Key Features

### 1. **Complete Backwards Compatibility**
- All endpoints return data in the exact same format as the original scraping-based API
- No changes required to existing frontend components
- Maintains all existing query parameters and pagination logic

### 2. **Performance Improvements**
- Uses official HN Firebase API for faster, more reliable data fetching
- Parallel API calls for fetching multiple items
- Real-time data without HTML parsing overhead

### 3. **Robust Error Handling**
- Graceful fallback for missing or deleted items
- Comprehensive error logging
- Proper HTTP status codes

### 4. **Data Transformation**
- Converts Unix timestamps to human-readable relative time
- Extracts domains from URLs
- Cleans HTML content to plain text for comments
- Handles nested comment threading with proper indentation levels

## Implementation Details

### Time Conversion
The API converts Unix timestamps from the HN API to human-readable relative time strings (e.g., "2 hours ago", "3 days ago").

### Comment Threading
Comments are fetched recursively and flattened into a single array with level indicators, maintaining the original threading structure.

### Domain Filtering Limitations
Since the official HN API doesn't support filtering by domain, the `/from` endpoint searches through batches of top stories to find matches. This may be less comprehensive than the original scraping approach but provides better performance and reliability.

### Rate Limiting
The official HN API has no rate limiting, but the implementation includes reasonable batch sizes and limits to prevent excessive API calls.

## Migration Path

### Option 1: Drop-in Replacement
Simply change the API endpoints in your frontend from `/api/` to `/api/hn-api/`:

```javascript
// Before
const data = await fetch('/api/news?p=1').then(r => r.json());

// After  
const data = await fetch('/api/hn-api/news?p=1').then(r => r.json());
```

### Option 2: Environment-based Switching
Use environment variables to switch between implementations:

```javascript
const apiBase = process.env.USE_HN_API ? '/api/hn-api' : '/api';
const data = await fetch(`${apiBase}/news?p=1`).then(r => r.json());
```

### Option 3: Gradual Migration
Update specific routes one at a time to test the new implementation.

## Benefits

1. **Reliability**: No more broken parsing when HN changes their HTML structure
2. **Performance**: Direct API access is faster than HTML parsing
3. **Real-time**: Data is near real-time from Firebase
4. **Maintainability**: Less complex code without HTML parsing logic
5. **Future-proof**: Uses official API that's maintained by Y Combinator

## Considerations

1. **Domain Filtering**: Less comprehensive than HTML scraping for `/from` endpoint
2. **Dependency**: Relies on the official HN API availability
3. **Data Differences**: Minor differences in comment formatting due to HTML-to-text conversion

## Testing

Test the new endpoints by making requests to `/api/hn-api/` routes and comparing the responses with the original `/api/` routes. The data structure should be identical, ensuring seamless integration with existing frontend components.