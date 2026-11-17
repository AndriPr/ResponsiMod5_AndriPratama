import { Eye, BookOpen, Award, Compass } from 'lucide-react'

export default function ShowcaseBanner({ onCategorySelect }) {
  return (
    <section className="clay-showcase-banner">
      {/* Left: Illustrated Stack of Colorful Books */}
      <div className="banner-books-stack">
        <svg
          viewBox="0 0 160 200"
          className="books-stack-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottom Green Book */}
          <rect x="15" y="145" width="130" height="26" rx="6" fill="#10B981" />
          <rect x="25" y="149" width="112" height="18" rx="2" fill="#34D399" />
          <path d="M45 145V178L52 173L59 178V145" fill="#FBBF24" />

          {/* Middle Blue Book */}
          <rect x="25" y="105" width="120" height="28" rx="6" fill="#3B82F6" />
          <rect x="35" y="109" width="102" height="20" rx="2" fill="#60A5FA" />
          <path d="M85 105V140L92 135L99 140V105" fill="#F43F5E" />

          {/* Middle Red / Coral Book */}
          <rect x="18" y="65" width="125" height="28" rx="6" fill="#E87A5D" />
          <rect x="28" y="69" width="107" height="20" rx="2" fill="#F87171" />
          <path d="M105 65V98L112 93L119 98V65" fill="#FBBF24" />

          {/* Top Indigo Book */}
          <rect x="30" y="25" width="110" height="28" rx="6" fill="#6366F1" />
          <rect x="40" y="29" width="92" height="20" rx="2" fill="#818CF8" />
          <path d="M55 25V60L62 55L69 60V25" fill="#34D399" />
        </svg>
      </div>

      {/* Center: Title & Description */}
      <div className="banner-center-text">
        <h3 className="banner-heading">2026 Year Most Popular Bestsellers</h3>
        <p className="banner-caption">
          Daftar buku terbaik dan paling banyak dibaca mahasiswa Praktikum PPB 2026.
          Tersedia offline dalam genggaman Anda.
        </p>
        <button
          type="button"
          className="banner-cta-pill"
          onClick={() => onCategorySelect && onCategorySelect('Semua')}
        >
          <Eye size={16} />
          <span>Lihat Semua</span>
        </button>
      </div>

      {/* Right: 3 Mini Recommendation Cards */}
      <div className="banner-right-cards">
        <div
          className="banner-mini-card"
          onClick={() => onCategorySelect && onCategorySelect('Teknologi')}
          role="button"
          tabIndex={0}
        >
          <div className="mini-card-icon mini-card-icon--blue">
            <BookOpen size={16} />
          </div>
          <div className="mini-card-info">
            <strong>Top Buku Coding &amp; PWA</strong>
            <span>Clean Code, React, &amp; Service Worker</span>
          </div>
        </div>

        <div
          className="banner-mini-card"
          onClick={() => onCategorySelect && onCategorySelect('Pengembangan Diri')}
          role="button"
          tabIndex={0}
        >
          <div className="mini-card-icon mini-card-icon--amber">
            <Award size={16} />
          </div>
          <div className="mini-card-info">
            <strong>Top Pengembangan Diri</strong>
            <span>Atomic Habits &amp; Psychology of Money</span>
          </div>
        </div>

        <div
          className="banner-mini-card"
          onClick={() => onCategorySelect && onCategorySelect('Sastra')}
          role="button"
          tabIndex={0}
        >
          <div className="mini-card-icon mini-card-icon--purple">
            <Compass size={16} />
          </div>
          <div className="mini-card-info">
            <strong>Top Sastra Klasik</strong>
            <span>Bumi Manusia &amp; Laskar Pelangi</span>
          </div>
        </div>
      </div>
    </section>
  )
}
