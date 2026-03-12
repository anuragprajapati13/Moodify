/* ===============================
   CONFIG
================================ */

const YT_API_KEY = "AIzaSyBBo042Lu_K2IgVVAe-74W5BW2VBY--7J8";
console.log("Script.js loaded ✅");

/* ===============================
   ELEMENTS
================================ */

const youtubeContainer = document.getElementById("youtubePlayer");
const songGrid = document.getElementById("songGrid");
const searchInput = document.getElementById("search");
const searchSuggestions = document.getElementById("searchSuggestions");
const volumeControl = document.getElementById("volume");
const playPauseBtn = document.getElementById("playPause");
// progressBar removed in favor of beat visual
const beatBars = document.getElementById("beatBars");
const timelineBar = document.getElementById("timelineBar");
const timelineProgress = document.getElementById("timelineProgress");
const timelineThumb = document.getElementById("timelineThumb");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const audioModeBtn = document.getElementById("audioModeBtn");
const videoModeBtn = document.getElementById("videoModeBtn");

const likeBtn = document.getElementById("likeBtn");
const speakerBtn = document.getElementById('speakerBtn');

// speaker button: click toggles slider visibility; right-click toggles mute
if (speakerBtn) {
  speakerBtn.addEventListener('click', (ev) => {
    const wrapper = speakerBtn.closest('.volume-wrapper');
    if (wrapper) wrapper.classList.toggle('open');
  });

  // right-click to mute/unmute quickly
  speakerBtn.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    try {
      if (ytPlayer && typeof ytPlayer.isMuted === 'function' && typeof ytPlayer.mute === 'function') {
        if (ytPlayer.isMuted()) {
          ytPlayer.unMute();
          speakerBtn.innerText = '🔊';
          speakerBtn.classList.remove('muted');
        } else {
          ytPlayer.mute();
          speakerBtn.innerText = '🔈';
          speakerBtn.classList.add('muted');
        }
      } else {
        const muted = speakerBtn.classList.toggle('muted');
        speakerBtn.innerText = muted ? '🔈' : '🔊';
      }
    } catch (e) { console.warn('mute toggle failed', e); }
  });
}

/* ===============================
   STATE
================================ */

let currentMode = "audio";
let ytPlayer = null;
let ytReady = false;
let ytProgressInterval = null;
let playlist = [];
let currentIndex = -1;
let isShuffle = false;
let isRepeat = false;
let consecutiveErrors = 0; // track errors to prevent infinite skip loops
let playbackWatchdogTimer = null;
let playbackAttemptNonce = 0;
let playbackRecoveryDepth = 0;
let currentSearchTerm = "";

const SEARCH_RESULT_TARGET = 150;
const SEARCH_RESULT_LIMIT = 180;
const SEARCH_PAGE_SIZE = 50;
const SEARCH_MAX_PAGES = 4;
const PLAYBACK_START_TIMEOUT_MS = 8000;
const NON_PLAYABLE_YT_ERRORS = new Set([2, 5, 100, 101, 150]);
const SEARCH_SUGGESTION_MIN_CHARS = 3;
const SEARCH_SUGGESTION_LIMIT = 6;
const SEARCH_SUGGESTION_DELAY_MS = 250;

let searchSuggestionTimer = null;
let searchSuggestionNonce = 0;
let activeSuggestionIndex = -1;
let currentSuggestions = [];

/* ===============================
   MOOD SWITCH
================================ */

function setMood(mood) {

  // remove old mood classes
  document.body.classList.remove("happy", "sad", "study", "workout", "romantic", "chill", "party", "rainy", "latenight", "motivation", "angry", "relax", "roadtrip", "lofi", "celebration", "heartbreak", "dance", "morning", "rock");

  // add new mood class
  document.body.classList.add(mood);

  // mood emoji mapping
  const emojiMap = {
    happy: '😄',
    sad: '😢',
    workout: '💪',
    study: '📚',
    romantic: '💖',
    chill: '😎',
    party: '🔥',
    rainy: '🌧️',
    latenight: '🌙',
    motivation: '✨',
    angry: '😡',
    relax: '🧘',
    roadtrip: '🚗',
    lofi: '🎧',
    celebration: '🎉',
    heartbreak: '💔',
    dance: '🕺',
    morning: '🌅',
    rock: '🎸'
  };

  // update banner title with emoji
  const titleEl = document.getElementById("moodTitle");
  if (titleEl) {
    const emoji = emojiMap[mood] || '';
    const title = mood.charAt(0).toUpperCase() + mood.slice(1);
    titleEl.innerText = `${emoji} ${title}`;
  }

  // highlight active sidebar button
  document.querySelectorAll(".sidebar button").forEach(btn => {
    const btnMood = btn.textContent.trim().toLowerCase();
    btn.classList.toggle("active", btnMood.includes(mood));
  });

  console.log("Mood changed to:", mood);

  // trigger a mood-based search if the user hasn't typed anything
  const map = {
    happy: 'happy songs',
    sad: 'sad songs',
    study: 'study music',
    workout: 'workout music',
    romantic: 'romantic songs',
    chill: 'chill music',
    party: 'party songs',
    rainy: 'rainy day music',
    latenight: 'late night music',
    motivation: 'motivational songs',
    angry: 'angry rock music',
    relax: 'relaxing music',
    roadtrip: 'road trip songs',
    lofi: 'lo-fi hip hop',
    celebration: 'celebration songs',
    heartbreak: 'heartbreak songs',
    dance: 'dance music',
    morning: 'morning music',
    rock: 'rock music'
  };
  const q = map[mood] || mood;
  if (searchInput && !searchInput.value) {
    searchYouTube(q);
  }
}

