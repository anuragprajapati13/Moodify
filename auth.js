/* ===============================
   AUTH – Moodify Pro
   Handles login session
================================ */

const AUTH_API_BASE = resolveApiBase();

function resolveApiBase() {
  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    if (window.location.port === '5000') {
      return window.location.origin;
    }

    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return 'http://localhost:5000';
}

function isPublicRoute(pathname) {
  return pathname.includes('Login')
    || pathname.includes('signup')
    || pathname.includes('reset');
}

function clearStoredSession() {
  localStorage.removeItem('moodify_token');
  localStorage.removeItem('moodify_user');
}

function redirectToLogin() {
  if (!isPublicRoute(window.location.pathname)) {
    window.location.href = 'Login/index.html';
  }
}

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('moodify_user') || '{}');
  } catch {
    return {};
  }
}

function renderAuthenticatedUser(user) {
  const navLoginBtn = document.getElementById('navLoginBtn');
  const navUserArea = document.getElementById('navUserArea');

  if (navLoginBtn) navLoginBtn.style.display = 'none';
  if (navUserArea) navUserArea.style.display = 'flex';

  const userName = user.name || (user.email ? user.email.split('@')[0] : 'User');
  const firstLetter = userName.charAt(0).toUpperCase();

  const avatarLetter = document.getElementById('avatarLetter');
  if (avatarLetter) avatarLetter.textContent = firstLetter;

  const profileDropdownName = document.getElementById('profileDropdownName');
  if (profileDropdownName) profileDropdownName.textContent = userName;

  const profileDropdownEmail = document.getElementById('profileDropdownEmail');
  if (profileDropdownEmail) profileDropdownEmail.textContent = user.email || '';

  const dropdownAvatarLetter = document.getElementById('dropdownAvatarLetter');
  if (dropdownAvatarLetter) dropdownAvatarLetter.textContent = firstLetter;

  const modalAvatarLetter = document.getElementById('profileModalAvatarLetter');
  if (modalAvatarLetter) modalAvatarLetter.textContent = firstLetter;

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.innerHTML = '<span id="avatarLetter" class="avatar-letter"></span>';
    const fallbackLetter = document.getElementById('avatarLetter');
    if (fallbackLetter) fallbackLetter.textContent = firstLetter;
  }
}

function renderLoggedOutState() {
  const navLoginBtn = document.getElementById('navLoginBtn');
  const navUserArea = document.getElementById('navUserArea');

  if (navLoginBtn) navLoginBtn.style.display = 'inline-block';
  if (navUserArea) navUserArea.style.display = 'none';

  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.innerHTML = '<span id="avatarLetter" class="avatar-letter">U</span>';
  }
}

