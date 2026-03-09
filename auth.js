/* ===============================
   AUTH – Moodify Pro
   Handles login session
================================ */

(function () {

  const token = localStorage.getItem('moodify_token');

  const navLoginBtn = document.getElementById('navLoginBtn');
  const navUserArea = document.getElementById('navUserArea');

  /* ===============================
     NOT LOGGED IN
  ================================ */

  if (!token) {

    // Show login button
    if (navLoginBtn) navLoginBtn.style.display = "inline-block";

    // Hide user area
    if (navUserArea) navUserArea.style.display = "none";

    // Redirect to login if trying to access main website
    const path = window.location.pathname;

    if (!path.includes("Login") && !path.includes("signup") && !path.includes("reset") && !path.includes("avatar")) {
      window.location.href = "Login/index.html";
    }

    return;
  }

  /* ===============================
     LOGGED IN
  ================================ */

  // Hide login button
  if (navLoginBtn) navLoginBtn.style.display = "none";

  // Show user info
  if (navUserArea) {

    navUserArea.style.display = "flex";

    const user = JSON.parse(localStorage.getItem("moodify_user") || "{}");
    const userName = user.name || (user.email ? user.email.split('@')[0] : 'User');
    const firstLetter = userName.charAt(0).toUpperCase();

    // Set avatar letters as fallback
    const avatarLetter = document.getElementById('avatarLetter');
    if (avatarLetter) avatarLetter.textContent = firstLetter;

    // If user has a saved avatar, render it in the navbar
    if (user.avatar && typeof user.avatar === 'object') {
      renderNavbarAvatar(user.avatar);
    }

  }

})();


/* ===============================
   LOGOUT FUNCTION
================================ */