/* ===============================
   MORE BUTTON TOGGLE
================================ */

function toggleMore() {
  const container = document.getElementById('moreMoods');
  const toggleBtn = document.getElementById('toggleMoreBtn');
  if (!container || !toggleBtn) return;
  const isHidden = container.style.display === 'none';
  container.style.display = isHidden ? 'block' : 'none';
  toggleBtn.innerText = isHidden ? 'Show less' : 'See more';
}

/* ===============================
   MODE SWITCH
================================ */

function switchMode(mode) {
  currentMode = mode;

  if (mode === "audio") {
    youtubeContainer.style.display = "none";
    // when switching to audio mode, pause and mute the YouTube player
    try {
      if (ytPlayer) {
        // pause playback so only audio mode (app UI) remains
        if (typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
        if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
        // hide iframe and disable pointer events to avoid hover/stacking issues
        if (typeof ytPlayer.getIframe === 'function') {
          const iframe = ytPlayer.getIframe();
          if (iframe && iframe.style) {
            iframe.style.display = 'none';
            iframe.style.pointerEvents = 'none';
          }
        }
      }
    } catch (e) {}
  } else {
    youtubeContainer.style.display = "block";
    youtubeContainer.style.visibility = "visible";
    youtubeContainer.style.opacity = "1";
    
    // show iframe and restore pointer events
    try {
      if (ytPlayer && typeof ytPlayer.getIframe === 'function') {
        const iframe = ytPlayer.getIframe();
        if (iframe && iframe.style) {
          iframe.style.display = 'block';
          iframe.style.visibility = 'visible';
          iframe.style.opacity = '1';
          iframe.style.pointerEvents = 'auto';
        }
      }
      // unmute
      if (ytPlayer && typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
      
      // delay playback resume to allow DOM to update
      setTimeout(() => {
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
          ytPlayer.playVideo();
          console.log("Video playback resumed");
        }
      }, 100);
    } catch (e) {
      console.error("Error in video mode switch:", e);
    }
  }

  audioModeBtn.classList.toggle("active-mode", mode === "audio");
  videoModeBtn.classList.toggle("active-mode", mode === "video");
}

audioModeBtn.addEventListener("click", () => switchMode("audio"));
videoModeBtn.addEventListener("click", () => switchMode("video"));

/* ===============================
   YOUTUBE PLAYER INIT
================================ */

function initYouTubePlayer() {
  console.log("YouTube API Loaded ✅");

  // guard: don't create multiple players
  if (ytPlayer) return;

  ytPlayer = new YT.Player("youtubePlayer", {
    height: "250",
    width: "100%",
    videoId: "",
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      // include the page origin to avoid postMessage origin mismatch warnings
      origin: window.location && window.location.origin ? window.location.origin : ''
    },
    events: {
      onReady: function () {
        ytReady = true;
        console.log("YouTube Player Ready ✅");
        // apply initial volume
        try {
          const vol = parseFloat(volumeControl.value) || 0.5;
          ytPlayer.setVolume(vol * 100);
        } catch (e) {}
      },
      onStateChange: function (event) {
        if (event.data === YT.PlayerState.PLAYING) {
          clearPlaybackWatchdog();
          playbackRecoveryDepth = 0;
          consecutiveErrors = 0; // reset error counter on successful play
          playPauseBtn.innerText = "⏸";
          startYouTubeProgress();
          // update song name with actual video title
          const info = ytPlayer.getVideoData();
          const titleEl = document.getElementById('songName');
          if (titleEl && info && info.title) {
            titleEl.innerText = info.title;
          }
          // update save button state for current song
          if (typeof updateSaveButtonState === 'function') updateSaveButtonState();
          // make sure video container is visible
          youtubeContainer.style.display = 'block';
        } else if (event.data === YT.PlayerState.PAUSED) {
            playPauseBtn.innerText = "▶";
            if (ytProgressInterval) { clearInterval(ytProgressInterval); ytProgressInterval = null; }
            // reset beat bars to small state
            try {
              const container = beatBars || document.querySelector('.equalizer');
              if (container) {
                container.querySelectorAll('span').forEach(s => { s.style.height = '8px'; s.style.opacity = '0.5'; });
              }
            } catch(e){}
        } else if (event.data === YT.PlayerState.ENDED) {
          clearPlaybackWatchdog();
            // when a video ends, stop beat animation then advance playlist
            if (ytProgressInterval) { clearInterval(ytProgressInterval); ytProgressInterval = null; }
            try {
              const container = beatBars || document.querySelector('.equalizer');
              if (container) container.querySelectorAll('span').forEach(s => { s.style.height = '8px'; s.style.opacity = '0.5'; });
            } catch(e){}
            if (isRepeat) {
              playIndex(currentIndex, { preserveShuffle: true, autoAdvanceDepth: 0 });
            } else {
              nextSong();
            }
        } else if (event.data === YT.PlayerState.BUFFERING) {
            if (currentIndex >= 0) {
              armPlaybackWatchdog(currentIndex, playbackRecoveryDepth);
            }
        } else if (event.data === YT.PlayerState.UNSTARTED || event.data === YT.PlayerState.CUED) {
            if (currentIndex >= 0) {
              armPlaybackWatchdog(currentIndex, playbackRecoveryDepth);
            }
        }
      },
      onError: function(event) {
        console.warn('YouTube player error', event.data);
        // These codes cover unavailable, invalid, or non-playable videos.
        if (NON_PLAYABLE_YT_ERRORS.has(event.data)) {
          consecutiveErrors++;
          console.log('Video unavailable or cannot be embedded - skipping to next (error count:', consecutiveErrors + ')');
          
          // if more than 5 errors in a row, stop skipping to prevent infinite loops
          if (consecutiveErrors > 5) {
            console.warn('Too many consecutive errors, stopping playback');
            clearPlaybackWatchdog();
            ytPlayer.pauseVideo();
            return;
          }
          
          // skip to next playable song
          skipToNextPlayableSong(currentIndex, 'player error', playbackRecoveryDepth);
        } else {
          // reset error counter on other errors
          consecutiveErrors = 0;
        }
      }
    }
  });
}

