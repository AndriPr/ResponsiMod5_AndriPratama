# 📚 BookVerse — Perpustakaan Digital Progressive Web App (PWA)

> **Tugas Responsi Modul 5 (Progressive Web App II)**  
> **Praktikum Pemrograman Perangkat Bergerak (PPB) 2026 Ganjil**

---

## 👤 Identitas Praktikan
- **Nama:** Andri Pratama
- **NIM:** 21120122140123
- **Kelompok:** Kelompok 29
- **Mata Kuliah:** Praktikum Pemrograman Perangkat Bergerak (PPB) 2026

---

## 🎯 Ringkasan Proyek
**BookVerse** adalah aplikasi **Progressive Web App (PWA)** modern untuk eksplorasi, pencarian, dan manajemen koleksi buku perpustakaan digital secara offline-first. Dibangun menggunakan arsitektur modern **React 19 + Vite + vite-plugin-pwa**, aplikasi ini memberikan pengalaman interaktif responsif layaknya aplikasi mobile native, dapat dipasang (install) di smartphone dan desktop, serta berfungsi penuh saat tanpa koneksi internet.

---

## 🚀 Fitur Utama & Pemenuhan Kriteria Responsi

| Kriteria Tugas Responsi | Status | Implementasi pada BookVerse PWA |
| :--- | :---: | :--- |
| **Minimal 3 Halaman Navigasi** | ✅ Terpenuhi (5 Halaman) | 1. **Katalog Buku** (Pencarian, Filter Kategori, Pengurutan, Grid Koleksi)<br>2. **Buku Favorit** (Wishlist & Bookmark Bacaan)<br>3. **Tambah & Edit Buku** (CRUD Formulir + Upload Gambar/Preset + Auto Draft)<br>4. **Detail Buku** (Sinopsis, Daftar Bab, Rating Bintang & Ulasan)<br>5. **Profil Praktikan** (Kartu Mahasiswa, NIM, Kelompok, Statistik & PWA Diagnostik)<br>6. **Tentang PWA** (Arsitektur Service Worker & Panduan Instalasi) |
| **Halaman Profil: Nama, NIM, Kelompok** | ✅ Terpenuhi | Halaman Profil memuat Kartu Praktikan resmi yang menampilkan secara jelas **Nama (Andri Pratama)**, **NIM (21120122140123)**, dan **Kelompok (Kelompok 29)** lengkap dengan foto profil/avatar, role praktikum, dan formulir pengeditan profil yang tersimpan persisten ke `localStorage`. |
| **CRUD Fungsional** | ✅ Terpenuhi | - **Create:** Menambahkan buku baru dengan sampul gambar (upload file lokal / preset), judul, penulis, kategori, tahun, halaman, status, dan bab.<br>- **Read:** Menampilkan katalog buku dengan pencarian teks, filter kategori, pengurutan, dan halaman detail.<br>- **Update:** Mengedit buku yang ada beserta sampul dan bab materinya.<br>- **Delete:** Menghapus buku dari katalog dengan dialog konfirmasi modal interaktif.<br>- **Persistensi Data:** Data disimpan secara persisten di `localStorage` dan dapat diakses offline. |
| **Fungsionalitas PWA (Installable & Offline)** | ✅ Terpenuhi | - **Service Worker & Caching:** Menggunakan `vite-plugin-pwa` (Workbox) dengan strategi caching asset statis.<br>- **Web App Manifest:** Dikonfigurasi dengan nama, ikon 192x192 & 512x512, tema warna, mode tampilan `standalone`.<br>- **PWABadge:** Menampilkan prompt instalasi PWA dan notifikasi status saat offline. |
| **Deployment ke Vercel** | ✅ Siap Deploy | Dilengkapi berkas konfigurasi `vercel.json` dengan URL rewrite untuk Single Page Application (SPA) dan kontrol cache Service Worker. |

---

## 🛠️ Teknologi yang Digunakan
- **Frontend Framework:** React 19
- **Build Tool & Bundler:** Vite 8
- **PWA Integration:** `vite-plugin-pwa` (Workbox)
- **HTTP Client:** Axios (mendukung konfigurasi RESTful API & Supabase)
- **Icons:** `lucide-react`
- **Data Persistence:** `localStorage` & Cache API
- **Deployment Platform:** Vercel

---

## 📦 Struktur Direktori Proyek

