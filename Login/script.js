// ========================
// VIDEO PLAY FIX
// ========================
const API_BASE = 'http://localhost:5000';
const bgVideo = document.getElementById("bgVideo");
document.addEventListener("click", () => {
    if (bgVideo.paused) bgVideo.play();
});

// Split the heading into per-letter spans for wave animation (LOGIN PAGE)
const titleEl = document.querySelector('.login-container h2');
let letters = [];
if (titleEl) {
    const text = titleEl.textContent || '';
    titleEl.textContent = '';
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const span = document.createElement('span');
        span.className = 'wave-letter idle';
        span.textContent = ch;
        titleEl.appendChild(span);
    }
    letters = Array.from(titleEl.querySelectorAll('.wave-letter'));
}

// ========================
// PASSWORD TOGGLE (Show/Hide)
// ========================
function togglePassword(inputId, toggleEl) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        toggleEl.classList.add('active');
    } else {
        input.type = 'password';
        toggleEl.classList.remove('active');
    }
}

// ========================
// EMAIL @gmail.com AUTO-FILL
// ========================
const signupEmailInput = document.getElementById('signupEmail');
if (signupEmailInput) {
    signupEmailInput.addEventListener('input', () => {
        let val = signupEmailInput.value;
        // If user hasn't typed @, don't interfere
        // On blur, auto-append @gmail.com if no @ present
    });
    signupEmailInput.addEventListener('blur', () => {
        let val = signupEmailInput.value.trim();
        if (val && !val.includes('@')) {
            signupEmailInput.value = val + '@gmail.com';
        }
    });
}

// ========================
// USERNAME AUTO-SUGGESTIONS
// ========================
const fullnameInput = document.getElementById('signupFullname');
const usernameInput = document.getElementById('signupUsername');
const suggestionsBox = document.getElementById('usernameSuggestions');

function generateUsernames(name) {
    if (!name) return [];
    const parts = name.trim().toLowerCase().split(/\s+/);
    const first = parts[0] || '';
    const last = parts[parts.length - 1] || '';
    const rand2 = Math.floor(10 + Math.random() * 90);
    const rand3 = Math.floor(100 + Math.random() * 900);
    const rand4 = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear().toString().slice(-2);

    const suggestions = [];
    if (first) suggestions.push(first + rand3);
    if (first && last && first !== last) suggestions.push(first + '_' + last);
    if (first && last && first !== last) suggestions.push(first + '.' + last + rand2);
    if (first) suggestions.push(first + '_' + rand4);
    if (first && last && first !== last) suggestions.push(last + '.' + first + year);
    if (first) suggestions.push(first + year + rand2);

    return [...new Set(suggestions)].slice(0, 5);
}

if (fullnameInput && usernameInput && suggestionsBox) {
    fullnameInput.addEventListener('input', () => {
        const name = fullnameInput.value.trim();
        const usernames = generateUsernames(name);
        if (usernames.length > 0) {
            suggestionsBox.innerHTML = usernames
                .map(u => `<div class="username-suggestion-item">${u}</div>`)
                .join('');
            suggestionsBox.classList.add('show');
        } else {
            suggestionsBox.classList.remove('show');
        }
    });

    suggestionsBox.addEventListener('click', (e) => {
        if (e.target.classList.contains('username-suggestion-item')) {
            usernameInput.value = e.target.textContent;
            suggestionsBox.classList.remove('show');
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== fullnameInput) {
            suggestionsBox.classList.remove('show');
        }
    });

    // Show suggestions when focusing on username field
    usernameInput.addEventListener('focus', () => {
        const name = fullnameInput.value.trim();
        if (name) {
            const usernames = generateUsernames(name);
            if (usernames.length > 0) {
                suggestionsBox.innerHTML = usernames
                    .map(u => `<div class="username-suggestion-item">${u}</div>`)
                    .join('');
                suggestionsBox.classList.add('show');
            }
        }
    });
}

// ========================
// SIGNUP FORM HANDLER
// ========================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const values = Object.fromEntries(formData);
        console.log('Signup submitted:', values);
        if (!values.mobile || !/^[0-9]{10}$/.test(values.mobile)) {
            alert('Please enter a valid 10-digit mobile number (digits only)');
            return;
        }
        // Password strength validation
        const pwd = values.password || '';
        if (pwd.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        if (!/[a-z]/.test(pwd)) {
            alert('Password must contain at least 1 lowercase letter');
            return;
        }
        if (!/[A-Z]/.test(pwd)) {
            alert('Password must contain at least 1 uppercase letter');
            return;
        }
        if (!/[0-9]/.test(pwd)) {
            alert('Password must contain at least 1 number');
            return;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
            alert('Password must contain at least 1 special character (!@#$%^&*)');
            return;
        }
        if (pwd !== values.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const res = await fetch(API_BASE + '/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    mobile: values.mobile,
                    password: values.password
                })
            });
            const data = await res.json();
            alert(data.message);
            if (res.ok) {
                // If the server returns a token on signup, store it so user is auto-logged-in
                if (data.token) {
                    localStorage.setItem('moodify_token', data.token);
                    localStorage.setItem('moodify_user', JSON.stringify(data.user || {}));
                    window.location.href = '../index.html';
                } else {
                    // No token returned – redirect to login page
                    window.location.href = 'index.html';
                }
            }
        } catch (err) {
            console.error('signup error', err);
            alert('Network error');
        }
    });
}

const signupBtn = document.getElementById('signupBtn');
if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        const clickSound = document.getElementById('clickSound');
        if (clickSound) clickSound.play();
    });
}