// Set the global callback used by the YouTube IFrame API
window.onYouTubeIframeAPIReady = initYouTubePlayer;

// If the API already loaded before this script ran, initialize immediately
if (window.YT && window.YT.Player) {
  initYouTubePlayer();
}

/* ===============================
   PLAY / PAUSE
================================ */

playPauseBtn.addEventListener("click", () => {

  if (!ytReady) {
    alert("Player not ready yet");
    return;
  }

  const state = ytPlayer.getPlayerState();

  if (state !== YT.PlayerState.PLAYING) {
    // if nothing loaded, start first track
    if (currentIndex === -1 && playlist.length > 0) {
      playIndex(0);
      return;
    }
    ytPlayer.playVideo();
    ytPlayer.unMute();
  } else {
    ytPlayer.pauseVideo();
  }
});

/* ===============================
   YOUTUBE PROGRESS
================================ */

function startYouTubeProgress() {
  if (ytProgressInterval) clearInterval(ytProgressInterval);
  // animate beat bars while playing
  ytProgressInterval = setInterval(() => {
    try {
      if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
      if (ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING) return;
    } catch (e) { return; }

    // update the timeline duration bar
    updateTimeline();

    const container = beatBars;
    if (!container) return;
    const spans = container.querySelectorAll('span');
    if (!spans || spans.length === 0) return;

    // compute playback fraction and highlight bars up to fraction
    let current = 0, duration = 0;
    try { current = ytPlayer.getCurrentTime(); duration = ytPlayer.getDuration(); } catch(e){}
    const fraction = (duration ? Math.max(0, Math.min(1, current / duration)) : 0);
    const activeCount = Math.floor(fraction * spans.length);

    spans.forEach((s, i) => {
      if (i <= activeCount) {
        // active portion: static fixed-height waveform (no random jitter)
        s.style.height = '14px';
        s.style.opacity = '0.9';
      } else {
        // inactive: small and dim
        s.style.height = '6px';
        s.style.opacity = '0.35';
      }
    });
  }, 180);
}

