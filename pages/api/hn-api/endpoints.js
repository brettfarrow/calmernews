const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

const endpoints = {
  HN_API: HN_API_BASE,
  TOPSTORIES: `${HN_API_BASE}/topstories.json`,
  NEWSTORIES: `${HN_API_BASE}/newstories.json`,
  BESTSTORIES: `${HN_API_BASE}/beststories.json`,
  ASKSTORIES: `${HN_API_BASE}/askstories.json`,
  SHOWSTORIES: `${HN_API_BASE}/showstories.json`,
  JOBSTORIES: `${HN_API_BASE}/jobstories.json`,
  ITEM: (id) => `${HN_API_BASE}/item/${id}.json`,
  USER: (username) => `${HN_API_BASE}/user/${username}.json`,
  MAXITEM: `${HN_API_BASE}/maxitem.json`,
  UPDATES: `${HN_API_BASE}/updates.json`,
};

export default endpoints;