// ========================
// DELETE ACCOUNT FLOW
// ========================
const deleteForm = document.getElementById('deleteAccountForm');
if (deleteForm) {
    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const contact =
            document.getElementById('deleteEmail').value.trim() ||
            document.getElementById('deleteMobile').value.trim();

        if (!contact) {
            alert('Please enter your email or mobile number');
            return;
        }

        const confirmDelete = confirm(
            '⚠️ WARNING: This action is permanent!\n\n' +
            'Your account and all associated data will be permanently deleted.\n\n' +
            'You can create a new account after deletion.\n\n' +
            'Are you sure you want to delete your account?'
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(API_BASE + '/api/auth/delete-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact })
            });
            const data = await res.json();
            alert(data.message);
            if (res.ok) {
                window.location.href = 'signup.html';
            }
        } catch (err) {
            console.error('delete-account error', err);
            alert('Network error. Please try again.');
        }
    });
}


// ========================
// THREE SCENE SETUP
// ========================
if (typeof THREE === 'undefined') {
  console.warn('Three.js not loaded – skipping 3D scene.');
} else {
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,1.5,6);

// LIGHTS
const ambient = new THREE.AmbientLight(0xffffff,0.6);
scene.add(ambient);

const mainLight = new THREE.PointLight(0xff00ff,2);
mainLight.position.set(5,5,5);
scene.add(mainLight);

// ========================
// LOAD MODELS
// ========================
let panda, mixer;
let headphoneMaterial;
let leftSpeaker, rightSpeaker;

const loader = new THREE.GLTFLoader();

// PANDA
loader.load("models/panda.glb", function(gltf){
    panda = gltf.scene;
    panda.scale.set(1.5,1.5,1.5);
    panda.position.y = -1;
    scene.add(panda);

    mixer = new THREE.AnimationMixer(panda);
    gltf.animations.forEach((clip)=>{
        mixer.clipAction(clip).play();
    });

    panda.traverse((child)=>{
        if(child.isMesh){
            headphoneMaterial = child.material;
            headphoneMaterial.emissive = new THREE.Color(0xff00ff);
        }
    });
});

// SPEAKERS
loader.load("models/speaker.glb", function(gltf){
    leftSpeaker = gltf.scene;
    leftSpeaker.scale.set(1.5,1.5,1.5);
    leftSpeaker.position.set(-3,-1,0);
    scene.add(leftSpeaker);

    rightSpeaker = gltf.scene.clone();
    rightSpeaker.position.set(3,-1,0);
    scene.add(rightSpeaker);
});

// ========================
// PARTICLES
// ========================
const particlesGeometry = new THREE.BufferGeometry();
const count = 1500;
const positions = new Float32Array(count * 3);

for(let i=0;i<count*3;i++){
    positions[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
const particlesMaterial = new THREE.PointsMaterial({size:0.03,color:0xffffff});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ========================
// AUDIO ANALYSER
// ========================
const music = document.getElementById("music");
let audioCtx, analyser, dataArray;
if (music) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(music);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 64;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
} else {
  dataArray = new Uint8Array(32);
}

// ========================
// ANIMATION LOOP
// ========================
function animate(){
    requestAnimationFrame(animate);

    if(mixer) mixer.update(0.02);

    if (analyser) analyser.getByteFrequencyData(dataArray);
    let bass = dataArray[1] / 255;

    // animate header letters: create a wave that reacts to bass
    if (letters && letters.length) {
        const t = performance.now() / 1000;
        letters.forEach((el, i) => {
            const base = Math.sin(t * 8 + i * 0.6);
            const amp = 6 + bass * 36; // max vertical px
            const y = base * amp;
            const scale = 1 + (Math.abs(base) * bass * 0.4);
            el.style.transform = `translateY(${ -Math.abs(y) }px) scale(${scale})`;
            if (bass > 0.12) el.classList.remove('idle'); else el.classList.add('idle');
        });
    }

    if(panda) {
        panda.rotation.y += bass * 0.1;
        panda.position.y = -1 + bass * 0.6;
    }

    if(headphoneMaterial){
        headphoneMaterial.emissiveIntensity = 1 + bass * 4;
    }

    if(leftSpeaker && rightSpeaker){
        leftSpeaker.scale.y = 1.5 + bass * 0.3;
        rightSpeaker.scale.y = 1.5 + bass * 0.3;
    }

    bgVideo.style.filter = `brightness(${0.6 + bass * 0.4}) contrast(1.1)`;

    particles.rotation.y += 0.0005;

    renderer.render(scene,camera);
}
animate();
} // end of THREE.js guard

// ========================
// LOGIN TRANSITION (now with actual API auth)
// ========================
document.getElementById("loginBtn").addEventListener("click", async ()=>{
    const clickSound = document.getElementById("clickSound");
    if (clickSound) clickSound.play();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const errorEl = document.getElementById("loginError");

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
        if (errorEl) { errorEl.textContent = 'Please enter email and password'; errorEl.style.display = 'block'; }
        return;
    }

    try {
        const res = await fetch(API_BASE + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) {
            if (errorEl) { errorEl.textContent = data.message || 'Login failed'; errorEl.style.display = 'block'; }
            return;
        }

        // Store token & user info
        localStorage.setItem('moodify_token', data.token);
        localStorage.setItem('moodify_user', JSON.stringify(data.user));

        // Redirect to main app
        window.location.href = '../index.html';

    } catch (err) {
        console.error('Login error', err);
        if (errorEl) { errorEl.textContent = 'Network error – is the server running?'; errorEl.style.display = 'block'; }
    }
});

// If user is already logged in and visits login page, redirect to main app
if (localStorage.getItem('moodify_token')) {
    window.location.href = '../index.html';
}