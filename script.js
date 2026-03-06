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
            // when a video ends, stop beat animation then advance playlist
            if (ytProgressInterval) { clearInterval(ytProgressInterval); ytProgressInterval = null; }
            try {
              const container = beatBars || document.querySelector('.equalizer');
              if (container) container.querySelectorAll('span').forEach(s => { s.style.height = '8px'; s.style.opacity = '0.5'; });
            } catch(e){}
            if (isRepeat) {
              playIndex(currentIndex);
            } else {
              nextSong();
            }
        }
      },
      onError: function(event) {
        console.warn('YouTube player error', event.data);
        // error codes 100, 101, 150 mean video unavailable/embedding forbidden
        if ([100,101,150].includes(event.data)) {
          consecutiveErrors++;
          console.log('Video unavailable or cannot be embedded - skipping to next (error count:', consecutiveErrors + ')');
          
          // if more than 5 errors in a row, stop skipping to prevent infinite loops
          if (consecutiveErrors > 5) {
            console.warn('Too many consecutive errors, stopping playback');
            ytPlayer.pauseVideo();
            return;
          }
          
          // skip to next song
          nextSong();
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


// Play a specific index from the playlist
function playIndex(index) {
  if (!playlist || playlist.length === 0) return;
  if (index < 0) index = 0;
  if (index >= playlist.length) index = playlist.length - 1;

  // user explicitly picked a track: turn off shuffle
  isShuffle = false;

  const id = playlist[index];
  currentIndex = index;
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

  ytPlayer.loadVideoById(id);
  // ensure container remains visible while video loads
  youtubeContainer.style.display = 'block';
  setTimeout(() => ytPlayer.unMute(), 300);
}

function prevSong() {
  if (!playlist || playlist.length === 0) return;
  if (isShuffle) {
    const idx = Math.floor(Math.random() * playlist.length);
    playIndex(idx);
    return;
  }
  const prev = currentIndex > 0 ? currentIndex - 1 : (isRepeat ? currentIndex : 0);
  playIndex(prev);
}

function nextSong() {
  if (!playlist || playlist.length === 0) return;
  if (isShuffle) {
    const idx = Math.floor(Math.random() * playlist.length);
    playIndex(idx);
    return;
  }
  const next = currentIndex < playlist.length - 1 ? currentIndex + 1 : (isRepeat ? 0 : -1);
  if (next === -1) {
    // no more songs
    ytPlayer.pauseVideo();
    return;
  }
  playIndex(next);
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
  if (!query) return;

  const desired = 120; // aim for at least this many videos
  let allItems = [];
  let nextPageToken = null;
  let attempts = 0;
  let data = null; // declare at function scope to avoid undefined reference
  try {
    do {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('type', 'video');
      url.searchParams.set('videoEmbeddable', 'true');
      url.searchParams.set('maxResults', '50');
      url.searchParams.set('q', query);
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
      allItems = allItems.concat(data.items);
      nextPageToken = data.nextPageToken;
      attempts++;
    } while (allItems.length < desired && nextPageToken && attempts < 5);

    // if YouTube returned nothing, log and update UI
    if (allItems.length === 0) {
      console.warn('searchYouTube: received zero items', data);
      songGrid.innerHTML = `<p class="empty">No songs available at the moment</p>`;
      return;
    }

    displaySearchResults(allItems);
  } catch (err) {
    console.error('searchYouTube error:', err);
    songGrid.innerHTML = `<p class="empty">Error loading songs. Check console.</p>`;
  }
}

function displaySearchResults(videos) {

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
      return {
        id,
        title: (videoMap[id] && videoMap[id].snippet && videoMap[id].snippet.title) || 'Unknown',
        thumbnail: (videoMap[id] && videoMap[id].snippet && videoMap[id].snippet.thumbnails && (videoMap[id].snippet.thumbnails.medium || videoMap[id].snippet.thumbnails.default) && (videoMap[id].snippet.thumbnails.medium || videoMap[id].snippet.thumbnails.default).url) || '',
        durationSec: durationsMap[id] || 0
      };
    }).filter(it => it.durationSec >= 60);

    if (items.length === 0) {
      songGrid.innerHTML = `<p class="empty">No songs available at the moment</p>`;
      return;
    }

    // shuffle the items so each page load shows a different order
    shuffleArray(items);

    // rebuild playlist from shuffled items
    playlist = items.map(it => it.id);
    currentIndex = -1;

    // render cards in shuffled order
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
      card.onclick = () => playIndex(idx);
      songGrid.appendChild(card);
    });
  }).catch(err => {
    console.error('Failed to fetch video durations', err);
    // fallback: render without durations but still shuffle
    const fallback = idList.map(id => ({ id, title: (videoMap[id] && videoMap[id].snippet && videoMap[id].snippet.title) || 'Unknown', thumbnail: (videoMap[id] && videoMap[id].snippet && videoMap[id].snippet.thumbnails && videoMap[id].snippet.thumbnails.medium && videoMap[id].snippet.thumbnails.medium.url) || '' }));
    if (fallback.length === 0) {
      songGrid.innerHTML = `<p class="empty">No songs available at the moment</p>`;
      return;
    }
    shuffleArray(fallback);
    playlist = fallback.map(it => it.id);
    currentIndex = -1;
    fallback.forEach((it, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${it.thumbnail}" style="width:100%; border-radius:10px;">
        <h4>${it.title}</h4>
      `;
      card.onclick = () => playIndex(idx);
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

  const chunk = ids.slice(0, 50).join(",");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk}&key=${YT_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const map = {};
  if (!data.items) return map;
  data.items.forEach(item => {
    const id = item.id;
    const iso = item.contentDetails && item.contentDetails.duration;
    map[id] = parseISO8601Duration(iso);
  });
  return map;
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

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    switchMode("video");
    searchYouTube(this.value);
  }
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
