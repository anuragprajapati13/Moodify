/* ===============================
   AVATAR BUILDER – Moodify Pro
   3D SVG Layered Avatar System
================================ */

// ========================
// AVATAR PARTS DATA
// ========================

const SKIN_TONES = [
  { id: 'light',       color: '#FDDCB1', hi: '#FFF0D9', sh: '#E0BB8A' },
  { id: 'light-med',   color: '#E8B88A', hi: '#F5D4AD', sh: '#C99A6B' },
  { id: 'medium',      color: '#D4935A', hi: '#E8B07A', sh: '#B07840' },
  { id: 'tan',         color: '#C07840', hi: '#D89660', sh: '#9A5E2E' },
  { id: 'brown',       color: '#8D5524', hi: '#A87040', sh: '#6B3A1F' },
  { id: 'dark-brown',  color: '#6B3A1F', hi: '#8B5535', sh: '#4A2511' },
  { id: 'dark',        color: '#4A2511', hi: '#6B3A20', sh: '#2D1508' },
];

const HAIR_COLORS = [
  { id: 'black',    color: '#1a1a1a', hi: '#333' },
  { id: 'brown',    color: '#4A2800', hi: '#6B4020' },
  { id: 'auburn',   color: '#8B3A00', hi: '#B05520' },
  { id: 'ginger',   color: '#C74B0A', hi: '#E06A25' },
  { id: 'blonde',   color: '#D4A843', hi: '#E8C870' },
  { id: 'platinum', color: '#E8DCC8', hi: '#FFF5E8' },
  { id: 'red',      color: '#CC2244', hi: '#E84466' },
  { id: 'blue',     color: '#3366CC', hi: '#5588EE' },
  { id: 'green',    color: '#1DB954', hi: '#40D876' },
  { id: 'purple',   color: '#8844CC', hi: '#AA66EE' },
  { id: 'pink',     color: '#FF66AA', hi: '#FF88CC' },
  { id: 'white',    color: '#DDDDDD', hi: '#FFFFFF' },
];

const FACES = [
  { id: 'round',  label: 'Round',  path: 'M100,30 C145,30 165,60 165,100 C165,145 145,175 100,175 C55,175 35,145 35,100 C35,60 55,30 100,30Z' },
  { id: 'oval',   label: 'Oval',   path: 'M100,25 C140,25 160,55 160,95 C160,145 140,180 100,180 C60,180 40,145 40,95 C40,55 60,25 100,25Z' },
  { id: 'square', label: 'Square', path: 'M100,30 C148,30 165,48 165,95 C165,145 148,172 100,172 C52,172 35,145 35,95 C35,48 52,30 100,30Z' },
  { id: 'heart',  label: 'Heart',  path: 'M100,28 C142,28 168,55 166,100 C164,148 138,178 100,178 C62,178 36,148 34,100 C32,55 58,28 100,28Z' },
  { id: 'long',   label: 'Long',   path: 'M100,22 C135,22 155,50 155,95 C155,150 135,185 100,185 C65,185 45,150 45,95 C45,50 65,22 100,22Z' },
];

const HAIR_STYLES = [
  { id: 'none', label: 'None' },
  { id: 'short', label: 'Short' },
  { id: 'crew', label: 'Crew' },
  { id: 'spiky', label: 'Spiky' },
  { id: 'wavy', label: 'Wavy' },
  { id: 'long', label: 'Long' },
  { id: 'bob', label: 'Bob' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'mohawk', label: 'Mohawk' },
  { id: 'curly', label: 'Curly' },
  { id: 'afro', label: 'Afro' },
  { id: 'buzz', label: 'Buzz' },
  { id: 'braids', label: 'Braids' },
  { id: 'topknot', label: 'Top Knot' },
];

const EYES = [
  { id: 'normal', label: 'Normal' },
  { id: 'round', label: 'Round' },
  { id: 'narrow', label: 'Narrow' },
  { id: 'wink', label: 'Wink' },
  { id: 'happy', label: 'Happy' },
  { id: 'star', label: 'Star' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'angry', label: 'Angry' },
  { id: 'heart', label: 'Heart' },
  { id: 'cyber', label: 'Cyber' },
];

const EYE_COLORS = [
  { id: 'brown',  color: '#3a2a1a', hi: '#5a4a3a' },
  { id: 'blue',   color: '#2266BB', hi: '#4488DD' },
  { id: 'green',  color: '#228844', hi: '#44AA66' },
  { id: 'hazel',  color: '#8B7355', hi: '#A89070' },
  { id: 'gray',   color: '#666677', hi: '#888899' },
  { id: 'amber',  color: '#CC8833', hi: '#DDAA55' },
];

const EYEBROWS = [
  { id: 'normal', label: 'Normal' },
  { id: 'thick', label: 'Thick' },
  { id: 'thin', label: 'Thin' },
  { id: 'arched', label: 'Arched' },
  { id: 'angry', label: 'Angry' },
  { id: 'unibrow', label: 'Unibrow' },
  { id: 'none', label: 'None' },
];

const MOUTHS = [
  { id: 'smile', label: 'Smile' },
  { id: 'grin', label: 'Grin' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'open', label: 'Open' },
  { id: 'smirk', label: 'Smirk' },
  { id: 'tongue', label: 'Tongue' },
  { id: 'sad', label: 'Sad' },
  { id: 'o', label: 'O' },
  { id: 'teeth', label: 'Teeth' },
  { id: 'kiss', label: 'Kiss' },
];

const FACIAL_HAIR = [
  { id: 'none', label: 'None' },
  { id: 'stubble', label: 'Stubble' },
  { id: 'mustache', label: 'Mustache' },
  { id: 'goatee', label: 'Goatee' },
  { id: 'full', label: 'Full Beard' },
  { id: 'soul', label: 'Soul Patch' },
];

const GLASSES = [
  { id: 'none', label: 'None' },
  { id: 'round', label: 'Round' },
  { id: 'square', label: 'Square' },
  { id: 'aviator', label: 'Aviator' },
  { id: 'cat', label: 'Cat Eye' },
  { id: 'sport', label: 'Sport' },
  { id: 'cyber', label: 'Cyber' },
];