function logoutUser() {

  localStorage.removeItem("moodify_token");
  localStorage.removeItem("moodify_user");

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
  const user = JSON.parse(localStorage.getItem('moodify_user') || '{}');
  const userName = user.name || (user.email ? user.email.split('@')[0] : 'User');
  const firstLetter = userName.charAt(0).toUpperCase();

  const profileDropdownName = document.getElementById('profileDropdownName');
  if (profileDropdownName) profileDropdownName.textContent = userName;
  if (profileDropdownEmail) profileDropdownEmail.textContent = user.email || '';

  const dropdownAvatarLetter = document.getElementById('dropdownAvatarLetter');
  if (dropdownAvatarLetter) dropdownAvatarLetter.textContent = firstLetter;

  // If avatar is saved, render it in dropdown too
  if (user.avatar && typeof user.avatar === 'object') {
    const ddAvContainer = document.querySelector('.profile-dropdown-avatar');
    if (ddAvContainer) {
      ddAvContainer.innerHTML = generateAvatarSVG(user.avatar, 40);
    }
  }

  // Toggle dropdown on click
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
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
  const user = JSON.parse(localStorage.getItem('moodify_user') || '{}');
  const userName = user.name || (user.email ? user.email.split('@')[0] : 'User');

  if (nameEl) nameEl.textContent = userName;
  if (emailEl) emailEl.textContent = user.email || '';

  // Show avatar SVG or letter
  const modalAvatarContainer = document.querySelector('.profile-modal-avatar');
  if (user.avatar && typeof user.avatar === 'object' && modalAvatarContainer) {
    modalAvatarContainer.innerHTML = generateAvatarSVG(user.avatar, 60);
  } else if (avatarEl) {
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
    if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
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


/* ===============================
   AVATAR BUILDER LINK
================================ */

function openAvatarBuilder() {
  // Close profile dropdown
  const dd = document.getElementById('profileDropdown');
  if (dd) dd.classList.remove('show');
  window.location.href = 'avatar/index.html';
}


/* ===============================
   MINI AVATAR SVG RENDERER
   (used in navbar & dropdown)
================================ */

const _SKIN = {
  'light':'#FDDCB1','light-med':'#E8B88A','medium':'#D4935A','tan':'#C07840',
  'brown':'#8D5524','dark-brown':'#6B3A1F','dark':'#4A2511'
};
const _HC = {
  'black':'#1a1a1a','brown':'#4A2800','auburn':'#8B3A00','ginger':'#C74B0A',
  'blonde':'#D4A843','platinum':'#E8DCC8','red':'#CC2244','blue':'#3366CC',
  'green':'#1DB954','purple':'#8844CC','pink':'#FF66AA','white':'#DDDDDD'
};
const _EC = {
  'brown':'#3a2a1a','blue':'#2266BB','green':'#228844','hazel':'#8B7355','gray':'#666677','amber':'#CC8833'
};
const _BG = {
  'none':'','green':'#1DB954','blue':'#2563EB','purple':'#7C3AED','pink':'#EC4899',
  'orange':'#F97316','red':'#EF4444','dark':'#1a1a2e'
};
const _FACES = {
  'round':'M100,30 C145,30 165,60 165,100 C165,145 145,175 100,175 C55,175 35,145 35,100 C35,60 55,30 100,30Z',
  'oval':'M100,25 C140,25 160,55 160,95 C160,145 140,180 100,180 C60,180 40,145 40,95 C40,55 60,25 100,25Z',
  'square':'M100,30 C148,30 165,48 165,95 C165,145 148,172 100,172 C52,172 35,145 35,95 C35,48 52,30 100,30Z',
  'heart':'M100,28 C142,28 168,55 166,100 C164,148 138,178 100,178 C62,178 36,148 34,100 C32,55 58,28 100,28Z',
  'long':'M100,22 C135,22 155,50 155,95 C155,150 135,185 100,185 C65,185 45,150 45,95 C45,50 65,22 100,22Z',
};

function _dk(hex, a) {
  let c = hex.replace('#','');
  if (c.length===3) c=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const n=parseInt(c,16);
  let r=Math.max(0,(n>>16)-a), g=Math.max(0,((n>>8)&0xFF)-a), b=Math.max(0,(n&0xFF)-a);
  return '#'+(r<<16|g<<8|b).toString(16).padStart(6,'0');
}

function _miniEars(sk) {
  return `<ellipse cx="35" cy="100" rx="10" ry="14" fill="${sk}" stroke="${_dk(sk,30)}" stroke-width="1.5"/>
          <ellipse cx="165" cy="100" rx="10" ry="14" fill="${sk}" stroke="${_dk(sk,30)}" stroke-width="1.5"/>`;
}

function _miniFace(av) {
  const sk = _SKIN[av.skin]||'#FDDCB1';
  const fp = _FACES[av.face]||_FACES['round'];
  return `<path d="${fp}" fill="${sk}" stroke="${_dk(sk,30)}" stroke-width="2"/>`;
}

function _miniEyebrows(av) {
  if(!av.eyebrows||av.eyebrows==='none') return '';
  const hc=_dk(_HC[av.hairColor]||'#1a1a1a',10);
  switch(av.eyebrows){
    case 'thick': return `<path d="M60,76 Q75,70 88,76" stroke="${hc}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M112,76 Q125,70 140,76" stroke="${hc}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'thin': return `<path d="M62,78 Q75,74 86,78" stroke="${hc}" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M114,78 Q125,74 138,78" stroke="${hc}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    case 'arched': return `<path d="M62,80 Q70,70 86,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M138,80 Q130,70 114,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case 'angry': return `<path d="M62,82 Q75,72 88,76" stroke="${hc}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M138,82 Q125,72 112,76" stroke="${hc}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 'unibrow': return `<path d="M60,78 Q75,72 100,76 Q125,72 140,78" stroke="${hc}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    default: return `<path d="M62,78 Q75,72 88,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M112,78 Q125,72 138,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
}

function _miniFacialHair(av) {
  if(!av.facialHair||av.facialHair==='none') return '';
  const hc=_dk(_HC[av.hairColor]||'#1a1a1a',5);
  switch(av.facialHair){
    case 'mustache': return `<path d="M82,122 Q90,118 100,122 Q110,118 118,122 Q115,128 100,128 Q85,128 82,122Z" fill="${hc}"/>`;
    case 'goatee': return `<path d="M88,135 Q100,150 112,135 Q110,160 100,165 Q90,160 88,135Z" fill="${hc}"/>`;
    case 'full': return `<path d="M82,122 Q90,118 100,122 Q110,118 118,122 Q115,128 100,128 Q85,128 82,122Z" fill="${hc}"/><path d="M60,120 Q65,125 70,140 Q80,165 100,170 Q120,165 130,140 Q135,125 140,120 Q130,125 120,130 Q100,142 80,130 Q70,125 60,120Z" fill="${hc}"/>`;
    case 'soul': return `<ellipse cx="100" cy="145" rx="6" ry="5" fill="${hc}"/>`;
    default: return '';
  }
}

function _miniAccessories(av) {
  if(!av.accessories||av.accessories==='none') return '';
  switch(av.accessories){
    case 'earring_l': return `<circle cx="28" cy="108" r="4" fill="none" stroke="#FFD700" stroke-width="1.5"/><circle cx="28" cy="112" r="2" fill="#FFD700"/>`;
    case 'earring_both': return `<circle cx="28" cy="108" r="4" fill="none" stroke="#FFD700" stroke-width="1.5"/><circle cx="28" cy="112" r="2" fill="#FFD700"/><circle cx="172" cy="108" r="4" fill="none" stroke="#FFD700" stroke-width="1.5"/><circle cx="172" cy="112" r="2" fill="#FFD700"/>`;
    case 'nose_ring': return `<circle cx="104" cy="112" r="3" fill="none" stroke="#C0C0C0" stroke-width="1.2"/>`;
    case 'bandana': return `<path d="M38,70 Q100,58 162,70 Q160,78 100,72 Q40,78 38,70Z" fill="#e74c3c"/>`;
    case 'cap': return `<path d="M35,75 C35,42 60,22 100,22 C140,22 165,42 165,75 L170,78 L30,78Z" fill="#333"/><rect x="25" y="74" width="80" height="8" rx="2" fill="#222"/>`;
    default: return '';
  }
}

function _miniBg(av) {
  if(!av.bg||av.bg==='none') return '';
  const c = _BG[av.bg];
  if(!c) return '';
  return `<circle cx="100" cy="100" r="98" fill="${c}"/>`;
}

function _miniEyes(av) {
  const ec = _EC[av.eyeColor]||'#3a2a1a';
  const w='#fff',ir=ec,p='#111';
  switch(av.eyes) {
    case 'round': return `<circle cx="75" cy="92" r="12" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="75" cy="93" r="7" fill="${ir}"/><circle cx="75" cy="91" r="3" fill="${p}"/><circle cx="125" cy="92" r="12" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="125" cy="93" r="7" fill="${ir}"/><circle cx="125" cy="91" r="3" fill="${p}"/>`;
    case 'narrow': return `<ellipse cx="75" cy="92" rx="13" ry="7" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="75" cy="92" r="5" fill="${ir}"/><ellipse cx="125" cy="92" rx="13" ry="7" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="125" cy="92" r="5" fill="${ir}"/>`;
    case 'wink': return `<ellipse cx="75" cy="92" rx="11" ry="10" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="75" cy="93" r="6" fill="${ir}"/><path d="M115,92 Q125,86 135,92" stroke="#333" stroke-width="2.5" fill="none"/>`;
    case 'happy': return `<path d="M64,92 Q75,84 86,92" stroke="#333" stroke-width="2.5" fill="none"/><path d="M114,92 Q125,84 136,92" stroke="#333" stroke-width="2.5" fill="none"/>`;
    case 'sleepy': return `<path d="M64,90 Q75,96 86,90" stroke="#333" stroke-width="2.5" fill="none"/><path d="M114,90 Q125,96 136,90" stroke="#333" stroke-width="2.5" fill="none"/>`;
    case 'angry': return `<line x1="64" y1="80" x2="86" y2="85" stroke="#333" stroke-width="2.5"/><ellipse cx="75" cy="94" rx="11" ry="9" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="75" cy="95" r="6" fill="${ir}"/><line x1="136" y1="80" x2="114" y2="85" stroke="#333" stroke-width="2.5"/><ellipse cx="125" cy="94" rx="11" ry="9" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="125" cy="95" r="6" fill="${ir}"/>`;
    case 'star': return `<polygon points="75,82 77,88 83,89 79,93 80,99 75,96 70,99 71,93 67,89 73,88" fill="#FFD700" stroke="#333" stroke-width="1"/><polygon points="125,82 127,88 133,89 129,93 130,99 125,96 120,99 121,93 117,89 123,88" fill="#FFD700" stroke="#333" stroke-width="1"/>`;
    case 'heart': return `<path d="M70,88 C70,82 75,80 75,80 C75,80 80,82 80,88 C80,93 75,97 75,97 C75,97 70,93 70,88Z" fill="#e74c3c"/><path d="M120,88 C120,82 125,80 125,80 C125,80 130,82 130,88 C130,93 125,97 125,97 C125,97 120,93 120,88Z" fill="#e74c3c"/>`;
    case 'cyber': return `<rect x="62" y="83" width="26" height="18" rx="3" fill="#111" stroke="#1DB954" stroke-width="1.5"/><rect x="112" y="83" width="26" height="18" rx="3" fill="#111" stroke="#1DB954" stroke-width="1.5"/>`;
    default: return `<ellipse cx="75" cy="92" rx="11" ry="10" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="75" cy="93" r="6" fill="${ir}"/><circle cx="75" cy="91" r="2.5" fill="${p}"/><ellipse cx="125" cy="92" rx="11" ry="10" fill="${w}" stroke="#333" stroke-width="1.5"/><circle cx="125" cy="93" r="6" fill="${ir}"/><circle cx="125" cy="91" r="2.5" fill="${p}"/>`;
  }
}

function _miniMouth(av) {
  switch(av.mouth) {
    case 'grin': return `<path d="M78,130 Q100,150 122,130" stroke="#333" stroke-width="2" fill="#c0392b"/><path d="M78,130 Q100,135 122,130" fill="white"/>`;
    case 'neutral': return `<line x1="82" y1="132" x2="118" y2="132" stroke="#333" stroke-width="2.5"/>`;
    case 'open': return `<ellipse cx="100" cy="134" rx="12" ry="10" fill="#c0392b" stroke="#333" stroke-width="1.5"/>`;
    case 'smirk': return `<path d="M85,132 Q105,142 120,130" stroke="#333" stroke-width="2.5" fill="none"/>`;
    case 'tongue': return `<path d="M80,130 Q100,145 120,130" stroke="#333" stroke-width="2" fill="none"/><ellipse cx="100" cy="142" rx="7" ry="6" fill="#e74c3c"/>`;
    case 'sad': return `<path d="M82,138 Q100,126 118,138" stroke="#333" stroke-width="2.5" fill="none"/>`;
    case 'o': return `<circle cx="100" cy="134" r="8" fill="#c0392b" stroke="#333" stroke-width="1.5"/>`;
    case 'teeth': return `<path d="M78,130 Q100,148 122,130" stroke="#555" stroke-width="1.5" fill="#8B1A1A"/><rect x="86" y="130" width="28" height="8" rx="1" fill="white"/>`;
    case 'kiss': return `<ellipse cx="100" cy="134" rx="7" ry="8" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>`;
    default: return `<path d="M80,130 Q100,148 120,130" stroke="#333" stroke-width="2.5" fill="none"/>`;
  }
}

function _miniHair(av) {
  const hc = _HC[av.hairColor]||'#1a1a1a';
  switch(av.hair) {
    case 'none': return '';
    case 'short': return `<path d="M42,85 C42,40 65,22 100,22 C135,22 158,40 158,85 C158,65 150,38 100,38 C50,38 42,65 42,85Z" fill="${hc}"/>`;
    case 'crew': return `<path d="M45,82 C45,42 65,25 100,25 C135,25 155,42 155,82 C155,60 145,35 100,35 C55,35 45,60 45,82Z" fill="${hc}"/>`;
    case 'spiky': return `<path d="M45,80 C45,42 65,25 100,25 C135,25 155,42 155,80 L145,55 L135,78 L125,48 L115,75 L105,40 L95,75 L85,48 L75,78 L65,55 L55,80Z" fill="${hc}"/>`;
    case 'wavy': return `<path d="M38,95 C38,45 60,18 100,18 C140,18 162,45 162,95 C162,70 150,32 100,32 C50,32 38,70 38,95Z" fill="${hc}"/>`;
    case 'long': return `<path d="M35,95 C35,40 60,15 100,15 C140,15 165,40 165,95 C165,70 148,28 100,28 C52,28 35,70 35,95Z" fill="${hc}"/><path d="M35,95 L32,160 Q38,165 48,155 L45,95Z" fill="${hc}"/><path d="M165,95 L168,160 Q162,165 152,155 L155,95Z" fill="${hc}"/>`;
    case 'bob': return `<path d="M38,90 C38,42 62,18 100,18 C138,18 162,42 162,90 C162,65 148,30 100,30 C52,30 38,65 38,90Z" fill="${hc}"/><path d="M38,90 Q36,120 48,130 L52,90Z" fill="${hc}"/><path d="M162,90 Q164,120 152,130 L148,90Z" fill="${hc}"/>`;
    case 'ponytail': return `<path d="M42,85 C42,40 65,22 100,22 C135,22 158,40 158,85 C158,65 150,38 100,38 C50,38 42,65 42,85Z" fill="${hc}"/><path d="M130,35 Q155,30 160,55 Q165,80 150,100 Q145,85 148,65 Q140,40 130,35Z" fill="${hc}"/>`;
    case 'mohawk': return `<path d="M85,75 Q88,10 100,5 Q112,10 115,75 L108,40 Q100,15 92,40Z" fill="${hc}"/>`;
    case 'curly': return `<path d="M40,90 C40,42 62,20 100,20 C138,20 160,42 160,90" fill="${hc}"/><circle cx="50" cy="55" r="12" fill="${hc}"/><circle cx="72" cy="38" r="13" fill="${hc}"/><circle cx="100" cy="32" r="14" fill="${hc}"/><circle cx="128" cy="38" r="13" fill="${hc}"/><circle cx="150" cy="55" r="12" fill="${hc}"/>`;
    case 'afro': return `<ellipse cx="100" cy="65" rx="75" ry="62" fill="${hc}"/>`;
    case 'buzz': return `<path d="M46,85 C46,48 66,30 100,30 C134,30 154,48 154,85 C154,68 144,40 100,40 C56,40 46,68 46,85Z" fill="${hc}" opacity="0.7"/>`;
    case 'braids': return `<path d="M38,90 C38,42 62,18 100,18 C138,18 162,42 162,90 C162,65 148,30 100,30 C52,30 38,65 38,90Z" fill="${hc}"/><path d="M42,90 Q40,130 44,160" stroke="${hc}" stroke-width="8" fill="none"/><path d="M158,90 Q160,130 156,160" stroke="${hc}" stroke-width="8" fill="none"/>`;
    case 'topknot': return `<path d="M46,85 C46,48 66,30 100,30 C134,30 154,48 154,85 C154,68 144,40 100,40 C56,40 46,68 46,85Z" fill="${hc}" opacity="0.7"/><ellipse cx="100" cy="18" rx="18" ry="16" fill="${hc}"/>`;
    default: return '';
  }
}

function _miniGlasses(av) {
  switch(av.glasses) {
    case 'none': return '';
    case 'round': return `<circle cx="75" cy="92" r="17" fill="none" stroke="#333" stroke-width="2.5"/><circle cx="125" cy="92" r="17" fill="none" stroke="#333" stroke-width="2.5"/><line x1="92" y1="92" x2="108" y2="92" stroke="#333" stroke-width="2.5"/>`;
    case 'square': return `<rect x="58" y="78" width="34" height="28" rx="4" fill="none" stroke="#333" stroke-width="2.5"/><rect x="108" y="78" width="34" height="28" rx="4" fill="none" stroke="#333" stroke-width="2.5"/><line x1="92" y1="92" x2="108" y2="92" stroke="#333" stroke-width="2.5"/>`;
    case 'aviator': return `<path d="M58,82 Q58,72 75,72 Q92,72 92,82 Q92,108 75,108 Q58,108 58,82Z" fill="rgba(100,180,255,0.15)" stroke="#888" stroke-width="2"/><path d="M108,82 Q108,72 125,72 Q142,72 142,82 Q142,108 125,108 Q108,108 108,82Z" fill="rgba(100,180,255,0.15)" stroke="#888" stroke-width="2"/><line x1="92" y1="82" x2="108" y2="82" stroke="#888" stroke-width="2"/>`;
    case 'cat': return `<path d="M58,95 Q58,78 68,76 Q78,74 88,78 Q92,80 92,90 Q92,105 75,108 Q58,105 58,95Z" fill="none" stroke="#333" stroke-width="2.5"/><path d="M108,95 Q108,78 118,76 Q128,74 138,78 Q142,80 142,90 Q142,105 125,108 Q108,105 108,95Z" fill="none" stroke="#333" stroke-width="2.5"/><line x1="92" y1="88" x2="108" y2="88" stroke="#333" stroke-width="2.5"/>`;
    case 'sport': return `<path d="M48,92 Q48,78 75,76 Q100,74 100,80 Q100,74 125,76 Q152,78 152,92 Q152,106 125,108 Q100,110 100,104 Q100,110 75,108 Q48,106 48,92Z" fill="rgba(0,0,0,0.12)" stroke="#555" stroke-width="2.5"/>`;
    case 'cyber': return `<rect x="52" y="80" width="40" height="22" rx="4" fill="rgba(0,0,0,0.6)" stroke="#1DB954" stroke-width="1.5"/><rect x="108" y="80" width="40" height="22" rx="4" fill="rgba(0,0,0,0.6)" stroke="#1DB954" stroke-width="1.5"/><line x1="92" y1="91" x2="108" y2="91" stroke="#1DB954" stroke-width="2"/>`;
    default: return '';
  }
}

function _miniHP(av) {
  switch(av.headphones) {
    case 'none': return '';
    case 'over': return `<path d="M32,95 Q32,35 100,35 Q168,35 168,95" stroke="#333" stroke-width="6" fill="none"/><rect x="22" y="82" width="18" height="32" rx="8" fill="#333"/><rect x="160" y="82" width="18" height="32" rx="8" fill="#333"/>`;
    case 'on': return `<path d="M36,90 Q36,38 100,38 Q164,38 164,90" stroke="#444" stroke-width="5" fill="none"/><circle cx="36" cy="95" r="12" fill="#444"/><circle cx="164" cy="95" r="12" fill="#444"/>`;
    case 'beats': return `<path d="M30,92 Q30,30 100,30 Q170,30 170,92" stroke="#e74c3c" stroke-width="7" fill="none"/><rect x="18" y="78" width="22" height="36" rx="10" fill="#e74c3c"/><rect x="160" y="78" width="22" height="36" rx="10" fill="#e74c3c"/>`;
    case 'moodify': return `<path d="M30,92 Q30,30 100,30 Q170,30 170,92" stroke="#1DB954" stroke-width="7" fill="none"/><rect x="18" y="78" width="22" height="36" rx="10" fill="#1DB954"/><rect x="160" y="78" width="22" height="36" rx="10" fill="#1DB954"/>`;
    case 'airpods': return `<ellipse cx="33" cy="108" rx="5" ry="7" fill="white" stroke="#ddd" stroke-width="1"/><line x1="33" y1="115" x2="33" y2="128" stroke="white" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="167" cy="108" rx="5" ry="7" fill="white" stroke="#ddd" stroke-width="1"/><line x1="167" y1="115" x2="167" y2="128" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`;
    default: return '';
  }
}

function _miniNose(av) {
  const sk = _SKIN[av.skin]||'#FDDCB1';
  return `<path d="M96,105 Q100,115 104,105" stroke="${_dk(sk,40)}" stroke-width="1.5" fill="none"/>`;
}

function generateAvatarSVG(av, size) {
  const s = size || 32;
  return `<svg width="${s}" height="${s}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="border-radius:50%;">
    ${_miniBg(av)}
    ${_miniEars(_SKIN[av.skin]||'#FDDCB1')}
    ${_miniFace(av)}
    ${_miniNose(av)}
    ${_miniEyebrows(av)}
    ${_miniEyes(av)}
    ${_miniMouth(av)}
    ${_miniFacialHair(av)}
    ${_miniHair(av)}
    ${_miniGlasses(av)}
    ${_miniHP(av)}
    ${_miniAccessories(av)}
  </svg>`;
}

function renderNavbarAvatar(av) {
  const profileBtn = document.getElementById('profileBtn');
  if (!profileBtn) return;
  // Replace letter with SVG avatar
  profileBtn.innerHTML = generateAvatarSVG(av, 32);
  profileBtn.style.overflow = 'hidden';
  profileBtn.style.padding = '0';
}