async function syncAuthSession(token) {
  try {
    const res = await fetch(`${AUTH_API_BASE}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      clearStoredSession();
      renderLoggedOutState();
      redirectToLogin();
      return null;
    }

    if (!res.ok) {
      return readStoredUser();
    }

    const data = await res.json();
    const user = data.user || {};
    localStorage.setItem('moodify_user', JSON.stringify(user));
    renderAuthenticatedUser(user);
    return user;
  } catch (error) {
    console.warn('Profile sync failed:', error);
    return readStoredUser();
  }
}

(function initAuth() {
  const token = localStorage.getItem('moodify_token');

  if (!token) {
    renderLoggedOutState();
    redirectToLogin();
    return;
  }

  renderAuthenticatedUser(readStoredUser());
  syncAuthSession(token);
})();


/* ===============================
   LOGOUT FUNCTION
================================ */

function logoutUser() {

  clearStoredSession();

  // redirect to login page
  window.location.href = "Login/index.html";

}

/* ===============================
   PROFILE DROPDOWN
================================ */

(function initProfileDropdown() {
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const profileDropdownEmail = document.getElementById('profileDropdownEmail');

  if (!profileBtn || !profileDropdown) return;

  // Set name & email in dropdown header
  const user = readStoredUser();
  const userName = user.name || (user.email ? user.email.split('@')[0] : 'User');
  const firstLetter = userName.charAt(0).toUpperCase();

  const profileDropdownName = document.getElementById('profileDropdownName');
  if (profileDropdownName) profileDropdownName.textContent = userName;
  if (profileDropdownEmail) profileDropdownEmail.textContent = user.email || '';

  const dropdownAvatarLetter = document.getElementById('dropdownAvatarLetter');
  if (dropdownAvatarLetter) dropdownAvatarLetter.textContent = firstLetter;

  // Toggle dropdown on click
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
    // Close notification dropdown if open
    const nd = document.getElementById('notifDropdown');
    if (nd) nd.classList.remove('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
      profileDropdown.classList.remove('show');
    }
  });
})();

function toggleSettingsSubmenu() {
  const submenu = document.getElementById('settingsSubmenu');
  const arrows = document.querySelectorAll('.dropdown-arrow');
  if (submenu) {
    submenu.classList.toggle('show');
    arrows.forEach(a => a.classList.toggle('rotated', submenu.classList.contains('show')));
  }
}

/* ===============================
   PROFILE MODAL
================================ */

function openProfile() {
  const overlay = document.getElementById('profileOverlay');
  const nameEl = document.getElementById('profileModalName');
  const emailEl = document.getElementById('profileModalEmail');
  const avatarEl = document.getElementById('profileModalAvatarLetter');
  const user = readStoredUser();
  const userName = user.name || (user.email ? user.email.split('@')[0] : 'User');

  if (nameEl) nameEl.textContent = userName;
  if (emailEl) emailEl.textContent = user.email || '';

  if (avatarEl) {
    avatarEl.textContent = userName.charAt(0).toUpperCase();
  }

  if (overlay) overlay.classList.add('show');

  // close profile dropdown
  const dd = document.getElementById('profileDropdown');
  if (dd) dd.classList.remove('show');
}

function closeProfile() {
  const overlay = document.getElementById('profileOverlay');
  if (overlay) overlay.classList.remove('show');
}

/* ===============================
   SAVED MUSIC
================================ */

function getSavedSongs() {
  try {
    return JSON.parse(localStorage.getItem('moodify_saved_songs') || '[]');
  } catch { return []; }
}

function saveSongsToStorage(songs) {
  localStorage.setItem('moodify_saved_songs', JSON.stringify(songs));
}

function toggleSaveSong() {
  const btn = document.getElementById('saveSongBtn');
  if (!btn) return;

  // Get current song info from the player
  const songNameEl = document.getElementById('songName');
  const songTitle = songNameEl ? songNameEl.textContent : '';
  if (!songTitle || songTitle === 'No Song Playing') {
    return;
  }

  let saved = getSavedSongs();
  const existingIndex = saved.findIndex(s => s.title === songTitle);

  if (existingIndex !== -1) {
    // Already saved → remove it
    saved.splice(existingIndex, 1);
    btn.classList.remove('saved');
  } else {
    // Save new song
    // Try to get videoId from current playlist state
    const videoId = (typeof currentIndex !== 'undefined' && typeof playlist !== 'undefined' && playlist[currentIndex])
      ? playlist[currentIndex].videoId : '';
    const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/default.jpg` : '';

    saved.push({ title: songTitle, videoId: videoId, thumbnail: thumb });
    btn.classList.add('saved');
    // Brief animation reset for toast
    setTimeout(() => btn.classList.remove('saved'), 1600);
    btn.classList.add('saved');
  }

  saveSongsToStorage(saved);
}

function updateSaveButtonState() {
  const btn = document.getElementById('saveSongBtn');
  const songNameEl = document.getElementById('songName');
  if (!btn || !songNameEl) return;

  const songTitle = songNameEl.textContent;
  const saved = getSavedSongs();
  const isSaved = saved.some(s => s.title === songTitle);
  btn.classList.toggle('saved', isSaved);
}

function openSavedMusic() {
  const overlay = document.getElementById('savedMusicOverlay');
  const listEl = document.getElementById('savedMusicList');
  if (!overlay || !listEl) return;

  const saved = getSavedSongs();

  if (saved.length === 0) {
    listEl.innerHTML = '<p class="saved-empty-msg">No saved songs yet. Click the bookmark icon on the player to save songs!</p>';
  } else {
    listEl.innerHTML = saved.map((song, i) => `
      <div class="saved-song-item" onclick="playSavedSong(${i})">
        <img class="saved-song-thumb" src="${song.thumbnail || ''}" alt="" onerror="this.style.display='none'">
        <div class="saved-song-info">
          <div class="saved-song-title">${song.title}</div>
        </div>
        <button class="saved-song-remove" onclick="event.stopPropagation(); removeSavedSong(${i})" title="Remove">&times;</button>
      </div>
    `).join('');
  }

  overlay.classList.add('show');
  // close profile dropdown
  const dd = document.getElementById('profileDropdown');
  if (dd) dd.classList.remove('show');
}

function closeSavedMusic() {
  const overlay = document.getElementById('savedMusicOverlay');
  if (overlay) overlay.classList.remove('show');
}

function removeSavedSong(index) {
  let saved = getSavedSongs();
  saved.splice(index, 1);
  saveSongsToStorage(saved);
  openSavedMusic(); // re-render list
  updateSaveButtonState();
}

function playSavedSong(index) {
  const saved = getSavedSongs();
  const song = saved[index];
  if (!song || !song.videoId) return;

  closeSavedMusic();

  // Use the existing playSong function from script.js if available
  if (typeof playSong === 'function') {
    // Reconstruct a minimal playlist entry and play
    playlist = [{ videoId: song.videoId, title: song.title }];
    currentIndex = 0;
    playSong(0);
  } else if (typeof ytPlayer !== 'undefined' && ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    ytPlayer.loadVideoById(song.videoId);
    const songNameEl = document.getElementById('songName');
    if (songNameEl) songNameEl.textContent = song.title;
  }
}

// Close overlays when clicking outside modal
document.addEventListener('click', (e) => {
  const savedOverlay = document.getElementById('savedMusicOverlay');
  const profileOvly = document.getElementById('profileOverlay');

  if (savedOverlay && e.target === savedOverlay) {
    savedOverlay.classList.remove('show');
  }
  if (profileOvly && e.target === profileOvly) {
    profileOvly.classList.remove('show');
  }
});

// Attach save button click
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveSongBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', toggleSaveSong);
  }
});

