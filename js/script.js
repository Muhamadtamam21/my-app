/* ============================================
   PORTFOLIO SPA — SCRIPT.JS
============================================ */

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : '';

// ============================================
// SPA NAVIGATION
// ============================================
let currentSection = 'home';

function openSection(id) {
  if (currentSection === id) { closeSidebar(); return; }

  const prev = document.getElementById(currentSection);
  const next = document.getElementById(id);
  if (!next) return;

  if (prev) prev.classList.remove('active');
  next.classList.add('active');
  currentSection = id;

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === id);
  });

  closeSidebar();
  onSectionEnter(id);
}

function onSectionEnter(id) {
  if (id === 'skill') animateSkillBars();
  if (id === 'feedback') loadFeedback();
}

// ============================================
// SIDEBAR
// ============================================
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');
const overlay   = document.getElementById('overlay');

function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  hamburger.classList.add('open');
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  hamburger.classList.remove('open');
}

hamburger.addEventListener('click', () =>
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
);
overlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openSection(link.dataset.section);
  });
});

// ============================================
// SKILL BARS ANIMATION
// ============================================
let skillsAnimated = false;
function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const w = bar.dataset.width;
    setTimeout(() => { bar.style.width = w + '%'; }, 80);
  });
}

// ============================================
// DOWNLOAD — rahmad.cloud per-platform
// ============================================
const DL_ENDPOINTS = {
  tiktok:     'https://api.rahmad.cloud/api/tiktok/download',
  instagram:  'https://api.rahmad.cloud/api/instagram',
  ytmp4:      'https://api.rahmad.cloud/api/ytmp4/download',
  ytmp3:      'https://api.rahmad.cloud/api/ytmp3/download',
  facebook:   'https://api.rahmad.cloud/api/facebook/download',
  twitter:    'https://api.rahmad.cloud/api/twitter/download',
  pinterest:  'https://api.rahmad.cloud/api/pinterest/download',
  snapchat:   'https://api.rahmad.cloud/api/snapchat/download',
  spotify:    'https://api.rahmad.cloud/api/spotify/download',
  soundcloud: 'https://api.rahmad.cloud/api/soundcloud/download',
  threads:    'https://api.rahmad.cloud/api/threads/download',
  terabox:    'https://api.rahmad.cloud/api/terabox/download',
  capcut:     'https://api.rahmad.cloud/api/capcut/download',
  douyin:     'https://api.rahmad.cloud/api/douyin/download',
  bluesky:    'https://api.rahmad.cloud/api/bluesky/download',
};

function detectPlatform(url) {
  const u = url.toLowerCase();
  if (u.includes('tiktok.com') || u.includes('vm.tiktok')) return 'tiktok';
  if (u.includes('instagram.com'))                          return 'instagram';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'ytmp4';
  if (u.includes('facebook.com') || u.includes('fb.watch'))return 'facebook';
  if (u.includes('twitter.com') || u.includes('x.com'))    return 'twitter';
  if (u.includes('pinterest.com') || u.includes('pin.it')) return 'pinterest';
  if (u.includes('snapchat.com'))                          return 'snapchat';
  if (u.includes('spotify.com'))                           return 'spotify';
  if (u.includes('soundcloud.com'))                        return 'soundcloud';
  if (u.includes('threads.net'))                           return 'threads';
  if (u.includes('terabox.com'))                           return 'terabox';
  if (u.includes('capcut.com'))                            return 'capcut';
  if (u.includes('douyin.com'))                            return 'douyin';
  if (u.includes('bsky.app'))                              return 'bluesky';
  return null;
}

