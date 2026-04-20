import express from 'express';

const router = express.Router();

// Demo mode - mock YouTube data for localhost testing
const DEMO_MODE = true; // Set to false to use real YouTube API

// Mock song data for different moods
const MOCK_SONGS = {
  happy: [
    { id: 'jNQXAC9IVRw', title: '🎵 Good as Hell - Lizzo', thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/default.jpg' },
    { id: 'ZbZSe6N_BXs', title: '🎵 Walking on Sunshine - Katrina & The Waves', thumbnail: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/default.jpg' },
    { id: 'kffacxfA7g4', title: '🎵 Shut Up and Dance - Walk the Moon', thumbnail: 'https://i.ytimg.com/vi/kffacxfA7g4/default.jpg' },
    { id: 'kJQP7kiucFM', title: '🎵 Don\'t Stop Me Now - Queen', thumbnail: 'https://i.ytimg.com/vi/kJQP7kiucFM/default.jpg' },
    { id: '0DiuNRwlXqg', title: '🎵 Levitating - Dua Lipa', thumbnail: 'https://i.ytimg.com/vi/0DiuNRwlXqg/default.jpg' },
    { id: '3tmd-ClpJxA', title: '🎵 Walking on Sunshine - Good as Hell Mix', thumbnail: 'https://i.ytimg.com/vi/3tmd-ClpJxA/default.jpg' },
    { id: 'e-IWRmpefzE', title: '🎵 Happy - Pharrell Williams', thumbnail: 'https://i.ytimg.com/vi/e-IWRmpefzE/default.jpg' },
    { id: 'dQw4w9WgXcQ', title: '🎵 Never Gonna Give You Up - Rick Astley', thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' },
  ],
  sad: [
    { id: 'e0MQ7xJ5SfM', title: '💔 Creep - Radiohead', thumbnail: 'https://i.ytimg.com/vi/e0MQ7xJ5SfM/default.jpg' },
    { id: 'T7Zk5NN_kKo', title: '💔 Someone Like You - Adele', thumbnail: 'https://i.ytimg.com/vi/T7Zk5NN_kKo/default.jpg' },
    { id: 'xoRhYJeXvt4', title: '💔 The Night We Met - Lord Huron', thumbnail: 'https://i.ytimg.com/vi/xoRhYJeXvt4/default.jpg' },
    { id: 'lFQDTy-7gJ8', title: '💔 Tears in Heaven - Eric Clapton', thumbnail: 'https://i.ytimg.com/vi/lFQDTy-7gJ8/default.jpg' },
    { id: '4N3N1QvYQrQ', title: '💔 Black - Pearl Jam', thumbnail: 'https://i.ytimg.com/vi/4N3N1QvYQrQ/default.jpg' },
    { id: '2H0ZmxFNhTw', title: '💔 Shape of You - Ed Sheeran', thumbnail: 'https://i.ytimg.com/vi/2H0ZmxFNhTw/default.jpg' },
    { id: 'hicQz79HzsI', title: '💔 Hallelujah - Leonard Cohen', thumbnail: 'https://i.ytimg.com/vi/hicQz79HzsI/default.jpg' },
    { id: 'aHjpOzsQ9YI', title: '💔 Chasing Cars - Snow Patrol', thumbnail: 'https://i.ytimg.com/vi/aHjpOzsQ9YI/default.jpg' },
  ],
  study: [
    { id: 'lFQDTy-7gJ8', title: '📚 Peaceful Piano - Study Music', thumbnail: 'https://i.ytimg.com/vi/lFQDTy-7gJ8/default.jpg' },
    { id: 'XfEMwSbXWfY', title: '📚 Lo-fi Hip Hop - Study Beats', thumbnail: 'https://i.ytimg.com/vi/XfEMwSbXWfY/default.jpg' },
    { id: 'hHW1oY26kxQ', title: '📚 Chill Beats - Focus Music', thumbnail: 'https://i.ytimg.com/vi/hHW1oY26kxQ/default.jpg' },
    { id: 'sSQPyIbRbXU', title: '📚 Deep Focus - Classical Music', thumbnail: 'https://i.ytimg.com/vi/sSQPyIbRbXU/default.jpg' },
    { id: 'BVc56HpSc2w', title: '📚 Mozart - Piano Sonata', thumbnail: 'https://i.ytimg.com/vi/BVc56HpSc2w/default.jpg' },
    { id: 'qNqRF4w6Yfg', title: '📚 Study Session - 2 Hours', thumbnail: 'https://i.ytimg.com/vi/qNqRF4w6Yfg/default.jpg' },
    { id: 'tLzKLmVoMJo', title: '📚 Ambient Study Music', thumbnail: 'https://i.ytimg.com/vi/tLzKLmVoMJo/default.jpg' },
    { id: 'WQON7nwWKwI', title: '📚 Binaural Beats - Focus', thumbnail: 'https://i.ytimg.com/vi/WQON7nwWKwI/default.jpg' },
  ],
  workout: [
    { id: '7LGTX_GUdT8', title: '💪 Eye of the Tiger - Survivor', thumbnail: 'https://i.ytimg.com/vi/7LGTX_GUdT8/default.jpg' },
    { id: 'ZXsQAXx_ao0', title: '💪 Pump It Up - Elvis Presley', thumbnail: 'https://i.ytimg.com/vi/ZXsQAXx_ao0/default.jpg' },
    { id: 'cOy6hqzfsAs', title: '💪 Stronger - Kanye West', thumbnail: 'https://i.ytimg.com/vi/cOy6hqzfsAs/default.jpg' },
    { id: 'uelHwf75q84', title: '💪 Till I Collapse - Eminem', thumbnail: 'https://i.ytimg.com/vi/uelHwf75q84/default.jpg' },
    { id: 'llyiQ4d-Es8', title: '💪 Lose Yourself - Eminem', thumbnail: 'https://i.ytimg.com/vi/llyiQ4d-Es8/default.jpg' },
    { id: 'VJbArcBzqcQ', title: '💪 We Will Rock You - Queen', thumbnail: 'https://i.ytimg.com/vi/VJbArcBzqcQ/default.jpg' },
    { id: '-ndiMBMwUzU', title: '💪 Thunderstruck - AC/DC', thumbnail: 'https://i.ytimg.com/vi/-ndiMBMwUzU/default.jpg' },
    { id: 'FwkHJHAx_4w', title: '💪 High Energy Workout Mix', thumbnail: 'https://i.ytimg.com/vi/FwkHJHAx_4w/default.jpg' },
  ],
  chill: [
    { id: 'lFQDTy-7gJ8', title: '😌 Sunset - The Cinematic Orchestra', thumbnail: 'https://i.ytimg.com/vi/lFQDTy-7gJ8/default.jpg' },
    { id: 'ZbZSe6N_BXs', title: '😌 Island in the Sun - Weezer', thumbnail: 'https://i.ytimg.com/vi/ZbZSe6N_BXs/default.jpg' },
    { id: 'e-IWRmpefzE', title: '😌 Nutshell - Alice in Chains', thumbnail: 'https://i.ytimg.com/vi/e-IWRmpefzE/default.jpg' },
    { id: 'hicQz79HzsI', title: '😌 Space Oddity - David Bowie', thumbnail: 'https://i.ytimg.com/vi/hicQz79HzsI/default.jpg' },
    { id: '4N3N1QvYQrQ', title: '😌 Fade Away - Alan Walker', thumbnail: 'https://i.ytimg.com/vi/4N3N1QvYQrQ/default.jpg' },
    { id: 'T7Zk5NN_kKo', title: '😌 Smooth Criminal - Alien Ant Farm', thumbnail: 'https://i.ytimg.com/vi/T7Zk5NN_kKo/default.jpg' },
    { id: 'xoRhYJeXvt4', title: '😌 Wonderwall - Oasis', thumbnail: 'https://i.ytimg.com/vi/xoRhYJeXvt4/default.jpg' },
    { id: 'nqavCycpJ9U', title: '😌 Such Great Heights - The Postal Service', thumbnail: 'https://i.ytimg.com/vi/nqavCycpJ9U/default.jpg' },
  ],
};

// ========================
// YOUTUBE SEARCH
// ========================
router.post('/search', async (req, res) => {
  try {
    const { q, maxResults = 8, pageToken = '' } = req.body;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Demo mode - return mock data
    if (DEMO_MODE) {
      console.log('🎵 [DEMO MODE] Searching:', q);
      
      // Try to match mood from query
      let moodKey = 'happy';
      const query = q.toLowerCase();
      
      if (query.includes('sad') || query.includes('depressed')) moodKey = 'sad';
      if (query.includes('study') || query.includes('focus') || query.includes('work')) moodKey = 'study';
      if (query.includes('workout') || query.includes('gym') || query.includes('exercise')) moodKey = 'workout';
      if (query.includes('chill') || query.includes('relax') || query.includes('calm')) moodKey = 'chill';
      if (query.includes('party') || query.includes('dance') || query.includes('club')) moodKey = 'happy';
      
      const songs = MOCK_SONGS[moodKey] || MOCK_SONGS.happy;
      
      // Return mock songs
      return res.json({
        items: songs.map(song => ({
          kind: 'youtube#searchResult',
          etag: '12345',
          id: { kind: 'youtube#video', videoId: song.id },
          snippet: {
            publishedAt: new Date().toISOString(),
            title: song.title,
            description: 'Demo song for testing',
            thumbnails: { default: { url: song.thumbnail } },
            channelTitle: 'Moodify Demo',
          }
        })),
        nextPageToken: null,
      });
    }

    // Real YouTube API (if demo mode is disabled)
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
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

    console.log('🔍 Searching YouTube for:', q);
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ YouTube API Error:', response.status, response.statusText);
      console.error('Error Details:', errorData);
      
      if (response.status === 403) {
        return res.status(403).json({ 
          message: 'YouTube API forbidden - Check if YouTube Data API v3 is enabled in Google Cloud Console',
          details: errorData 
        });
      }
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Got', data.items?.length || 0, 'results for:', q);
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

    // Demo mode - return mock durations
    if (DEMO_MODE) {
      console.log('📹 [DEMO MODE] Getting durations for', videoIds.length, 'videos');
      return res.json({
        items: videoIds.map(id => ({
          kind: 'youtube#video',
          id: id,
          contentDetails: { duration: 'PT' + (Math.floor(Math.random() * 300) + 120) + 'S' }, // 2-7 minutes
        })),
      });
    }

    // Real YouTube API
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ message: 'YouTube API key not configured' });
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'contentDetails');
    url.searchParams.set('id', videoIds.join(','));
    url.searchParams.set('key', YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Error fetching video durations:', response.status);
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Got durations for', data.items?.length || 0, 'videos');
    res.json({
      items: data.items || [],
    });
  } catch (error) {
    console.error('YouTube video details error:', error);
    res.status(500).json({ message: 'Failed to fetch video details', error: error.message });
  }
});

export default router;