const HEADPHONES = [
  { id: 'none', label: 'None' },
  { id: 'over', label: 'Over-Ear' },
  { id: 'on', label: 'On-Ear' },
  { id: 'beats', label: 'Studio' },
  { id: 'moodify', label: 'Moodify' },
  { id: 'airpods', label: 'Earbuds' },
];

const ACCESSORIES = [
  { id: 'none', label: 'None' },
  { id: 'earring_l', label: 'L Earring' },
  { id: 'earring_both', label: 'Earrings' },
  { id: 'nose_ring', label: 'Nose Ring' },
  { id: 'bandana', label: 'Bandana' },
  { id: 'cap', label: 'Cap' },
];

const BG_COLORS = [
  { id: 'none', color: 'transparent', label: 'None' },
  { id: 'green', color: '#1DB954', label: 'Moodify' },
  { id: 'blue', color: '#2563EB', label: 'Blue' },
  { id: 'purple', color: '#7C3AED', label: 'Purple' },
  { id: 'pink', color: '#EC4899', label: 'Pink' },
  { id: 'orange', color: '#F97316', label: 'Orange' },
  { id: 'red', color: '#EF4444', label: 'Red' },
  { id: 'dark', color: '#1a1a2e', label: 'Dark' },
  { id: 'gradient1', color: 'url(#bgGrad1)', label: 'Gradient 1' },
  { id: 'gradient2', color: 'url(#bgGrad2)', label: 'Gradient 2' },
];


// ========================
// STATE
// ========================

let avatarState = {
  face: 'round',
  skin: 'light',
  hair: 'short',
  hairColor: 'black',
  eyes: 'normal',
  eyeColor: 'brown',
  eyebrows: 'normal',
  mouth: 'smile',
  facialHair: 'none',
  glasses: 'none',
  headphones: 'none',
  accessories: 'none',
  bg: 'none',
};

const defaults = { ...avatarState };


// ========================
// 3D SVG DEFS
// ========================

function renderDefs() {
  const skin = getSkinTone();
  const hc = getHairColorObj();
  return `
  <defs>
    <radialGradient id="faceGrad" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${skin.hi}"/>
      <stop offset="60%" stop-color="${skin.color}"/>
      <stop offset="100%" stop-color="${skin.sh}"/>
    </radialGradient>
    <radialGradient id="earGrad" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${skin.hi}"/>
      <stop offset="100%" stop-color="${skin.sh}"/>
    </radialGradient>
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${hc.hi || lighten(hc.color, 30)}"/>
      <stop offset="50%" stop-color="${hc.color}"/>
      <stop offset="100%" stop-color="${darken(hc.color, 30)}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="rgba(0,0,0,0.35)"/>
    </filter>
    <radialGradient id="eyeShine" cx="35%" cy="30%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1DB954"/>
      <stop offset="100%" stop-color="#191414"/>
    </linearGradient>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <linearGradient id="glassReflect" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
    <linearGradient id="hpMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#555"/>
      <stop offset="50%" stop-color="#333"/>
      <stop offset="100%" stop-color="#111"/>
    </linearGradient>
  </defs>`;
}


// ========================
// GETTERS
// ========================

function getSkinTone() {
  return SKIN_TONES.find(s => s.id === avatarState.skin) || SKIN_TONES[0];
}
function getSkinColor() { return getSkinTone().color; }
function getHairColorObj() { return HAIR_COLORS.find(h => h.id === avatarState.hairColor) || HAIR_COLORS[0]; }
function getHairColor() { return getHairColorObj().color; }
function getEyeColorObj() { return EYE_COLORS.find(e => e.id === avatarState.eyeColor) || EYE_COLORS[0]; }


// ========================
// 3D SVG RENDERERS
// ========================

function renderBg() {
  const bg = BG_COLORS.find(b => b.id === avatarState.bg) || BG_COLORS[0];
  if (bg.id === 'none') return '';
  return `<circle cx="100" cy="100" r="98" fill="${bg.color}"/>`;
}

function renderFace() {
  const face = FACES.find(f => f.id === avatarState.face) || FACES[0];
  const skin = getSkinTone();
  return `
    <g filter="url(#shadow)">
      <path d="${face.path}" fill="url(#faceGrad)" stroke="${darken(skin.color, 20)}" stroke-width="1"/>
    </g>
    <circle cx="68" cy="118" r="14" fill="rgba(255,120,120,0.12)"/>
    <circle cx="132" cy="118" r="14" fill="rgba(255,120,120,0.12)"/>
    <ellipse cx="95" cy="55" rx="25" ry="15" fill="rgba(255,255,255,0.08)"/>
  `;
}

function renderEars() {
  const skin = getSkinTone();
  return `
    <ellipse cx="35" cy="100" rx="10" ry="14" fill="url(#earGrad)" stroke="${darken(skin.color, 25)}" stroke-width="1.5"/>
    <ellipse cx="34" cy="98" rx="5" ry="8" fill="rgba(255,255,255,0.07)"/>
    <ellipse cx="165" cy="100" rx="10" ry="14" fill="url(#earGrad)" stroke="${darken(skin.color, 25)}" stroke-width="1.5"/>
    <ellipse cx="166" cy="98" rx="5" ry="8" fill="rgba(255,255,255,0.07)"/>
  `;
}