function extractDownloadItems(data) {
  const items = [];
  const addLink = (label, url, quality, icon) => {
    if (url && typeof url === 'string' && url.startsWith('http')) {
      items.push({ label, url, quality: quality || '', icon: icon || 'fa-download' });
    }
  };

  const sources = [data, data?.result, data?.data].filter(Boolean);
  for (const s of sources) {
    if (typeof s !== 'object') continue;
    addLink('Video (No Watermark)', s.video_url,   'MP4', 'fa-video');
    addLink('Video (No Watermark)', s.video,       'MP4', 'fa-video');
    addLink('Video HD',             s.video_hd,    'HD',  'fa-video');
    addLink('Video + Watermark',    s.video_wm,    'SD',  'fa-video');
    addLink('Video MP4',            s.mp4,         'MP4', 'fa-video');
    addLink('Video HD',             s.hd,          'HD',  'fa-video');
    addLink('Video SD',             s.sd,          'SD',  'fa-video');
    addLink('Audio MP3',            s.music,       'MP3', 'fa-music');
    addLink('Audio MP3',            s.audio,       'MP3', 'fa-music');
    addLink('Audio MP3',            s.mp3,         'MP3', 'fa-music');
    addLink('Download',             s.download_url,'',    'fa-download');
    addLink('Download',             s.link,        '',    'fa-download');
    if (s.url && typeof s.url === 'string') addLink('Download', s.url, '', 'fa-download');

    if (Array.isArray(s.medias)) {
      s.medias.forEach((m, i) => {
        const ext = m.extension || m.type || '';
        const icon = ext.includes('mp3') || ext.includes('audio') ? 'fa-music' : 'fa-video';
        addLink(m.quality || ext || `Link ${i+1}`, m.url, m.quality, icon);
      });
    }
    if (Array.isArray(s.data)) {
      s.data.forEach((m, i) => {
        const ext = m.type || m.quality || '';
        const icon = ext.includes('mp3') || ext.includes('audio') ? 'fa-music' : 'fa-video';
        addLink(m.quality || ext || `Link ${i+1}`, m.url, m.quality, icon);
      });
    }
  }

  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

async function handleDownload() {
  const urlInput = document.getElementById('downloadUrl');
  const url = urlInput.value.trim();
  const loading = document.getElementById('dlLoading');
  const result  = document.getElementById('dlResult');
  const error   = document.getElementById('dlError');
  const btn     = document.getElementById('dlBtn');

  result.classList.add('hidden');
  result.innerHTML = '';
  error.classList.add('hidden');

  if (!url) { showDlError(error, '⚠️ Masukkan URL terlebih dahulu.'); return; }

  const platform = detectPlatform(url);
  if (!platform) {
    showDlError(error, '⚠️ Platform tidak didukung. Coba: TikTok, YouTube, Instagram, Facebook, Twitter, dll.');
    return;
  }

  loading.classList.remove('hidden');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Fetching...';

  try {
    const apiUrl = `${DL_ENDPOINTS[platform]}?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    loading.classList.add('hidden');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-magnifying-glass"></i> Fetch';

    if (!data.success && data.success !== undefined) {
      showDlError(error, data.message || data.error || 'Gagal mengambil media.');
      return;
    }

    const items = extractDownloadItems(data);
    if (!items.length) {
      showDlError(error, '⚠️ Tidak ada link download ditemukan.');
      return;
    }

    const d = (data.result && typeof data.result === 'object') ? data.result : data;
    let html = '<div style="margin-bottom:14px;">';
    const title   = d.title || d.name || data.title || '';
    const creator = d.creator || d.author || d.nickname || d.uploader || data.creator || '';
    const thumb   = d.thumbnail || d.thumb || d.cover || d.image || data.thumbnail || '';
    if (title)   html += `<div style="font-weight:600;color:var(--text-primary);margin-bottom:4px;">${escHtml(title)}</div>`;
    if (creator) html += `<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:8px;">👤 ${escHtml(creator)}</div>`;
    if (thumb)   html += `<img src="${escHtml(thumb)}" alt="thumb" style="width:100%;border-radius:10px;margin-bottom:10px;max-height:200px;object-fit:cover;">`;
    html += '</div>';

    html += '<div style="font-size:0.8rem;color:var(--cyan);font-weight:600;margin-bottom:8px;">✅ Pilih format download:</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
    items.forEach(item => {
      html += `
        <a href="${escHtml(item.url)}" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;
            background:linear-gradient(135deg,var(--cyan),var(--blue));
            color:#fff;border-radius:10px;font-size:0.85rem;font-weight:600;
            text-decoration:none;transition:opacity 0.2s;"
          onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
          <i class="fa ${escHtml(item.icon)}"></i>
          <div>
            <div>${escHtml(item.label)}</div>
            ${item.quality ? `<div style="font-size:0.72rem;opacity:0.85;">${escHtml(item.quality)}</div>` : ''}
          </div>
        </a>`;
    });
    html += '</div>';

    result.innerHTML = html;
    result.classList.remove('hidden');

  } catch (err) {
    loading.classList.add('hidden');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa fa-magnifying-glass"></i> Fetch';
    showDlError(error, '❌ Gagal terhubung ke server. Coba lagi.');
  }
}

function showDlError(el, msg) {
  el.innerHTML = `<i class="fa fa-circle-exclamation"></i> ${msg}`;
  el.classList.remove('hidden');
}

function showError(el, msg) {
  el.innerHTML = `<i class="fa fa-circle-exclamation"></i> ${msg}`;
  el.classList.remove('hidden');
}

// ============================================
// SPOTIFY-STYLE PLAYER
// ============================================
(function () {
  const video    = document.getElementById('spVideo');
  const audio    = document.getElementById('spAudio');
  const playIcon = document.getElementById('spPlayIcon');
  const progress = document.getElementById('spProgress');
  const curEl    = document.getElementById('spCurrent');
  const durEl    = document.getElementById('spDuration');
  const muteIcon = document.getElementById('spMuteIcon');

  if (!video || !audio) return;

  let isPlaying = false;
  let isMuted   = false;

  function fmtTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function updateProgress() {
    const dur = video.duration || audio.duration || 0;
    const cur = video.duration ? video.currentTime : audio.currentTime;
    const pct = dur ? (cur / dur) * 100 : 0;
    progress.value = pct;
    progress.style.setProperty('--prog', pct + '%');
    curEl.textContent = fmtTime(cur);
    durEl.textContent = fmtTime(dur);
  }

  function setMetaDuration() {
    const dur = video.duration || audio.duration || 0;
    durEl.textContent = fmtTime(dur);
  }

  video.addEventListener('loadedmetadata', setMetaDuration);
  audio.addEventListener('loadedmetadata', setMetaDuration);
  video.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('timeupdate', () => {
    if (!video.duration) updateProgress();
  });

  // Sync audio time to video
  video.addEventListener('timeupdate', () => {
    if (video.duration && Math.abs(video.currentTime - audio.currentTime) > 0.3) {
      audio.currentTime = video.currentTime;
    }
  });

  // Reset on end
  video.addEventListener('ended', () => {
    audio.pause();
    isPlaying = false;
    playIcon.className = 'fa fa-play';
  });
  audio.addEventListener('ended', () => {
    video.pause();
    isPlaying = false;
    playIcon.className = 'fa fa-play';
  });

  window.spTogglePlay = function () {
    if (!isPlaying) {
      video.play().catch(() => {});
      audio.play().catch(() => {});
      isPlaying = true;
      playIcon.className = 'fa fa-pause';
    } else {
      video.pause();
      audio.pause();
      isPlaying = false;
      playIcon.className = 'fa fa-play';
    }
  };

  window.spSeek = function (val) {
    const dur = video.duration || audio.duration || 0;
    const t = (val / 100) * dur;
    if (video.duration) video.currentTime = t;
    if (audio.duration) audio.currentTime = t;
    progress.style.setProperty('--prog', val + '%');
  };

  window.spToggleMute = function () {
    isMuted = !isMuted;
    video.muted = isMuted;
    audio.muted = isMuted;
    muteIcon.className = isMuted ? 'fa fa-volume-xmark' : 'fa fa-volume-high';
  };

  window.spRestart = function () {
    video.currentTime = 0;
    audio.currentTime = 0;
    progress.value = 0;
    progress.style.setProperty('--prog', '0%');
  };

  window.spShuffle = function (btn) {
    btn.style.color = 'var(--cyan)';
    setTimeout(() => btn.style.color = '', 400);
  };

  window.spToggleLike = function () {
    document.getElementById('spHeart').classList.toggle('liked');
  };
})();

// ============================================
// CONTACT FORM
// ============================================
function submitContact() {
  const name  = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const msg   = document.getElementById('contactMsg').value.trim();
  const ok    = document.getElementById('contactSuccess');

  if (!name || !email || !msg) { alert('Please fill in all fields.'); return; }
  if (!isValidEmail(email))    { alert('Please enter a valid email address.'); return; }

  ok.classList.remove('hidden');
  document.getElementById('contactName').value = '';
  document.getElementById('contactEmail').value = '';
  document.getElementById('contactMsg').value = '';
  setTimeout(() => ok.classList.add('hidden'), 5000);
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// ============================================
// AI CHAT
// ============================================
let chatHistory = [];

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  input.value = '';
  appendBubble('user', msg);
  chatHistory.push({ role: 'user', content: msg });

  const typingId = appendTyping();
  scrollChat();

  try {
    // Primary: rahmad.cloud GPT-5
    // Returns: { chatId, text, images, tool }
    let reply = '';

    try {
      const res = await fetch(
        `https://api.rahmad.cloud/api/ai/chatgpt?prompt=${encodeURIComponent(msg)}&model=openai%2Fgpt-5-chat`,
        { signal: AbortSignal.timeout(10000) }
      );
      const data = await res.json();
      if (typeof data?.text === 'string' && data.text.trim()) {
        reply = data.text.trim();
      }
    } catch { /* primary failed, try fallback */ }

    // Fallback: betabotz GPT-4
    if (!reply) {
      try {
        const res2 = await fetch(
          `https://api.nexray.eu.cc/ai/gemini?text=halo+halo+halo=${encodeURIComponent(msg)}&apikey=Btz-w3xcj`,
          { signal: AbortSignal.timeout(10000) }
        );
        const data2 = await res2.json();
        if (typeof data2?.result === 'string' && data2.result.trim()) {
          reply = data2.result.trim();
        }
      } catch { /* fallback also failed */ }
    }

    removeTyping(typingId);

    if (!reply) {
      appendBubble('ai', '⚠️ Semua server AI sedang sibuk. Coba lagi sebentar.');
    } else {
      appendBubble('ai', reply);
      chatHistory.push({ role: 'assistant', content: reply });
    }

  } catch {
    removeTyping(typingId);
    appendBubble('ai', '⚠️ Network error. Periksa koneksi internet kamu.');
  }
  scrollChat();
}

function appendBubble(role, text) {
  const msgs = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const icon = role === 'ai' ? 'fa-robot' : 'fa-user';

  const div = document.createElement('div');
  div.className = `chat-bubble ${role}`;
  div.innerHTML = `
    <div class="bubble-avatar"><i class="fa ${icon}"></i></div>
    <div class="bubble-content">
      <p>${escHtml(text).replace(/\n/g,'<br>')}</p>
      <span class="bubble-time">${time}</span>
    </div>`;
  msgs.appendChild(div);
}

function appendTyping() {
  const msgs = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-bubble ai';
  div.id = id;
  div.innerHTML = `
    <div class="bubble-avatar"><i class="fa fa-robot"></i></div>
    <div class="bubble-content">
      <div class="chat-typing"><span></span><span></span><span></span></div>
    </div>`;
  msgs.appendChild(div);
  scrollChat();
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function scrollChat() {
  const msgs = document.getElementById('chatMessages');
  requestAnimationFrame(() => { msgs.scrollTop = msgs.scrollHeight; });
}


// ============================================
// STAR RATING
// ============================================
let selectedRating = 0;

document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('mouseover', () => highlightStars(+star.dataset.val));
  star.addEventListener('mouseout',  () => highlightStars(selectedRating));
  star.addEventListener('click',     () => {
    selectedRating = +star.dataset.val;
    document.getElementById('fbRating').value = selectedRating;
    highlightStars(selectedRating);
  });
});