// ---- Timeline bar update ----
function updateTimeline() {
  if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
  try {
    const current = ytPlayer.getCurrentTime() || 0;
    const duration = ytPlayer.getDuration() || 0;
    if (duration <= 0) return;
    const pct = Math.min(100, (current / duration) * 100);
    if (timelineProgress) timelineProgress.style.width = pct + '%';
    if (timelineThumb) timelineThumb.style.left = pct + '%';
    if (currentTimeEl) currentTimeEl.innerText = formatTime(current);
    if (totalTimeEl) totalTimeEl.innerText = formatTime(duration);
  } catch (e) {}
}

// seek on click / drag
function seekFromEvent(e) {
  if (!timelineBar || !ytPlayer || typeof ytPlayer.getDuration !== 'function') return;
  const rect = timelineBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const fraction = x / rect.width;
  const dur = ytPlayer.getDuration() || 0;
  if (dur) ytPlayer.seekTo(dur * fraction, true);
}

if (timelineBar) {
  let dragging = false;
  timelineBar.addEventListener('mousedown', (e) => { dragging = true; seekFromEvent(e); });
  document.addEventListener('mousemove', (e) => { if (dragging) seekFromEvent(e); });
  document.addEventListener('mouseup', () => { dragging = false; });
  // touch support
  timelineBar.addEventListener('touchstart', (e) => { dragging = true; seekFromEvent(e.touches[0]); }, { passive: true });
  document.addEventListener('touchmove', (e) => { if (dragging) seekFromEvent(e.touches[0]); }, { passive: true });
  document.addEventListener('touchend', () => { dragging = false; });
}

// remove progress bar seek behavior - beat visual is non-interactive

function clearPlaybackWatchdog() {
  if (playbackWatchdogTimer) {
    clearTimeout(playbackWatchdogTimer);
    playbackWatchdogTimer = null;
  }
}

function armPlaybackWatchdog(index, depth = 0) {
  clearPlaybackWatchdog();
  const nonce = ++playbackAttemptNonce;

  playbackWatchdogTimer = setTimeout(() => {
    if (nonce !== playbackAttemptNonce || currentIndex !== index) return;

    let state = null;
    let duration = 0;
    try {
      state = ytPlayer && typeof ytPlayer.getPlayerState === 'function'
        ? ytPlayer.getPlayerState()
        : null;
      duration = ytPlayer && typeof ytPlayer.getDuration === 'function'
        ? ytPlayer.getDuration() || 0
        : 0;
    } catch (e) {
      state = null;
      duration = 0;
    }

    if (state === YT.PlayerState.PLAYING) {
      return;
    }

    if (state === YT.PlayerState.BUFFERING && duration > 0) {
      armPlaybackWatchdog(index, depth);
      return;
    }

    console.warn('Song did not start playing in time, skipping to next playable song');
    skipToNextPlayableSong(index, 'playback timeout', depth);
  }, PLAYBACK_START_TIMEOUT_MS);
}

function getNextPlayableIndex(failedIndex) {
  if (!playlist || playlist.length === 0) return -1;

  if (isShuffle) {
    if (playlist.length === 1) return failedIndex;
    let nextIndex = failedIndex;
    let attempts = 0;
    while (nextIndex === failedIndex && attempts < 10) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      attempts++;
    }
    return nextIndex;
  }

  if (failedIndex < playlist.length - 1) return failedIndex + 1;
  if (isRepeat) return 0;
  return -1;
}

function skipToNextPlayableSong(failedIndex, reason, depth = 0) {
  clearPlaybackWatchdog();

  if (!playlist || playlist.length === 0) return;
  if (depth >= playlist.length - 1) {
    const titleEl = document.getElementById('songName');
    if (titleEl) titleEl.innerText = 'No playable songs found';
    try {
      if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
    } catch (e) {}
    return;
  }

  const nextIndex = getNextPlayableIndex(failedIndex);
  if (nextIndex === -1 || nextIndex === failedIndex) {
    const titleEl = document.getElementById('songName');
    if (titleEl) titleEl.innerText = 'No more playable songs';
    try {
      if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
    } catch (e) {}
    return;
  }

  console.warn(`Skipping track at index ${failedIndex} due to ${reason}. Trying ${nextIndex} instead.`);
  playIndex(nextIndex, { preserveShuffle: true, autoAdvanceDepth: depth + 1 });
}


// Play a specific index from the playlist
function playIndex(index, options = {}) {
  if (!playlist || playlist.length === 0) return;
  if (index < 0) index = 0;
  if (index >= playlist.length) index = playlist.length - 1;

  // user explicitly picked a track: turn off shuffle
  if (!options.preserveShuffle) {
    isShuffle = false;
  }

  const id = playlist[index];
  currentIndex = index;
  playbackRecoveryDepth = options.autoAdvanceDepth || 0;
  if (!ytReady) {
    alert('Player not ready yet');
    return;
  }

  switchMode('video');
  // show loading placeholder then update title later
  const titleEl = document.getElementById('songName');
  if (titleEl) {
    titleEl.innerText = 'Loading...';
  }

  clearPlaybackWatchdog();
  ytPlayer.loadVideoById(id);
  armPlaybackWatchdog(index, playbackRecoveryDepth);
  // ensure container remains visible while video loads
  youtubeContainer.style.display = 'block';
  setTimeout(() => ytPlayer.unMute(), 300);
}