function renderEyes() {
  const id = avatarState.eyes;
  const ec = getEyeColorObj();
  const iris = ec.color;
  const pupil = '#111';

  function eye3D(cx, cy, rx, ry) {
    return `
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="white" stroke="#555" stroke-width="1.2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#eyeShine)"/>
      <circle cx="${cx}" cy="${cy+1}" r="${ry*0.62}" fill="${iris}"/>
      <circle cx="${cx-1}" cy="${cy}" r="${ry*0.35}" fill="${pupil}"/>
      <circle cx="${cx-2}" cy="${cy-2}" r="${ry*0.15}" fill="white" opacity="0.9"/>
      <circle cx="${cx+2}" cy="${cy+2}" r="${ry*0.08}" fill="white" opacity="0.5"/>
    `;
  }

  switch (id) {
    case 'round': return eye3D(75, 92, 13, 12) + eye3D(125, 92, 13, 12);
    case 'narrow': return eye3D(75, 92, 14, 7) + eye3D(125, 92, 14, 7);
    case 'wink':
      return eye3D(75, 92, 12, 10) + `
        <path d="M115,92 Q125,85 135,92" stroke="#555" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M118,90 Q125,87 132,90" stroke="#555" stroke-width="1" fill="none" opacity="0.4"/>
      `;
    case 'happy':
      return `
        <path d="M64,92 Q75,82 86,92" stroke="#555" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        <path d="M114,92 Q125,82 136,92" stroke="#555" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      `;
    case 'star': return starShape(75, 92, 11, '#FFD700') + starShape(125, 92, 11, '#FFD700');
    case 'sleepy':
      return `
        <path d="M64,90 Q75,97 86,90" stroke="#555" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        <path d="M114,90 Q125,97 136,90" stroke="#555" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      `;
    case 'angry':
      return `
        <line x1="64" y1="80" x2="86" y2="86" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>
        ${eye3D(75, 94, 11, 9)}
        <line x1="136" y1="80" x2="114" y2="86" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>
        ${eye3D(125, 94, 11, 9)}
      `;
    case 'heart':
      return `
        <path d="M70,88 C70,82 75,80 75,80 C75,80 80,82 80,88 C80,93 75,97 75,97 C75,97 70,93 70,88Z" fill="#e74c3c"/>
        <path d="M120,88 C120,82 125,80 125,80 C125,80 130,82 130,88 C130,93 125,97 125,97 C125,97 120,93 120,88Z" fill="#e74c3c"/>
        <circle cx="73" cy="86" r="2" fill="rgba(255,255,255,0.4)"/>
        <circle cx="123" cy="86" r="2" fill="rgba(255,255,255,0.4)"/>
      `;
    case 'cyber':
      return `
        <rect x="62" y="83" width="26" height="18" rx="3" fill="#111" stroke="#1DB954" stroke-width="1.5"/>
        <rect x="65" y="86" width="20" height="12" rx="2" fill="#0a2a0f"/>
        <text x="75" y="95" text-anchor="middle" font-size="9" font-family="monospace" fill="#1DB954">01</text>
        <rect x="112" y="83" width="26" height="18" rx="3" fill="#111" stroke="#1DB954" stroke-width="1.5"/>
        <rect x="115" y="86" width="20" height="12" rx="2" fill="#0a2a0f"/>
        <text x="125" y="95" text-anchor="middle" font-size="9" font-family="monospace" fill="#1DB954">10</text>
      `;
    default: return eye3D(75, 92, 11, 10) + eye3D(125, 92, 11, 10);
  }
}