function highlightStars(n) {
  document.querySelectorAll('.star').forEach(s => {
    s.classList.toggle('active', +s.dataset.val <= n);
  });
}

// ============================================
// FEEDBACK SYSTEM
// ============================================
async function submitFeedback() {
  const name    = document.getElementById('fbName').value.trim();
  const comment = document.getElementById('fbComment').value.trim();
  const rating  = +document.getElementById('fbRating').value;
  const ok      = document.getElementById('fbSuccess');

  if (!name || !comment) { alert('Please fill in your name and comment.'); return; }
  if (rating === 0)       { alert('Please select a star rating.'); return; }

  try {
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, comment, rating })
    });
    if (res.ok) {
      ok.classList.remove('hidden');
      document.getElementById('fbName').value = '';
      document.getElementById('fbComment').value = '';
      document.getElementById('fbRating').value = '0';
      selectedRating = 0;
      highlightStars(0);
      setTimeout(() => ok.classList.add('hidden'), 4000);
      loadFeedback();
    }
  } catch {
    alert('Error submitting feedback. Make sure the backend is running.');
  }
}

async function loadFeedback() {
  const container = document.getElementById('feedbackReviews');
  container.innerHTML = '<div class="fb-loading"><div class="spinner"></div> Loading reviews...</div>';
  try {
    const res  = await fetch(`${API_BASE}/api/feedback`);
    const data = await res.json();
    if (!data.length) {
      container.innerHTML = '<div class="fb-empty"><i class="fa fa-comment-slash"></i>No reviews yet. Be the first!</div>';
      return;
    }
    container.innerHTML = '';
    [...data].reverse().forEach(fb => {
      const stars = '★'.repeat(fb.rating) + '☆'.repeat(5 - fb.rating);
      const date  = new Date(fb.date).toLocaleDateString('id-ID', { year:'numeric', month:'short', day:'numeric' });
      const card  = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-header">
          <span class="review-name">${escHtml(fb.name)}</span>
          <span class="review-stars">${stars}</span>
        </div>
        <div class="review-date">${date}</div>
        <div class="review-comment">${escHtml(fb.comment)}</div>`;
      container.appendChild(card);
    });
  } catch {
    container.innerHTML = '<div class="fb-empty"><i class="fa fa-triangle-exclamation"></i>Could not load reviews.<br>Backend may not be running.</div>';
  }
}

// ============================================
// PROJECT MODAL DATA
// ============================================
const modalData = {
  modal1: {
    title: '🌐 Web Portfolio',
    body:  'A fully custom personal portfolio using vanilla HTML, CSS, and JavaScript. Features a Single Page Application architecture, sidebar navigation, smooth section transitions, AI chat, media downloader, and a live feedback system backed by a Node.js/Express API. Deployed on Vercel.'
  },
  modal2: {
    title: '🤖 AI Chat App',
    body:  'Real-time AI chatbot leveraging external APIs to deliver conversational responses. Features a messenger-style UI with message bubbles, typing indicators, auto-scroll, and a clean dark theme. Built with React and Node.js.'
  },
  modal3: {
    title: '⬇️ Media Downloader',
    body:  'Universal media downloader supporting YouTube, TikTok, Instagram, and Facebook. Express backend acts as a proxy to third-party download APIs, returning structured JSON with direct media links.'
  },
  modal4: {
    title: '📊 Dashboard UI',
    body:  'A comprehensive admin dashboard template built with React and TypeScript. Includes data visualization charts, stat cards, sidebar navigation, responsive grid layout, and a dark glassmorphism theme.'
  },
  modal5: {
    title: '🛒 E-Commerce Page',
    body:  'Responsive e-commerce storefront featuring product listing grid, hover animations, cart preview drawer, and mobile-first responsive design. Built using HTML5, Bootstrap, and vanilla JavaScript.'
  },
  modal6: {
    title: '📝 Notes App',
    body:  'Minimal note-taking application with real-time markdown preview, local storage persistence, tag-based filtering, and a clean distraction-free editor. Built with React Hooks.'
  }
};

function openModal(id) {
  const data = modalData[id];
  if (!data) return;
  document.getElementById('modalBody').innerHTML = `<h3>${data.title}</h3><p style="margin-top:12px;">${data.body}</p>`;
  document.getElementById('modalBackdrop').classList.add('open');
}
function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ============================================
// UTILITIES
// ============================================
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  openSection('home');
});