```text
ResponsiMod5/
├── public/
│   ├── covers/                     # Preset sampul buku berformat SVG resolusi tinggi
│   ├── favicon.svg                 # Ikon utama BookVerse
│   ├── pwa-192x192.png             # Ikon PWA manifest 192px
│   ├── pwa-512x512.png             # Ikon PWA manifest 512px
│   └── apple-touch-icon.png        # Ikon perangkat Apple iOS
├── src/
│   ├── components/
│   │   ├── book/
│   │   │   ├── BookCard.jsx        # Komponen kartu buku dalam grid
│   │   │   └── BookDetail.jsx      # Halaman rincian buku & ulasan pembaca
│   │   ├── common/
│   │   │   ├── AdvancedFilter.jsx  # Pencarian, filter pills, & sorting
│   │   │   ├── FavoriteButton.jsx  # Tombol toggle favorit interaktif
│   │   │   ├── SplashScreen.jsx    # Animasi pembuka splash screen
│   │   │   └── SplashScreen.css    # Animasi CSS splash screen
│   │   ├── modals/
│   │   │   └── ConfirmModal.jsx    # Dialog konfirmasi aksi (hapus/draft)
│   │   ├── Footer.jsx              # Komponen footer identitas praktikan
│   │   ├── Header.jsx              # Navigasi utama & badge favorit
│   │   └── PWABadge.jsx            # Notifikasi instalasi PWA & status offline
│   ├── config/
│   │   └── api.js                  # Konfigurasi Axios & interseptor Supabase
│   ├── data/
│   │   └── initialBooks.js         # Koleksi awal 8 buku beragam kategori
│   ├── hooks/
│   │   ├── useBooks.js             # Hook pengambilan & filtering katalog
│   │   ├── useFavorites.js         # Hook manajemen favorit
│   │   └── useReviews.js           # Hook ulasan pembaca
│   ├── pages/
│   │   ├── AboutPage.jsx           # Halaman informasi & panduan instalasi PWA
│   │   ├── Catalog.jsx             # Halaman katalog utama
│   │   ├── CreateBookPage.jsx      # Halaman tambah buku (CRUD Create)
│   │   ├── EditBookPage.jsx        # Halaman edit buku (CRUD Update)
│   │   ├── FavoritesPage.jsx       # Halaman koleksi favorit
│   │   └── ProfilePage.jsx         # Halaman profil praktikan (Nama, NIM, Kelompok)
│   ├── services/
│   │   ├── bookService.js          # Layanan CRUD buku & persistensi
│   │   ├── favoriteService.js      # Layanan bookmark favorit
│   │   ├── reviewService.js        # Layanan ulasan pembaca
│   │   └── userService.js          # Layanan data profil praktikan
│   ├── utils/
│   │   ├── draftStorage.js         # Auto-save draft formulir ke localStorage
│   │   └── helpers.js              # Fungsi utilitas pencarian, sortir, & tanggal
│   ├── App.css                     # Gaya CSS utama responsif modern
│   ├── App.jsx                     # Komponen root aplikasi & router state
│   ├── index.css                   # CSS reset & variabel desain
│   └── main.jsx                    # Entri utama aplikasi & registrasi PWA SW
├── .env                            # Variabel lingkungan API
├── .env.example                    # Template variabel lingkungan
├── package.json                    # Konfigurasi dependensi proyek
├── vercel.json                     # Konfigurasi deployment hosting Vercel
└── vite.config.js                  # Konfigurasi Vite & VitePWA
```

---

## 💻 Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat
Pastikan komputer Anda telah terinstal:
- **Node.js** (versi 18 ke atas)
- **npm** (versi 9 ke atas)
- **Git**

### 2. Instalasi Dependensi
Jalankan perintah berikut di terminal:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Buka browser pada alamat yang ditampilkan di terminal (biasanya `http://localhost:5173`).

### 4. Build untuk Mode Produksi
```bash
npm run build
```
Hasil kompilasi file produksi beserta Service Worker PWA akan digenerate ke dalam folder `dist/`.

### 5. Menguji Mode Produksi (Preview)
```bash
npm run preview
```

---

## 🌐 Panduan Deployment ke Vercel

1. **Inisialisasi Git dan Push ke Repository GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Responsi Modul 5 PWA BookVerse - Andri Pratama"
   git branch -M main
   git remote add origin https://github.com/<username-github-anda>/<nama-repo>.git
   git push -u origin main
   ```

2. **Deploy di Vercel**:
   - Buka [vercel.com](https://vercel.com) dan masuk menggunakan akun GitHub Anda.
   - Klik **"Add New Project"** &rarr; **"Import Git Repository"**.
   - Pilih repository yang baru saja Anda buat.
   - Framework preset akan otomatis terdeteksi sebagai **Vite**.
   - Klik tombol **"Deploy"**.
   - Tunggu sekitar 1-2 menit hingga proses build selesai.
   - Tautan publik Vercel Anda (misal `https://bookverse-pwa-xxx.vercel.app`) siap disalin dan dikumpulkan ke formulir responsi!
