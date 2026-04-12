import express from 'express';

const router = express.Router();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// ========================
// YOUTUBE SEARCH
// ========================
router.post('/search', async (req, res) => {
  try {
    const { q, maxResults = 8, pageToken = '' } = req.body;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ message: 'YouTube API key not configured' });
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoCategoryId', '10');
    url.searchParams.set('order', 'date');
    url.searchParams.set('maxResults', maxResults);
    url.searchParams.set('q', q);
    url.searchParams.set('key', YOUTUBE_API_KEY);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({
      items: data.items || [],
      nextPageToken: data.nextPageToken || null,
    });
  } catch (error) {
    console.error('YouTube search error:', error);
    res.status(500).json({ message: 'Failed to search YouTube', error: error.message });
  }
});

// ========================
// GET VIDEO DETAILS (Duration)
// ========================
router.post('/video-details', async (req, res) => {
  try {
    const { videoIds = [] } = req.body;

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return res.status(400).json({ message: 'videoIds array is required' });
    }

    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ message: 'YouTube API key not configured' });
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'contentDetails');
    url.searchParams.set('id', videoIds.join(','));
    url.searchParams.set('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({
      items: data.items || [],
    });
  } catch (error) {
    console.error('YouTube video details error:', error);
    res.status(500).json({ message: 'Failed to fetch video details', error: error.message });
  }
});

export default router;