function prevSong() {
  if (!playlist || playlist.length === 0) return;
  if (isShuffle) {
    const idx = Math.floor(Math.random() * playlist.length);
    playIndex(idx, { preserveShuffle: true, autoAdvanceDepth: 0 });
    return;
  }
  const prev = currentIndex > 0 ? currentIndex - 1 : (isRepeat ? currentIndex : 0);
  playIndex(prev, { preserveShuffle: true, autoAdvanceDepth: 0 });
}

function nextSong() {
  if (!playlist || playlist.length === 0) return;
  if (isShuffle) {
    const idx = Math.floor(Math.random() * playlist.length);
    playIndex(idx, { preserveShuffle: true, autoAdvanceDepth: 0 });
    return;
  }
  const next = currentIndex < playlist.length - 1 ? currentIndex + 1 : (isRepeat ? 0 : -1);
  if (next === -1) {
    // no more songs
    clearPlaybackWatchdog();
    ytPlayer.pauseVideo();
    return;
  }
  playIndex(next, { preserveShuffle: true, autoAdvanceDepth: 0 });
}

function shuffleSong() {
  isShuffle = !isShuffle;
  const btn = document.getElementById('shuffleBtn');
  if (btn) btn.classList.toggle('active-mode', isShuffle);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  const btn = document.getElementById('repeatBtn');
  if (btn) btn.classList.toggle('active-mode', isRepeat);
}

// like button toggle
if (likeBtn) {
  likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('liked');
  });
}

/* ===============================
   FORMAT TIME
================================ */

function formatTime(sec) {
  if (!sec) return "0:00";
  let m = Math.floor(sec / 60);
  let s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/* ===============================
   VOLUME CONTROL
================================ */

volumeControl.addEventListener("input", function () {
  if (!ytPlayer) return;
  ytPlayer.setVolume(this.value * 100);
  try {
    if (this.value > 0 && speakerBtn) { speakerBtn.innerText = '🔊'; speakerBtn.classList.remove('muted'); }
    if (this.value == 0 && speakerBtn) { speakerBtn.innerText = '🔈'; speakerBtn.classList.add('muted'); }
  } catch(e){}
});

// build a timeline-style wave (many bars) and make it interactive
function buildBeatBars(count = 60) {
  if (!beatBars) return;
  beatBars.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'bar';
    s.dataset.index = i;
    s.style.height = (6 + Math.floor(Math.random() * 12)) + 'px';
    beatBars.appendChild(s);
  }
}

// click on timeline to seek
if (beatBars) {
  beatBars.addEventListener('click', function (e) {
    const target = e.target.closest('span');
    if (!target) return;
    const idx = parseInt(target.dataset.index, 10);
    const bars = beatBars.querySelectorAll('span').length || 1;
    const fraction = (idx + 0.5) / bars;
    try {
      const dur = ytPlayer && typeof ytPlayer.getDuration === 'function' ? ytPlayer.getDuration() : 0;
      if (dur) {
        const t = dur * fraction;
        if (ytPlayer && typeof ytPlayer.seekTo === 'function') ytPlayer.seekTo(t, true);
      }
    } catch (e) {}
  });
}

/* ===============================
   YOUTUBE SEARCH
================================ */

