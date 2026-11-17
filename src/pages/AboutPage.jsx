import {
  Smartphone,
  WifiOff,
  Layers,
  Zap,
  CheckCircle,
  Laptop,
  Compass,
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="page-about">
      {/* Hero */}
      <section className="about-hero">
        <h1 className="hero-title">Tentang BookVerse PWA</h1>
        <p className="hero-desc">
          Aplikasi Progressive Web App (PWA) generasi kedua yang dirancang untuk memberikan
          pengalaman pengguna seperti aplikasi native dengan performa instan dan fungsionalitas
          offline penuh.
        </p>
      </section>

      {/* 4 Pilar Arsitektur PWA */}
      <section className="about-grid">
        <div className="about-card">
          <div className="about-card__icon-box">
            <WifiOff size={24} color="#38BDF8" />
          </div>
          <h3>Offline-First &amp; Service Worker</h3>
          <p>
            Memanfaatkan modul Workbox untuk mendaftarkan Service Worker di background browser.
            Aset statis (HTML, JS, CSS, SVG) disimpan di Cache API sehingga aplikasi tetap dapat
            dibuka dan berfungsi lancar tanpa sinyal internet.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card__icon-box">
            <Smartphone size={24} color="#F59E0B" />
          </div>
          <h3>Web App Manifest &amp; Installability</h3>
          <p>
            Dikonfigurasi dengan metadata manifest lengkap (nama, ikon 192x192, 512x512, tema warna,
            serta mode standalone) sehingga pengguna dapat menambahkan BookVerse langsung ke layar
            utama smartphone selayaknya aplikasi dari Play Store.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card__icon-box">
            <Layers size={24} color="#10B981" />
          </div>
          <h3>CRUD &amp; Data Persistence</h3>
          <p>
            Mendukung siklus Create, Read, Update, dan Delete secara fungsional. Dilengkapi
            mekanisme auto-save draft ke localStorage setiap beberapa detik untuk mencegah kehilangan
            data saat pengisian formulir.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card__icon-box">
            <Zap size={24} color="#A78BFA" />
          </div>
          <h3>Single Page Application (SPA)</h3>
          <p>
            Dibangun menggunakan React 19 dan Vite build tool modern. Menghadirkan transisi halaman
            instan tanpa reload browser, state management reaktif dengan custom hooks, dan validasi form
            terpadu.
          </p>
        </div>
      </section>

      {/* PANDUAN CARA INSTALASI PWA DI MOBILE & DESKTOP */}
      <section className="install-guide-card">
        <h2 className="section-title">
          <Smartphone size={22} className="title-icon" /> Panduan Instalasi PWA
        </h2>
        <p className="install-guide-sub">
          Ikuti langkah berikut untuk menginstal aplikasi BookVerse di perangkat Anda:
        </p>

        <div className="guide-columns">
          {/* Mobile Android / Chrome */}
          <div className="guide-box">
            <div className="guide-box__head">
              <Smartphone size={18} />
              <h4>Android (Google Chrome)</h4>
            </div>
            <ol className="guide-steps">
              <li>Buka tautan website yang telah di-deploy di browser Chrome Android.</li>
              <li>Tunggu banner instalasi muncul di bagian bawah, lalu klik <strong>"Instal PWA"</strong>.</li>
              <li>Atau tekan menu titik tiga (&vellip;) di pojok kanan atas browser.</li>
              <li>Pilih opsi <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install App"</strong>.</li>
              <li>Ikon BookVerse akan muncul di app drawer ponsel Anda dan dapat dibuka tanpa browser frame!</li>
            </ol>
          </div>

          {/* iOS / Safari */}
          <div className="guide-box">
            <div className="guide-box__head">
              <Compass size={18} />
              <h4>iOS / iPhone (Safari)</h4>
            </div>
            <ol className="guide-steps">
              <li>Buka website menggunakan browser Safari di iPhone/iPad Anda.</li>
              <li>Tekan tombol <strong>Share</strong> (ikon kotak dengan panah ke atas) di bilah bawah.</li>
              <li>Gulir ke bawah dan pilih opsi <strong>"Add to Home Screen" (Tambahkan ke Layar Utama)</strong>.</li>
              <li>Beri nama lalu tekan <strong>"Add"</strong> di pojok kanan atas.</li>
              <li>Aplikasi siap dibuka dari Home Screen Anda secara mandiri.</li>
            </ol>
          </div>

          {/* Desktop Chrome / Edge */}
          <div className="guide-box">
            <div className="guide-box__head">
              <Laptop size={18} />
              <h4>PC / Laptop (Chrome / Edge)</h4>
            </div>
            <ol className="guide-steps">
              <li>Buka website di Google Chrome atau Microsoft Edge.</li>
              <li>Perhatikan ikon monitor / download di ujung kanan address bar (Omnibox).</li>
              <li>Klik ikon tersebut dan pilih <strong>"Install BookVerse"</strong>.</li>
              <li>Aplikasi akan berjalan di jendela independen tanpa bilah browser.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Info Praktikum */}
      <section className="course-info-card">
        <div className="course-info-content">
          <h3>Praktikum Pemrograman Perangkat Bergerak 2026</h3>
          <p>
            Tugas Responsi Modul 5 (Progressive Web App II) &bull; Mengintegrasikan konsep PWA,
            Vite, ReactJS, Service Worker, Web App Manifest, CRUD, dan deployment cloud ke Vercel.
          </p>
        </div>
        <div className="course-badge-pill">
          <CheckCircle size={16} color="#10B981" /> Memenuhi Semua Persyaratan Modul
        </div>
      </section>
    </div>
  )
}