function renderEyebrows() {
  const id = avatarState.eyebrows;
  const hc = darken(getHairColor(), 10);
  if (id === 'none') return '';
  switch (id) {
    case 'thick':
      return `<path d="M60,76 Q75,70 88,76" stroke="${hc}" stroke-width="4" fill="none" stroke-linecap="round"/>
              <path d="M112,76 Q125,70 140,76" stroke="${hc}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'thin':
      return `<path d="M62,78 Q75,74 86,78" stroke="${hc}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              <path d="M114,78 Q125,74 138,78" stroke="${hc}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    case 'arched':
      return `<path d="M62,80 Q70,70 86,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path d="M138,80 Q130,70 114,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case 'angry':
      return `<path d="M62,82 Q75,72 88,76" stroke="${hc}" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path d="M138,82 Q125,72 112,76" stroke="${hc}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 'unibrow':
      return `<path d="M60,78 Q75,72 100,76 Q125,72 140,78" stroke="${hc}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    default:
      return `<path d="M62,78 Q75,72 88,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path d="M112,78 Q125,72 138,78" stroke="${hc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
}

function starShape(cx, cy, r, color) {
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const oa = (Math.PI / 2 * 3) + (i * Math.PI * 2 / 5);
    const ia = oa + Math.PI / 5;
    pts.push(`${cx + Math.cos(oa) * r},${cy - Math.sin(oa) * r}`);
    pts.push(`${cx + Math.cos(ia) * (r * 0.45)},${cy - Math.sin(ia) * (r * 0.45)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${color}" stroke="#B8860B" stroke-width="1"/>
          <polygon points="${pts.join(' ')}" fill="url(#eyeShine)" opacity="0.3"/>`;
}

function renderNose() {
  const skin = getSkinTone();
  return `<g>
    <path d="M96,105 Q100,116 104,105" stroke="${darken(skin.color, 35)}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="112" rx="6" ry="2" fill="rgba(0,0,0,0.06)"/>
  </g>`;
}

function renderMouth() {
  const id = avatarState.mouth;
  switch (id) {
    case 'grin':
      return `<path d="M78,130 Q100,152 122,130" stroke="#444" stroke-width="1.5" fill="#c0392b"/>
              <path d="M78,130 Q100,137 122,130" fill="white"/>`;
    case 'neutral':
      return `<line x1="82" y1="132" x2="118" y2="132" stroke="#555" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'open':
      return `<ellipse cx="100" cy="134" rx="13" ry="11" fill="#8B1A1A" stroke="#555" stroke-width="1.5"/>
              <ellipse cx="100" cy="130" rx="10" ry="4" fill="rgba(255,255,255,0.15)"/>`;
    case 'smirk':
      return `<path d="M85,132 Q105,144 120,129" stroke="#555" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case 'tongue':
      return `<path d="M80,130 Q100,147 120,130" stroke="#555" stroke-width="2" fill="none"/>
              <ellipse cx="100" cy="143" rx="8" ry="7" fill="#e74c3c"/>
              <ellipse cx="100" cy="141" rx="5" ry="3" fill="rgba(255,150,150,0.4)"/>`;
    case 'sad':
      return `<path d="M82,138 Q100,125 118,138" stroke="#555" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    case 'o':
      return `<circle cx="100" cy="134" r="9" fill="#8B1A1A" stroke="#555" stroke-width="1.5"/>
              <ellipse cx="100" cy="131" rx="6" ry="3" fill="rgba(255,255,255,0.12)"/>`;
    case 'teeth':
      return `<path d="M78,130 Q100,148 122,130" stroke="#555" stroke-width="1.5" fill="#8B1A1A"/>
              <rect x="86" y="130" width="28" height="8" rx="1" fill="white"/>
              <line x1="93" y1="130" x2="93" y2="138" stroke="#ddd" stroke-width="0.5"/>
              <line x1="100" y1="130" x2="100" y2="138" stroke="#ddd" stroke-width="0.5"/>
              <line x1="107" y1="130" x2="107" y2="138" stroke="#ddd" stroke-width="0.5"/>`;
    case 'kiss':
      return `<ellipse cx="100" cy="134" rx="7" ry="8" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
              <ellipse cx="100" cy="131" rx="4" ry="2" fill="rgba(255,200,200,0.5)"/>`;
    default:
      return `<path d="M80,130 Q100,149 120,130" stroke="#555" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  }
}

function renderFacialHair() {
  const id = avatarState.facialHair;
  const hc = darken(getHairColor(), 5);
  if (id === 'none') return '';
  switch (id) {
    case 'stubble': {
      let dots = '';
      const seed = avatarState.face.length + avatarState.skin.length;
      for (let x = 72; x <= 128; x += 5) {
        for (let y = 125; y <= 165; y += 5) {
          if (((x * 7 + y * 13 + seed) % 10) < 6) {
            dots += `<circle cx="${x + ((x*3+y)%4)}" cy="${y + ((y*2+x)%4)}" r="0.8" fill="${hc}" opacity="0.5"/>`;
          }
        }
      }
      return dots;
    }
    case 'mustache':
      return `<path d="M82,122 Q90,118 100,122 Q110,118 118,122 Q115,128 100,128 Q85,128 82,122Z" fill="${hc}"/>`;
    case 'goatee':
      return `<path d="M88,135 Q100,150 112,135 Q110,160 100,165 Q90,160 88,135Z" fill="${hc}"/>`;
    case 'full':
      return `<path d="M82,122 Q90,118 100,122 Q110,118 118,122 Q115,128 100,128 Q85,128 82,122Z" fill="${hc}"/>
              <path d="M60,120 Q65,125 70,140 Q80,165 100,170 Q120,165 130,140 Q135,125 140,120 Q130,125 120,130 Q100,142 80,130 Q70,125 60,120Z" fill="${hc}"/>`;
    case 'soul':
      return `<ellipse cx="100" cy="145" rx="6" ry="5" fill="${hc}"/>`;
    default: return '';
  }
}

function renderHair() {
  const id = avatarState.hair;
  const hc = getHairColor();
  const hcHi = getHairColorObj().hi || lighten(hc, 30);
  if (id === 'none') return '';
  switch (id) {
    case 'short':
      return `<path d="M42,85 C42,40 65,22 100,22 C135,22 158,40 158,85 C158,65 150,38 100,38 C50,38 42,65 42,85Z" fill="url(#hairGrad)"/>
              <path d="M60,40 Q80,28 100,28 Q120,28 140,40" fill="none" stroke="${hcHi}" stroke-width="1" opacity="0.3"/>`;
    case 'crew':
      return `<path d="M45,82 C45,42 65,25 100,25 C135,25 155,42 155,82 C155,60 145,35 100,35 C55,35 45,60 45,82Z" fill="url(#hairGrad)"/>`;
    case 'spiky':
      return `<path d="M45,80 C45,42 65,25 100,25 C135,25 155,42 155,80 L145,55 L135,78 L125,48 L115,75 L105,40 L95,75 L85,48 L75,78 L65,55 L55,80Z" fill="url(#hairGrad)"/>`;
    case 'wavy':
      return `<path d="M38,95 C38,45 60,18 100,18 C140,18 162,45 162,95 C162,70 150,32 100,32 C50,32 38,70 38,95Z" fill="url(#hairGrad)"/>
              <path d="M38,95 Q45,80 38,70" stroke="url(#hairGrad)" stroke-width="8" fill="none"/>
              <path d="M162,95 Q155,80 162,70" stroke="url(#hairGrad)" stroke-width="8" fill="none"/>`;
    case 'long':
      return `<path d="M35,95 C35,40 60,15 100,15 C140,15 165,40 165,95 C165,70 148,28 100,28 C52,28 35,70 35,95Z" fill="url(#hairGrad)"/>
              <path d="M35,95 L32,160 Q38,165 48,155 L45,95Z" fill="url(#hairGrad)"/>
              <path d="M165,95 L168,160 Q162,165 152,155 L155,95Z" fill="url(#hairGrad)"/>`;
    case 'bob':
      return `<path d="M38,90 C38,42 62,18 100,18 C138,18 162,42 162,90 C162,65 148,30 100,30 C52,30 38,65 38,90Z" fill="url(#hairGrad)"/>
              <path d="M38,90 Q36,120 48,130 L52,90Z" fill="url(#hairGrad)"/>
              <path d="M162,90 Q164,120 152,130 L148,90Z" fill="url(#hairGrad)"/>`;
    case 'ponytail':
      return `<path d="M42,85 C42,40 65,22 100,22 C135,22 158,40 158,85 C158,65 150,38 100,38 C50,38 42,65 42,85Z" fill="url(#hairGrad)"/>
              <path d="M130,35 Q155,30 160,55 Q165,80 150,100 Q145,85 148,65 Q140,40 130,35Z" fill="url(#hairGrad)"/>`;
    case 'mohawk':
      return `<path d="M85,75 Q88,10 100,5 Q112,10 115,75 L108,40 Q100,15 92,40Z" fill="url(#hairGrad)"/>`;
    case 'curly':
      return `<path d="M40,90 C40,42 62,20 100,20 C138,20 160,42 160,90" fill="url(#hairGrad)"/>
              <circle cx="50" cy="55" r="12" fill="url(#hairGrad)"/><circle cx="72" cy="38" r="13" fill="url(#hairGrad)"/>
              <circle cx="100" cy="32" r="14" fill="url(#hairGrad)"/><circle cx="128" cy="38" r="13" fill="url(#hairGrad)"/>
              <circle cx="150" cy="55" r="12" fill="url(#hairGrad)"/><circle cx="42" cy="78" r="10" fill="url(#hairGrad)"/>
              <circle cx="158" cy="78" r="10" fill="url(#hairGrad)"/>`;
    case 'afro':
      return `<ellipse cx="100" cy="65" rx="75" ry="62" fill="url(#hairGrad)"/>
              <ellipse cx="85" cy="40" rx="20" ry="12" fill="${hcHi}" opacity="0.1"/>`;
    case 'buzz':
      return `<path d="M46,85 C46,48 66,30 100,30 C134,30 154,48 154,85 C154,68 144,40 100,40 C56,40 46,68 46,85Z" fill="url(#hairGrad)" opacity="0.75"/>`;
    case 'braids':
      return `<path d="M38,90 C38,42 62,18 100,18 C138,18 162,42 162,90 C162,65 148,30 100,30 C52,30 38,65 38,90Z" fill="url(#hairGrad)"/>
              <path d="M42,90 Q40,130 44,160 Q48,165 50,160 Q48,130 50,90Z" fill="url(#hairGrad)"/>
              <path d="M158,90 Q160,130 156,160 Q152,165 150,160 Q152,130 150,90Z" fill="url(#hairGrad)"/>
              <circle cx="44" cy="162" r="4" fill="url(#hairGrad)"/><circle cx="156" cy="162" r="4" fill="url(#hairGrad)"/>`;
    case 'topknot':
      return `<path d="M46,85 C46,48 66,30 100,30 C134,30 154,48 154,85 C154,68 144,40 100,40 C56,40 46,68 46,85Z" fill="url(#hairGrad)" opacity="0.75"/>
              <ellipse cx="100" cy="18" rx="18" ry="16" fill="url(#hairGrad)"/>
              <path d="M90,30 Q100,5 110,30" fill="url(#hairGrad)"/>`;
    default: return '';
  }
}

function renderGlasses() {
  const id = avatarState.glasses;
  if (id === 'none') return '';
  switch (id) {
    case 'round':
      return `<circle cx="75" cy="92" r="17" fill="url(#glassReflect)" stroke="#333" stroke-width="2.5"/>
              <circle cx="125" cy="92" r="17" fill="url(#glassReflect)" stroke="#333" stroke-width="2.5"/>
              <line x1="92" y1="92" x2="108" y2="92" stroke="#333" stroke-width="2.5"/>
              <line x1="58" y1="90" x2="42" y2="86" stroke="#333" stroke-width="2"/>
              <line x1="142" y1="90" x2="158" y2="86" stroke="#333" stroke-width="2"/>`;
    case 'square':
      return `<rect x="58" y="78" width="34" height="28" rx="4" fill="url(#glassReflect)" stroke="#333" stroke-width="2.5"/>
              <rect x="108" y="78" width="34" height="28" rx="4" fill="url(#glassReflect)" stroke="#333" stroke-width="2.5"/>
              <line x1="92" y1="92" x2="108" y2="92" stroke="#333" stroke-width="2.5"/>
              <line x1="58" y1="88" x2="42" y2="85" stroke="#333" stroke-width="2"/>
              <line x1="142" y1="88" x2="158" y2="85" stroke="#333" stroke-width="2"/>`;
    case 'aviator':
      return `<path d="M58,82 Q58,72 75,72 Q92,72 92,82 Q92,108 75,108 Q58,108 58,82Z" fill="rgba(100,180,255,0.18)" stroke="#999" stroke-width="2"/>
              <path d="M108,82 Q108,72 125,72 Q142,72 142,82 Q142,108 125,108 Q108,108 108,82Z" fill="rgba(100,180,255,0.18)" stroke="#999" stroke-width="2"/>
              <line x1="92" y1="82" x2="108" y2="82" stroke="#999" stroke-width="2"/>
              <line x1="58" y1="82" x2="40" y2="82" stroke="#999" stroke-width="2"/>
              <line x1="142" y1="82" x2="160" y2="82" stroke="#999" stroke-width="2"/>`;
    case 'cat':
      return `<path d="M58,95 Q58,78 68,76 Q78,74 88,78 Q92,80 92,90 Q92,105 75,108 Q58,105 58,95Z" fill="url(#glassReflect)" stroke="#333" stroke-width="2.5"/>
              <path d="M108,95 Q108,78 118,76 Q128,74 138,78 Q142,80 142,90 Q142,105 125,108 Q108,105 108,95Z" fill="url(#glassReflect)" stroke="#333" stroke-width="2.5"/>
              <line x1="92" y1="88" x2="108" y2="88" stroke="#333" stroke-width="2.5"/>
              <line x1="58" y1="90" x2="40" y2="85" stroke="#333" stroke-width="2"/>
              <line x1="142" y1="90" x2="160" y2="85" stroke="#333" stroke-width="2"/>`;
    case 'sport':
      return `<path d="M48,92 Q48,78 75,76 Q100,74 100,80 Q100,74 125,76 Q152,78 152,92 Q152,106 125,108 Q100,110 100,104 Q100,110 75,108 Q48,106 48,92Z" fill="rgba(0,0,0,0.15)" stroke="#555" stroke-width="2.5"/>`;
    case 'cyber':
      return `<rect x="52" y="80" width="40" height="22" rx="4" fill="rgba(0,0,0,0.6)" stroke="#1DB954" stroke-width="1.5"/>
              <rect x="108" y="80" width="40" height="22" rx="4" fill="rgba(0,0,0,0.6)" stroke="#1DB954" stroke-width="1.5"/>
              <line x1="92" y1="91" x2="108" y2="91" stroke="#1DB954" stroke-width="2"/>
              <line x1="52" y1="91" x2="38" y2="88" stroke="#1DB954" stroke-width="1.5"/>
              <line x1="148" y1="91" x2="162" y2="88" stroke="#1DB954" stroke-width="1.5"/>
              <rect x="56" y="84" width="12" height="4" rx="1" fill="#1DB954" opacity="0.6"/>
              <rect x="132" y="84" width="12" height="4" rx="1" fill="#1DB954" opacity="0.6"/>`;
    default: return '';
  }
}

function renderHeadphones() {
  const id = avatarState.headphones;
  if (id === 'none') return '';
  switch (id) {
    case 'over':
      return `<path d="M32,95 Q32,35 100,35 Q168,35 168,95" stroke="url(#hpMetal)" stroke-width="7" fill="none" stroke-linecap="round"/>
              <rect x="20" y="80" width="20" height="34" rx="9" fill="#222" stroke="#444" stroke-width="1.5"/>
              <rect x="160" y="80" width="20" height="34" rx="9" fill="#222" stroke="#444" stroke-width="1.5"/>
              <rect x="23" y="86" width="14" height="22" rx="6" fill="#444"/><rect x="163" y="86" width="14" height="22" rx="6" fill="#444"/>
              <rect x="25" y="88" width="4" height="18" rx="2" fill="#555"/><rect x="165" y="88" width="4" height="18" rx="2" fill="#555"/>`;
    case 'on':
      return `<path d="M36,90 Q36,38 100,38 Q164,38 164,90" stroke="#555" stroke-width="5" fill="none" stroke-linecap="round"/>
              <circle cx="36" cy="95" r="13" fill="#444" stroke="#555" stroke-width="1.5"/>
              <circle cx="164" cy="95" r="13" fill="#444" stroke="#555" stroke-width="1.5"/>
              <circle cx="36" cy="95" r="8" fill="#666"/><circle cx="164" cy="95" r="8" fill="#666"/>
              <circle cx="34" cy="93" r="3" fill="rgba(255,255,255,0.1)"/>
              <circle cx="162" cy="93" r="3" fill="rgba(255,255,255,0.1)"/>`;
    case 'beats':
      return `<path d="M30,92 Q30,30 100,30 Q170,30 170,92" stroke="#e74c3c" stroke-width="8" fill="none" stroke-linecap="round"/>
              <rect x="16" y="76" width="24" height="38" rx="11" fill="#e74c3c"/>
              <rect x="160" y="76" width="24" height="38" rx="11" fill="#e74c3c"/>
              <text x="28" y="101" font-size="15" font-weight="bold" fill="white" text-anchor="middle">b</text>
              <text x="172" y="101" font-size="15" font-weight="bold" fill="white" text-anchor="middle">b</text>
              <rect x="19" y="80" width="6" height="10" rx="3" fill="rgba(255,255,255,0.15)"/>`;
    case 'moodify':
      return `<path d="M30,92 Q30,30 100,30 Q170,30 170,92" stroke="#1DB954" stroke-width="8" fill="none" stroke-linecap="round"/>
              <rect x="16" y="76" width="24" height="38" rx="11" fill="#1DB954"/>
              <rect x="160" y="76" width="24" height="38" rx="11" fill="#1DB954"/>
              <text x="28" y="101" font-size="13" font-weight="bold" fill="black" text-anchor="middle">&#9834;</text>
              <text x="172" y="101" font-size="13" font-weight="bold" fill="black" text-anchor="middle">&#9834;</text>`;
    case 'airpods':
      return `<ellipse cx="33" cy="108" rx="5" ry="7" fill="white" stroke="#ddd" stroke-width="1"/>
              <line x1="33" y1="115" x2="33" y2="128" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <ellipse cx="167" cy="108" rx="5" ry="7" fill="white" stroke="#ddd" stroke-width="1"/>
              <line x1="167" y1="115" x2="167" y2="128" stroke="white" stroke-width="2.5" stroke-linecap="round"/>`;
    default: return '';
  }
}

function renderAccessories() {
  const id = avatarState.accessories;
  if (id === 'none') return '';
  switch (id) {
    case 'earring_l':
      return `<circle cx="28" cy="108" r="4" fill="none" stroke="#FFD700" stroke-width="1.5"/>
              <circle cx="28" cy="112" r="2" fill="#FFD700"/>`;
    case 'earring_both':
      return `<circle cx="28" cy="108" r="4" fill="none" stroke="#FFD700" stroke-width="1.5"/>
              <circle cx="28" cy="112" r="2" fill="#FFD700"/>
              <circle cx="172" cy="108" r="4" fill="none" stroke="#FFD700" stroke-width="1.5"/>
              <circle cx="172" cy="112" r="2" fill="#FFD700"/>`;
    case 'nose_ring':
      return `<circle cx="104" cy="112" r="3" fill="none" stroke="#C0C0C0" stroke-width="1.2"/>
              <circle cx="104" cy="115" r="1" fill="#C0C0C0"/>`;
    case 'bandana':
      return `<path d="M38,70 Q100,58 162,70 Q160,78 100,72 Q40,78 38,70Z" fill="#e74c3c"/>
              <path d="M156,72 L168,82 L162,85 L152,76Z" fill="#e74c3c"/>`;
    case 'cap':
      return `<path d="M35,75 C35,42 60,22 100,22 C140,22 165,42 165,75 L170,78 L30,78Z" fill="#333"/>
              <rect x="25" y="74" width="80" height="8" rx="2" fill="#222"/>`;
    default: return '';
  }
}


// ========================
// FULL RENDER
// ========================

function renderAvatar() {
  const svg = document.getElementById('avatarSVG');
  if (!svg) return;
  svg.innerHTML = `
    ${renderDefs()}
    ${renderBg()}
    ${renderEars()}
    ${renderFace()}
    ${renderNose()}
    ${renderEyebrows()}
    ${renderEyes()}
    ${renderMouth()}
    ${renderFacialHair()}
    ${renderHair()}
    ${renderGlasses()}
    ${renderHeadphones()}
    ${renderAccessories()}
  `;
}


// ========================
// COLOR UTILITIES
// ========================

function darken(hex, amt) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const n = parseInt(c, 16);
  let r = Math.max(0, (n >> 16) - amt);
  let g = Math.max(0, ((n >> 8) & 0xFF) - amt);
  let b = Math.max(0, (n & 0xFF) - amt);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function lighten(hex, amt) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const n = parseInt(c, 16);
  let r = Math.min(255, (n >> 16) + amt);
  let g = Math.min(255, ((n >> 8) & 0xFF) + amt);
  let b = Math.min(255, (n & 0xFF) + amt);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}


// ========================
// BUILD UI OPTIONS
// ========================

function buildOptions() {
  buildFaceOptions();
  buildSkinOptions();
  buildHairOptions();
  buildHairColorOptions();
  buildEyeOptions();
  buildEyeColorOptions();
  buildEyebrowOptions();
  buildMouthOptions();
  buildFacialHairOptions();
  buildGlassesOptions();
  buildHeadphoneOptions();
  buildAccessoryOptions();
  buildBgOptions();
}

function buildFaceOptions() {
  const c = document.getElementById('faceOptions'); if (!c) return;
  c.innerHTML = FACES.map(f => `
    <button class="option-btn ${avatarState.face === f.id ? 'active' : ''}" data-type="face" data-value="${f.id}" title="${f.label}">
      <svg viewBox="0 0 200 200"><path d="${f.path}" fill="#FDDCB1" stroke="#ddd" stroke-width="2"/></svg>
    </button>`).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildSkinOptions() {
  const c = document.getElementById('skinOptions'); if (!c) return;
  c.innerHTML = SKIN_TONES.map(s => `
    <button class="color-swatch ${avatarState.skin === s.id ? 'active' : ''}" data-type="skin" data-value="${s.id}" style="background:${s.color}" title="${s.id}"></button>`).join('');
  c.querySelectorAll('.color-swatch').forEach(b => b.addEventListener('click', handleOption));
}

function buildHairOptions() {
  const c = document.getElementById('hairOptions'); if (!c) return;
  c.innerHTML = HAIR_STYLES.map(h => `
    <button class="option-btn ${avatarState.hair === h.id ? 'active' : ''}" data-type="hair" data-value="${h.id}" title="${h.label}">
      <svg viewBox="0 0 200 200">${getHairPreview(h.id)}</svg>
    </button>`).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function getHairPreview(hairId) {
  const facePath = FACES[0].path;
  const oldHair = avatarState.hair;
  avatarState.hair = hairId;
  const hairSvg = renderHair();
  avatarState.hair = oldHair;
  return `${renderDefs()}<path d="${facePath}" fill="#FDDCB1" stroke="#ddd" stroke-width="1"/>${hairSvg}`;
}

function buildHairColorOptions() {
  const c = document.getElementById('hairColorOptions'); if (!c) return;
  c.innerHTML = HAIR_COLORS.map(h => `
    <button class="color-swatch ${avatarState.hairColor === h.id ? 'active' : ''}" data-type="hairColor" data-value="${h.id}" style="background:${h.color}" title="${h.id}"></button>`).join('');
  c.querySelectorAll('.color-swatch').forEach(b => b.addEventListener('click', handleOption));
}

function buildEyeOptions() {
  const c = document.getElementById('eyeOptions'); if (!c) return;
  c.innerHTML = EYES.map(e => {
    const old = avatarState.eyes; avatarState.eyes = e.id;
    const svg = renderEyes(); avatarState.eyes = old;
    return `<button class="option-btn ${avatarState.eyes === e.id ? 'active' : ''}" data-type="eyes" data-value="${e.id}" title="${e.label}">
      <svg viewBox="55 72 90 40">${renderDefs()}${svg}</svg></button>`;
  }).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildEyeColorOptions() {
  const c = document.getElementById('eyeColorOptions'); if (!c) return;
  c.innerHTML = EYE_COLORS.map(e => `
    <button class="color-swatch ${avatarState.eyeColor === e.id ? 'active' : ''}" data-type="eyeColor" data-value="${e.id}" style="background:${e.color}" title="${e.id}"></button>`).join('');
  c.querySelectorAll('.color-swatch').forEach(b => b.addEventListener('click', handleOption));
}

function buildEyebrowOptions() {
  const c = document.getElementById('eyebrowOptions'); if (!c) return;
  c.innerHTML = EYEBROWS.map(eb => {
    const old = avatarState.eyebrows; avatarState.eyebrows = eb.id;
    const svg = renderEyebrows(); avatarState.eyebrows = old;
    return `<button class="option-btn ${avatarState.eyebrows === eb.id ? 'active' : ''}" data-type="eyebrows" data-value="${eb.id}" title="${eb.label}">
      <svg viewBox="50 65 100 25">${svg || '<text x="100" y="82" text-anchor="middle" fill="#666" font-size="16">&#10007;</text>'}</svg></button>`;
  }).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildMouthOptions() {
  const c = document.getElementById('mouthOptions'); if (!c) return;
  c.innerHTML = MOUTHS.map(m => {
    const old = avatarState.mouth; avatarState.mouth = m.id;
    const svg = renderMouth(); avatarState.mouth = old;
    return `<button class="option-btn ${avatarState.mouth === m.id ? 'active' : ''}" data-type="mouth" data-value="${m.id}" title="${m.label}">
      <svg viewBox="70 120 60 40">${svg}</svg></button>`;
  }).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildFacialHairOptions() {
  const c = document.getElementById('facialHairOptions'); if (!c) return;
  c.innerHTML = FACIAL_HAIR.map(fh => {
    const old = avatarState.facialHair; avatarState.facialHair = fh.id;
    const svg = fh.id === 'none' ? '<text x="100" y="145" text-anchor="middle" fill="#666" font-size="24">&#10007;</text>' : renderFacialHair();
    avatarState.facialHair = old;
    return `<button class="option-btn ${avatarState.facialHair === fh.id ? 'active' : ''}" data-type="facialHair" data-value="${fh.id}" title="${fh.label}">
      <svg viewBox="60 115 80 60">${svg}</svg></button>`;
  }).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildGlassesOptions() {
  const c = document.getElementById('glassesOptions'); if (!c) return;
  c.innerHTML = GLASSES.map(g => {
    const old = avatarState.glasses; avatarState.glasses = g.id;
    const svg = g.id === 'none' ? '<text x="100" y="100" text-anchor="middle" fill="#666" font-size="28">&#10007;</text>' : renderGlasses();
    avatarState.glasses = old;
    return `<button class="option-btn ${avatarState.glasses === g.id ? 'active' : ''}" data-type="glasses" data-value="${g.id}" title="${g.label}">
      <svg viewBox="30 70 140 50">${renderDefs()}${svg}</svg></button>`;
  }).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildHeadphoneOptions() {
  const c = document.getElementById('headphoneOptions'); if (!c) return;
  c.innerHTML = HEADPHONES.map(h => {
    const old = avatarState.headphones; avatarState.headphones = h.id;
    const svg = h.id === 'none' ? '<text x="100" y="100" text-anchor="middle" fill="#666" font-size="28">&#10007;</text>' : renderHeadphones();
    avatarState.headphones = old;
    return `<button class="option-btn ${avatarState.headphones === h.id ? 'active' : ''}" data-type="headphones" data-value="${h.id}" title="${h.label}">
      <svg viewBox="10 20 180 120">${renderDefs()}${svg}</svg></button>`;
  }).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildAccessoryOptions() {
  const c = document.getElementById('accessoryOptions'); if (!c) return;
  c.innerHTML = ACCESSORIES.map(a => {
    const old = avatarState.accessories; avatarState.accessories = a.id;
    const svg = a.id === 'none' ? '<text x="100" y="105" text-anchor="middle" fill="#666" font-size="28">&#10007;</text>' : renderAccessories();
    avatarState.accessories = old;
    return `<button class="option-btn ${avatarState.accessories === a.id ? 'active' : ''}" data-type="accessories" data-value="${a.id}" title="${a.label}">
      <svg viewBox="15 55 170 90">${svg}</svg></button>`;
  }).join('');
  c.querySelectorAll('.option-btn').forEach(b => b.addEventListener('click', handleOption));
}

function buildBgOptions() {
  const c = document.getElementById('bgOptions'); if (!c) return;
  c.innerHTML = BG_COLORS.map(b => {
    const bgStyle = b.id === 'none' ? 'background:transparent;border-style:dashed;' :
      b.id === 'gradient1' ? 'background:linear-gradient(135deg,#1DB954,#191414)' :
      b.id === 'gradient2' ? 'background:linear-gradient(135deg,#7C3AED,#EC4899)' :
      `background:${b.color}`;
    return `<button class="color-swatch ${avatarState.bg === b.id ? 'active' : ''}" data-type="bg" data-value="${b.id}" style="${bgStyle}" title="${b.label}"></button>`;
  }).join('');
  c.querySelectorAll('.color-swatch').forEach(b => b.addEventListener('click', handleOption));
}


// ========================
// HANDLERS
// ========================

function handleOption(e) {
  const btn = e.currentTarget;
  avatarState[btn.dataset.type] = btn.dataset.value;
  buildOptions();
  renderAvatar();
}

function randomAvatar() {
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  avatarState.face = pick(FACES).id;
  avatarState.skin = pick(SKIN_TONES).id;
  avatarState.hair = pick(HAIR_STYLES).id;
  avatarState.hairColor = pick(HAIR_COLORS).id;
  avatarState.eyes = pick(EYES).id;
  avatarState.eyeColor = pick(EYE_COLORS).id;
  avatarState.eyebrows = pick(EYEBROWS).id;
  avatarState.mouth = pick(MOUTHS).id;
  avatarState.facialHair = pick(FACIAL_HAIR).id;
  avatarState.glasses = pick(GLASSES).id;
  avatarState.headphones = pick(HEADPHONES).id;
  avatarState.accessories = pick(ACCESSORIES).id;
  avatarState.bg = pick(BG_COLORS).id;
  buildOptions();
  renderAvatar();
}

function resetAvatar() {
  Object.assign(avatarState, { ...defaults });
  buildOptions();
  renderAvatar();
}


// ========================
// SAVE / LOAD
// ========================

async function saveAvatar() {
  const statusEl = document.getElementById('saveStatus');

  const token = localStorage.getItem('moodify_token');
  if (!token) {
    statusEl.textContent = 'Please log in to save your avatar.';
    statusEl.className = 'save-status error';
    return;
  }

  statusEl.textContent = 'Saving...';
  statusEl.className = 'save-status';

  try {
    // Build base URL – works whether served at port 5000 or file://
    const base = window.location.port
      ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
      : window.location.origin;

    const res = await fetch(`${base}/api/auth/avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: avatarState }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      statusEl.textContent = data.message || `Server error (${res.status})`;
      statusEl.className = 'save-status error';
      return;
    }

    // Store locally so navbar updates immediately
    const user = JSON.parse(localStorage.getItem('moodify_user') || '{}');
    user.avatar = { ...avatarState };
    localStorage.setItem('moodify_user', JSON.stringify(user));

    statusEl.textContent = '\u2713 Avatar saved! Redirecting...';
    statusEl.className = 'save-status success';

    // Redirect back to main page so avatar shows in profile
    setTimeout(() => { window.location.href = '../index.html'; }, 1200);
    return;
  } catch (err) {
    console.error('Save avatar error:', err);
    statusEl.textContent = 'Network error \u2013 make sure the server is running (node server.js).';
    statusEl.className = 'save-status error';
  }

  setTimeout(() => { statusEl.textContent = ''; }, 4000);
}

function loadSavedAvatar() {
  const user = JSON.parse(localStorage.getItem('moodify_user') || '{}');
  if (user.avatar && typeof user.avatar === 'object') {
    for (const key of Object.keys(defaults)) {
      if (user.avatar[key] !== undefined) {
        avatarState[key] = user.avatar[key];
      }
    }
  }
}


// ========================
// DOWNLOAD AS PNG
// ========================

function downloadAvatar() {
  const svgEl = document.getElementById('avatarSVG');
  if (!svgEl) return;
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, 512, 512);
    const link = document.createElement('a');
    link.download = 'moodify-avatar.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}


// ========================
// INIT
// ========================

document.addEventListener('DOMContentLoaded', () => {
  loadSavedAvatar();
  buildOptions();
  renderAvatar();
});