// fetch from YouTube search, accumulating multiple pages until we reach the target count
async function searchYouTube(query) {
  const rawQuery = (query || "").trim();
  if (!rawQuery) return;

  const normalizedQuery = normalizeSearchQuery(rawQuery);
  currentSearchTerm = rawQuery;

  let allItems = [];
  const seenVideoIds = new Set();
  let nextPageToken = null;
  let attempts = 0;
  let data = null; // declare at function scope to avoid undefined reference

  songGrid.innerHTML = `<p class="empty">Loading songs for "${escapeHtml(rawQuery)}"...</p>`;

  try {
    do {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('type', 'video');
      url.searchParams.set('videoEmbeddable', 'true');
      url.searchParams.set('videoCategoryId', '10');
      url.searchParams.set('order', 'relevance');
      url.searchParams.set('maxResults', String(SEARCH_PAGE_SIZE));
      url.searchParams.set('q', normalizedQuery);
      url.searchParams.set('key', YT_API_KEY);
      if (nextPageToken) url.searchParams.set('pageToken', nextPageToken);

      const resp = await fetch(url);
      if (!resp.ok) {
        const text = await resp.text();
        let body = text;
        try { body = JSON.parse(text); } catch(e) {}
        console.error('YouTube API error:', resp.status, resp.statusText, body);
        console.error('YouTube request URL:', url.toString());

        // present a clearer message in the UI for common cases and include error details for debugging
        if (resp.status === 403 || (body && body.error && body.error.code === 403)) {
          const msg = (body && body.error && body.error.message) || resp.statusText || 'Access denied';
          songGrid.innerHTML = `<p class="empty">YouTube API error (403): ${msg}. Check API key, quota, and referrer restrictions.</p>`;
        } else if (resp.status === 400) {
          const msg = (body && body.error && body.error.message) || resp.statusText;
          const details = (body && body.error && body.error.errors) ? JSON.stringify(body.error.errors) : '';
          songGrid.innerHTML = `<p class="empty">YouTube API error (400): ${msg}. ${details ? 'Details: ' + details : ''}</p>`;
        } else {
          songGrid.innerHTML = `<p class="empty">YouTube API error: ${resp.status} ${resp.statusText}. See console for details.</p>`;
        }
        return;
      }

      data = await resp.json();
      if (!data.items) break;

      data.items.forEach(item => {
        const videoId = item && item.id && item.id.videoId;
        if (!videoId || seenVideoIds.has(videoId)) return;
        seenVideoIds.add(videoId);
        allItems.push(item);
      });

      nextPageToken = data.nextPageToken;
      attempts++;
    } while (allItems.length < SEARCH_RESULT_TARGET && nextPageToken && attempts < SEARCH_MAX_PAGES);

    // if YouTube returned nothing, log and update UI
    if (allItems.length === 0) {
      console.warn('searchYouTube: received zero items', data);
      songGrid.innerHTML = `<p class="empty">No songs found for "${escapeHtml(rawQuery)}"</p>`;
      return;
    }

    displaySearchResults(allItems, rawQuery);
  } catch (err) {
    console.error('searchYouTube error:', err);
    songGrid.innerHTML = `<p class="empty">Error loading songs. Check console.</p>`;
  }
}

function displaySearchResults(videos, query = "") {

  songGrid.innerHTML = "";

  // rebuild playlist from valid videos
  playlist = [];
  currentIndex = -1;
  // collect ids and map for later lookup
  const idList = [];
  const videoMap = {};
  videos.forEach(video => {
    if (!video.id || !video.id.videoId) return;
    const id = video.id.videoId;
    idList.push(id);
    videoMap[id] = video;
  });

  // fetch durations then filter out short videos, shuffle, and render cards
  fetchVideoDurations(idList).then(durationsMap => {
    // build array of video objects that meet duration requirement
    let items = idList.map(id => {
      const source = videoMap[id] || {};
      const snippet = source.snippet || {};
      return {
        id,
        title: snippet.title || 'Unknown',
        description: snippet.description || '',
        channelTitle: snippet.channelTitle || '',
        thumbnail: (snippet.thumbnails && (snippet.thumbnails.medium || snippet.thumbnails.default) && (snippet.thumbnails.medium || snippet.thumbnails.default).url) || '',
        durationSec: durationsMap[id] || 0,
        score: scoreVideoMatch(snippet, query)
      };
    }).filter(it => it.durationSec >= 60 && it.durationSec <= 900);

    if (items.length === 0) {
      songGrid.innerHTML = `<p class="empty">No songs found for "${escapeHtml(query || currentSearchTerm)}"</p>`;
      return;
    }

    items.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.durationSec !== b.durationSec) return a.durationSec - b.durationSec;
      return a.title.localeCompare(b.title);
    });
    items = items.slice(0, SEARCH_RESULT_LIMIT);

    // rebuild playlist from ranked items
    playlist = items.map(it => it.id);
    currentIndex = -1;

    // render cards in ranked order
    items.forEach((it, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div style="position:relative">
          <img src="${it.thumbnail}" style="width:100%; border-radius:10px; display:block;">
          <span style="position:absolute; right:8px; top:8px; background:rgba(0,0,0,0.7); color:#fff; padding:4px 6px; border-radius:6px; font-size:12px">${formatTime(it.durationSec)}</span>
        </div>
        <h4>${it.title}</h4>
      `;
      card.onclick = () => playIndex(idx, { preserveShuffle: false, autoAdvanceDepth: 0 });
      songGrid.appendChild(card);
    });
  }).catch(err => {
    console.error('Failed to fetch video durations', err);
    // fallback: render without durations but still shuffle
    let fallback = idList.map(id => {
      const source = videoMap[id] || {};
      const snippet = source.snippet || {};
      return {
        id,
        title: snippet.title || 'Unknown',
        thumbnail: (snippet.thumbnails && snippet.thumbnails.medium && snippet.thumbnails.medium.url) || '',
        score: scoreVideoMatch(snippet, query)
      };
    });
    if (fallback.length === 0) {
      songGrid.innerHTML = `<p class="empty">No songs found for "${escapeHtml(query || currentSearchTerm)}"</p>`;
      return;
    }
    fallback.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.title.localeCompare(b.title);
    });
    fallback = fallback.slice(0, SEARCH_RESULT_LIMIT);
    playlist = fallback.map(it => it.id);
    currentIndex = -1;
    fallback.forEach((it, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${it.thumbnail}" style="width:100%; border-radius:10px;">
        <h4>${it.title}</h4>
      `;
      card.onclick = () => playIndex(idx, { preserveShuffle: false, autoAdvanceDepth: 0 });
      songGrid.appendChild(card);
    });
  });
}

