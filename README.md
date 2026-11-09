# Undangan Digital Tasyakuran & Aqiqah Modern (Mobile-First)

Aplikasi web undangan digital modern, elegan, responsif, dan bebas celah keamanan untuk acara **Tasyakuran & Walimatul 'Aqiqah**.

Dibangun dengan arsitektur ringan (*Zero Heavy Bloat*), bebas XSS (*Zero DOM-based Cross-Site Scripting*), dan siap dijalankan langsung di peramban, termux, shared hosting (cPanel/InfinityFree), Netlify, Vercel, maupun GitHub Pages.

---

## 🌟 Fitur Utama

1. **Cover / Amplop Interaktif (Personalized):**
   - Mendukung parameter URL `?kpd=Nama%20Tamu` atau `?to=Nama%20Tamu`.
   - Nama tamu otomatis muncul pada cover pembuka secara aman via `.textContent` (anti-XSS).
   - Efek transisi buka cover yang halus (*smooth entrance*).
2. **Audio Controller & Background Music:**
   - Musik latar otomatis berputar setelah tamu menekan tombol **"Buka Undangan"**.
   - Floating button putar/jeda dengan ikon piringan musik animasi.
3. **Profil Bayi & Orang Tua:**
   - Bingkai foto bernuansa kubah Islami modern (*arch frame* dengan ring emas).
   - Data lengkap bayi: Nama lengkap, nama panggilan, tanggal/jam lahir, berat & panjang badan.
   - Nama kedua orang tua dan doa keberkahan.
4. **Hitung Mundur Waktu (Live Countdown Timer):**
   - Menghitung mundur Hari, Jam, Menit, dan Detik secara realtime menuju hari pelaksanaan.
   - Tombol integrasi langsung **"Simpan ke Google Calendar"**.
5. **Rundown Acara & Peta Navigasi:**
   - Sesi acara tasyakuran & aqiqah terstruktur.
   - Alamat lengkap dengan tombol satu-klik **"Buka Google Maps"** dan **"Salin Alamat"**.
6. **Buku Tamu & RSVP (Local Persistence):**
   - Formulir konfirmasi kehadiran (InsyaAllah Hadir / Belum Bisa Hadir / Masih Ragu).
   - Doa & ucapan tersimpan persisten di `localStorage` peramban, langsung muncul di feed buku tamu dengan avatar inisial dan badge status kehadiran.
7. **Amplop & Kado Digital (Cashless Gift):**
   - Kartu rekening Bank Syariah Indonesia (BSI) dan Bank BCA.
   - Tombol satu-klik **"Salin Nomor Rekening"** dilengkapi notifikasi toast animasi.
   - Tautan konfirmasi langsung via WhatsApp ke nomor keluarga.
8. **Generator Link Personalisasi WhatsApp (Khusus Pemilik Acara):**
   - Memudahkan pemilik acara mengetik nama tamu baru dan menyalin pesan WhatsApp resmi yang sudah terisi tautan personalisasi `?kpd=...`.
9. **Galeri Foto Momen & Lightbox:**
   - Tata letak bento grid estetik dengan modal pembesar foto resolusi tinggi.
10. **Bottom Floating Dock Navigation:**
    - Menu navigasi melayang di bawah layar dengan indikator aktif otomatis mengikuti posisi gulir halaman (*ScrollSpy via IntersectionObserver*).

---

## 📁 Struktur Berkas

```
/sdcard/Antigravity/undangan-aqiqah/
├── index.html        # Struktur semantik antarmuka (Tailwind + Lucide)
├── style.css         # Styling kustom, pattern islami, arch-frame & animasi
├── script.js         # Logika interaktif, sanitasi parameter, RSVP, audio & toast
└── README.md         # Panduan instalasi dan kustomisasi
```

---

## 🚀 Cara Menjalankan Secara Lokal

Buka terminal (Termux / Linux / Mac / Windows) dan jalankan server web sederhana:

```bash
cd /sdcard/Antigravity/undangan-aqiqah
python3 -m http.server 8080
```

Buka peramban di:
- **Tampilan Standar:** `http://localhost:8080`
- **Uji Personalisasi Tamu:** `http://localhost:8080/?kpd=Bapak%20Budi`
- **Uji Tamu dengan Gelar:** `http://localhost:8080/?kpd=Ustadz%20H.%20Ahmad%20Fauzi,%20Lc.`

---

## ✏️ Panduan Kustomisasi

1. **Mengubah Nama Bayi & Orang Tua:**
   - Buka `index.html`, cari teks `Khamila Safa Ihza`, `Dede Mila`, `Adi Susanto`, dan `Tin Marnita Sari`. Ganti sesuai nama buah hati dan keluarga Anda.
2. **Mengubah Tanggal Acara & Countdown:**
   - Buka `script.js`, sesuaikan tanggal target pada fungsi `initCountdown()`:
     ```javascript
     const eventDate = new Date("2026-11-20T09:00:00");
     ```
3. **Mengubah Nomor Rekening:**
   - Buka `index.html` pada bagian `<section id="hadiah">`. Ganti nomor rekening BSI/BCA dan nama pemilik rekening.
4. **Mengubah Musik Latar:**
   - Ganti link audio pada tag `<audio id="bg-audio">` di dalam `index.html` dengan berkas `.mp3` favorit Anda.