/* ===============================
   NOTIFICATIONS – Latest Songs
================================ */

(function initNotifications() {
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifBadge = document.getElementById('notifBadge');
  const notifList = document.getElementById('notifList');

  if (!notifBtn || !notifDropdown) return;

  // Toggle dropdown
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle('show');
    // Close profile dropdown if open
    const pdd = document.getElementById('profileDropdown');
    if (pdd) pdd.classList.remove('show');
    // Mark as read
    if (notifBadge) {
      notifBadge.textContent = '0';
      notifBadge.setAttribute('data-count', '0');
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
      notifDropdown.classList.remove('show');
    }
  });

  // Fetch latest songs for notifications
  fetchLatestSongsNotifications();

  function fetchLatestSongsNotifications() {
    const API_KEY = typeof YT_API_KEY !== 'undefined' ? YT_API_KEY : 'AIzaSyBBo042Lu_K2IgVVAe-74W5BW2VBY--7J8';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&order=date&maxResults=8&q=latest+trending+songs+2026&key=${encodeURIComponent(API_KEY)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.items || data.items.length === 0) {
          notifList.innerHTML = '<div class="notif-empty">No new songs right now</div>';
          return;
        }

        const count = data.items.length;
        if (notifBadge) {
          notifBadge.textContent = count;
          notifBadge.setAttribute('data-count', count);
        }

        notifList.innerHTML = data.items.map(item => {
          const title = item.snippet.title;
          const thumb = item.snippet.thumbnails.default.url;
          const videoId = item.id.videoId;
          const channel = item.snippet.channelTitle;
          return `
            <div class="notif-item" onclick="playNotifSong('${videoId}', \`${title.replace(/`/g, "'")}\`)">
              <img class="notif-item-thumb" src="${thumb}" alt="">
              <div class="notif-item-info">
                <div class="notif-item-title">${title}</div>
                <div class="notif-item-sub">${channel}</div>
              </div>
              <div class="notif-item-new"></div>
            </div>
          `;
        }).join('');
      })
      .catch(() => {
        notifList.innerHTML = '<div class="notif-empty">Could not load notifications</div>';
      });
  }
})();

function playNotifSong(videoId, title) {
  // Close notification dropdown
  const dd = document.getElementById('notifDropdown');
  if (dd) dd.classList.remove('show');

  if (typeof playSong === 'function' && typeof playlist !== 'undefined') {
    playlist = [{ videoId: videoId, title: title }];
    currentIndex = 0;
    playSong(0);
  } else if (typeof ytPlayer !== 'undefined' && ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    ytPlayer.loadVideoById(videoId);
    const songNameEl = document.getElementById('songName');
    if (songNameEl) songNameEl.textContent = title;
  }
}
