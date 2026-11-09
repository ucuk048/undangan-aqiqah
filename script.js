/**
 * Undangan Digital Tasyakuran & Aqiqah
 * Engine: Vanilla JavaScript (Zero Dependencies, Zero XSS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initRecipient();
  initAudio();
  initCountdown();
  initGuestbook();
  initScrollSpy();
  initGalleryModal();
});

// ==========================================
// 1. RECIPIENT & PARAMETER PARSING (ANTI-XSS)
// ==========================================
function initRecipient() {
  const urlParams = new URLSearchParams(window.location.search);
  const rawRecipient = urlParams.get('kpd') || urlParams.get('to');
  const targetElements = document.querySelectorAll('.recipient-name');

  if (rawRecipient && rawRecipient.trim()) {
    const cleanName = rawRecipient.trim();
    targetElements.forEach(el => {
      // Safe textContent assignment (Zero DOM XSS)
      el.textContent = cleanName;
    });

    // Also pre-fill the RSVP form name input
    const rsvpNameInput = document.getElementById('rsvp-name');
    if (rsvpNameInput) {
      rsvpNameInput.value = cleanName;
    }
  } else {
    targetElements.forEach(el => {
      el.textContent = 'Bapak / Ibu / Saudara/i';
    });
  }
}

// ==========================================
// 2. ENVELOPE OPENING & AUDIO CONTROLLER
// ==========================================
let bgAudio = null;
let isAudioPlaying = false;

function initAudio() {
  bgAudio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-toggle');

  if (!bgAudio || !musicBtn) return;

  musicBtn.addEventListener('click', toggleAudio);
}

function openInvitation() {
  const overlay = document.getElementById('cover-overlay');
  if (overlay) {
    overlay.classList.add('opened');
  }

  // Play background audio
  if (bgAudio) {
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      updateMusicIcon();
    }).catch(err => {
      console.log('Audio autoplay prevented by browser policy:', err);
      isAudioPlaying = false;
      updateMusicIcon();
    });
  }

  // Allow page scrolling
  document.body.style.overflow = 'auto';

  // Smooth scroll to top of main content
  setTimeout(() => {
    const mainContent = document.getElementById('pembuka');
    if (mainContent) {
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, 300);
}

function toggleAudio() {
  if (!bgAudio) return;

  if (isAudioPlaying) {
    bgAudio.pause();
    isAudioPlaying = false;
  } else {
    bgAudio.play().then(() => {
      isAudioPlaying = true;
    }).catch(e => console.error(e));
  }
  updateMusicIcon();
}

function updateMusicIcon() {
  const musicIcon = document.getElementById('music-icon');
  const musicDisc = document.getElementById('music-disc');

  if (!musicIcon) return;

  if (isAudioPlaying) {
    musicIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="10" y1="15" x2="10" y2="9"></line><line x1="14" y1="15" x2="14" y2="9"></line></svg>`;
    if (musicDisc) musicDisc.classList.add('animate-spin-slow');
  } else {
    musicIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`;
    if (musicDisc) musicDisc.classList.remove('animate-spin-slow');
  }
}

// ==========================================
// 3. COUNTDOWN TIMER
// ==========================================
function initCountdown() {
  // Waktu acara: Minggu depan atau tanggal spesifik (Default: 14 hari dari sekarang)
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 7);
  eventDate.setHours(09, 0, 0, 0);

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function update() {
    const now = new Date().getTime();
    const distance = eventDate.getTime() - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ==========================================
// 4. RSVP & BUKU TAMU (LOCALSTORAGE PERSISTENCE)
// ==========================================
const DEFAULT_WISHES = [
  {
    name: "Ustadz H. Ahmad Fauzi",
    status: "Hadir",
    wishes: "Barakallahu laka fil mauhubi laka wa syakarta al-wahib. Semoga ananda menjadi anak yang shalehah, penghafal Al-Qur'an dan penyejuk hati kedua orang tua.",
    time: "Kemarin, 14:20"
  },
  {
    name: "Keluarga Besar dr. Ridwan",
    status: "Hadir",
    wishes: "Selamat atas tasyakuran & aqiqah ananda tercinta. Semoga tumbuh sehat, cerdas, berbakti kepada nusa dan bangsa serta taat pada agama.",
    time: "2 jam yang lalu"
  },
  {
    name: "Bibi Rahmawati",
    status: "Hadir",
    wishes: "MasyaAllah tabarakallah cantiknya dede bayi. Sehat selalu ya sayang, kelak menjadi penolong kedua orang tua di surga kelak. Aamiin.",
    time: "Baru saja"
  }
];

function initGuestbook() {
  const form = document.getElementById('rsvp-form');
  const wishesContainer = document.getElementById('wishes-list');

  // Load existing wishes
  let storedWishes = JSON.parse(localStorage.getItem('aqiqah_wishes_list') || 'null');
  if (!storedWishes || !storedWishes.length) {
    storedWishes = DEFAULT_WISHES;
    localStorage.setItem('aqiqah_wishes_list', JSON.stringify(storedWishes));
  }

  renderWishes(storedWishes);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const count = document.getElementById('rsvp-count').value;
      const wishes = document.getElementById('rsvp-message').value.trim();

      if (!name || !wishes) {
        showToast('Mohon lengkapi nama dan doa Anda');
        return;
      }

      const newEntry = {
        name: name,
        status: status,
        count: count,
        wishes: wishes,
        time: "Baru saja"
      };

      storedWishes.unshift(newEntry);
      localStorage.setItem('aqiqah_wishes_list', JSON.stringify(storedWishes));

      renderWishes(storedWishes);
      form.reset();
      showToast('Doa & ucapan Anda berhasil terkirim!');
    });
  }
}

function renderWishes(list) {
  const container = document.getElementById('wishes-list');
  if (!container) return;

  container.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-3.5 bg-white/90 rounded-2xl border border-emerald-900/10 shadow-sm space-y-1.5 transition hover:shadow-md';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between';

    const nameGroup = document.createElement('div');
    nameGroup.className = 'flex items-center gap-2';

    const avatar = document.createElement('div');
    avatar.className = 'w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold';
    avatar.textContent = item.name.charAt(0).toUpperCase();

    const nameText = document.createElement('span');
    nameText.className = 'font-semibold text-xs text-stone-800';
    nameText.textContent = item.name;

    nameGroup.appendChild(avatar);
    nameGroup.appendChild(nameText);

    const badge = document.createElement('span');
    badge.className = item.status === 'Hadir' 
      ? 'px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800'
      : (item.status === 'Tidak Hadir' ? 'px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-800' : 'px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800');
    badge.textContent = item.status;

    header.appendChild(nameGroup);
    header.appendChild(badge);

    const msg = document.createElement('p');
    msg.className = 'text-xs text-stone-600 leading-relaxed pl-9';
    msg.textContent = item.wishes;

    const time = document.createElement('div');
    time.className = 'text-[10px] text-stone-400 pl-9';
    time.textContent = item.time;

    card.appendChild(header);
    card.appendChild(msg);
    card.appendChild(time);
    container.appendChild(card);
  });
}

// ==========================================
// 5. COPY TO CLIPBOARD & TOAST
// ==========================================
function copyText(text, label) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label || 'Teks'} berhasil disalin!`);
    }).catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`${label || 'Teks'} berhasil disalin!`);
  } catch (err) {
    showToast('Gagal menyalin otomatis');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast-box');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ==========================================
// 6. GENERATE WHATSAPP INVITATION LINK
// ==========================================
function generateCustomLink() {
  const input = document.getElementById('gen-guest-name');
  if (!input || !input.value.trim()) {
    showToast('Ketikkan nama tamu terlebih dahulu');
    return;
  }

  const name = encodeURIComponent(input.value.trim());
  const baseUrl = window.location.origin + window.location.pathname;
  const customUrl = `${baseUrl}?kpd=${name}`;

  const message = `Assalamu'alaikum Wr. Wb.

Yth. *${input.value.trim()}*,

Dengan memohon ridho dan rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara Tasyakuran & Aqiqah putri kami.

Informasi lengkap dan konfirmasi kehadiran dapat dilihat melalui tautan undangan berikut:
${customUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.

Wassalamu'alaikum Wr. Wb.`;

  copyText(customUrl, 'Link Undangan Spesial');
  
  // Set preview link
  const resultBox = document.getElementById('gen-link-result');
  const waShareBtn = document.getElementById('gen-wa-share');
  if (resultBox) {
    resultBox.textContent = customUrl;
    resultBox.classList.remove('hidden');
  }
  if (waShareBtn) {
    waShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    waShareBtn.classList.remove('hidden');
  }
}

// ==========================================
// 7. LIGHTBOX GALLERY
// ==========================================
function initGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.getElementById('close-modal');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-full') || thumb.getAttribute('src');
      modalImg.setAttribute('src', src);
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
}

// ==========================================
// 8. SCROLLSPY & BOTTOM NAVIGATION DOCK
// ==========================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.bottom-nav-dock .nav-item');

  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35
  });

  sections.forEach(section => observer.observe(section));
}