// Fisher-Yates shuffle for arrays (in-place)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

// fetch durations for a list of video IDs using YouTube Videos API
async function fetchVideoDurations(ids) {
  if (!ids || ids.length === 0) return {};

  const map = {};

  for (let index = 0; index < ids.length; index += 50) {
    const chunk = ids.slice(index, index + 50).join(",");
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${YT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items) continue;
    data.items.forEach(item => {
      const id = item.id;
      const iso = item.contentDetails && item.contentDetails.duration;
      map[id] = parseISO8601Duration(iso);
    });
  }

  return map;
}

function normalizeSearchQuery(query) {
  const trimmed = query.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';

  const lowered = trimmed.toLowerCase();
  const hasMusicIntent = /\b(song|songs|music|audio|playlist|album|track|mix|lofi|lo-fi)\b/.test(lowered);
  return hasMusicIntent ? trimmed : `${trimmed} songs music`;
}

function tokenizeSearchTerm(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreVideoMatch(snippet, query) {
  const title = ((snippet && snippet.title) || '').toLowerCase();
  const description = ((snippet && snippet.description) || '').toLowerCase();
  const channelTitle = ((snippet && snippet.channelTitle) || '').toLowerCase();
  const normalizedQuery = (query || '').trim().toLowerCase();
  const tokens = tokenizeSearchTerm(query || '');
  let score = 0;

  if (!title) return score;

  if (normalizedQuery && title.includes(normalizedQuery)) score += 120;
  if (normalizedQuery && channelTitle.includes(normalizedQuery)) score += 30;

  tokens.forEach(token => {
    if (title.includes(token)) score += 25;
    if (channelTitle.includes(token)) score += 8;
    if (description.includes(token)) score += 4;
  });

  if (/\b(song|music|audio|lyrics|official|video)\b/.test(title)) score += 6;
  if (/\b(live|podcast|interview|reaction|shorts|status|teaser)\b/.test(title)) score -= 20;

  return score;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showSuggestions(items) {
  if (!searchSuggestions) return;

  currentSuggestions = items;
  activeSuggestionIndex = -1;

  if (!items.length) {
    hideSuggestions();
    return;
  }

  searchSuggestions.innerHTML = items.map((item, index) => `
    <div class="search-suggestion-item" data-index="${index}" data-value="${escapeHtml(item.value)}">
      ${escapeHtml(item.label)}
      ${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ''}
    </div>
  `).join('');

  searchSuggestions.classList.add('show');
}

function hideSuggestions() {
  if (!searchSuggestions) return;
  searchSuggestions.classList.remove('show');
  searchSuggestions.innerHTML = '';
  currentSuggestions = [];
  activeSuggestionIndex = -1;
}

function updateActiveSuggestion(nextIndex) {
  if (!searchSuggestions || currentSuggestions.length === 0) return;

  const items = searchSuggestions.querySelectorAll('.search-suggestion-item');
  items.forEach((item, index) => {
    item.classList.toggle('active', index === nextIndex);
  });
  activeSuggestionIndex = nextIndex;
}

function applySuggestion(value) {
  if (!searchInput) return;
  searchInput.value = value;
  hideSuggestions();
  submitSearchQuery(value);
}

function submitSearchQuery(value) {
  const query = (value || '').trim();
  if (!query) return;
  switchMode('video');
  hideSuggestions();
  searchYouTube(query);
}

function buildStaticSuggestions(query) {
  const clean = query.trim();
  if (!clean) return [];

  const variants = [
    `${clean} songs`,
    `${clean} latest songs`,
    `${clean} playlist`,
    `${clean} romantic songs`,
    `${clean} trending songs`
  ];

  return variants.map(value => ({
    value,
    label: value,
    meta: 'Quick suggestion'
  }));
}

async function fetchSearchSuggestions(query) {
  const trimmed = (query || '').trim();
  if (trimmed.length < SEARCH_SUGGESTION_MIN_CHARS) {
    hideSuggestions();
    return;
  }

  const requestNonce = ++searchSuggestionNonce;
  const normalizedQuery = normalizeSearchQuery(trimmed);
  const suggestionsMap = new Map();

  buildStaticSuggestions(trimmed).forEach(item => {
    suggestionsMap.set(item.value.toLowerCase(), item);
  });

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoCategoryId', '10');
    url.searchParams.set('order', 'relevance');
    url.searchParams.set('maxResults', String(SEARCH_SUGGESTION_LIMIT));
    url.searchParams.set('q', normalizedQuery);
    url.searchParams.set('key', YT_API_KEY);

    const response = await fetch(url);
    if (!response.ok) {
      hideSuggestions();
      return;
    }

    const data = await response.json();
    if (requestNonce !== searchSuggestionNonce) return;

    (data.items || []).forEach(item => {
      const snippet = item && item.snippet ? item.snippet : {};
      const title = (snippet.title || '').trim();
      const channel = (snippet.channelTitle || '').trim();
      if (!title) return;

      const key = title.toLowerCase();
      if (!suggestionsMap.has(key)) {
        suggestionsMap.set(key, {
          value: title,
          label: title,
          meta: channel || 'Related song'
        });
      }
    });

    const suggestions = Array.from(suggestionsMap.values()).slice(0, SEARCH_SUGGESTION_LIMIT + 2);
    if (requestNonce === searchSuggestionNonce && searchInput && searchInput.value.trim() === trimmed) {
      showSuggestions(suggestions);
    }
  } catch (error) {
    console.warn('Suggestion fetch failed', error);
    if (requestNonce === searchSuggestionNonce) {
      const fallback = buildStaticSuggestions(trimmed).slice(0, SEARCH_SUGGESTION_LIMIT);
      showSuggestions(fallback);
    }
  }
}

// parse ISO 8601 duration (PT#H#M#S) into seconds
function parseISO8601Duration(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/* ===============================
   SEARCH INPUT
================================ */

if (searchInput) {
  searchInput.addEventListener('input', function () {
    const query = this.value.trim();

    if (searchSuggestionTimer) {
      clearTimeout(searchSuggestionTimer);
      searchSuggestionTimer = null;
    }

    if (query.length < SEARCH_SUGGESTION_MIN_CHARS) {
      searchSuggestionNonce++;
      hideSuggestions();
      return;
    }

    searchSuggestionTimer = setTimeout(() => {
      fetchSearchSuggestions(query);
    }, SEARCH_SUGGESTION_DELAY_MS);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' && currentSuggestions.length > 0) {
      e.preventDefault();
      const nextIndex = activeSuggestionIndex < currentSuggestions.length - 1 ? activeSuggestionIndex + 1 : 0;
      updateActiveSuggestion(nextIndex);
      return;
    }

    if (e.key === 'ArrowUp' && currentSuggestions.length > 0) {
      e.preventDefault();
      const nextIndex = activeSuggestionIndex > 0 ? activeSuggestionIndex - 1 : currentSuggestions.length - 1;
      updateActiveSuggestion(nextIndex);
      return;
    }

    if (e.key === 'Escape') {
      hideSuggestions();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && currentSuggestions[activeSuggestionIndex]) {
        applySuggestion(currentSuggestions[activeSuggestionIndex].value);
        return;
      }
      submitSearchQuery(this.value);
    }
  });
}

if (searchSuggestions) {
  searchSuggestions.addEventListener('mousedown', function (e) {
    const item = e.target.closest('.search-suggestion-item');
    if (!item) return;
    e.preventDefault();
    const index = Number(item.dataset.index);
    if (Number.isNaN(index) || !currentSuggestions[index]) return;
    applySuggestion(currentSuggestions[index].value);
  });
}

document.addEventListener('click', function (e) {
  if (!searchInput || !searchSuggestions) return;
  if (e.target === searchInput || searchSuggestions.contains(e.target)) return;
  hideSuggestions();
});
/* ===============================
   INIT
================================ */

window.onload = () => {
  youtubeContainer.style.display = "none";
  setMood("happy"); // default mood
  // set default volume slider value
  try { volumeControl.value = 0.5; } catch(e){}
  // build the timeline wave
  try { buildBeatBars(60); } catch(e){}
  // load a large set of popular songs and shuffle order on every page load
  try {
    searchYouTube('popular songs');
  } catch (e) {
    console.warn('Failed to auto-load songs on start', e);
  }
};
