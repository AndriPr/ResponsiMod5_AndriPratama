import { LayoutGrid, Heart, PlusCircle, User, Info, Download } from 'lucide-react'
import { getUserProfile } from '../services/userService'

export default function Sidebar({ tab, onTab, onNavigateCreate }) {
  const profile = getUserProfile()

  return (
    <aside className="clay-sidebar">
      {/* Top Profile Avatar */}
      <button
        type="button"
        className={`clay-sidebar__avatar-btn ${tab === 'Profile' ? 'active' : ''}`}
        onClick={() => onTab('Profile')}
        title={`${profile.name} (Kelompok ${profile.kelompok || '29'})`}
      >
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.name} className="sidebar-avatar-img" />
        ) : (
          <div className="sidebar-avatar-placeholder">
            <span>{profile.name ? profile.name[0].toUpperCase() : 'A'}</span>
          </div>
        )}
      </button>

      {/* Main Nav Icons */}
      <nav className="clay-sidebar__nav">
        <button
          type="button"
          className={`sidebar-nav-btn ${tab === 'Catalog' ? 'sidebar-nav-btn--active' : ''}`}
          onClick={() => onTab('Catalog')}
          title="Katalog Buku"
        >
          <LayoutGrid size={22} />
          <span className="sidebar-tooltip">Katalog</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav-btn ${tab === 'Favorites' ? 'sidebar-nav-btn--active' : ''}`}
          onClick={() => onTab('Favorites')}
          title="Buku Favorit"
        >
          <Heart size={22} />
          <span className="sidebar-tooltip">Favorit</span>
        </button>

        <button
          type="button"
          className="sidebar-nav-btn sidebar-nav-btn--create"
          onClick={onNavigateCreate}
          title="Tambah Buku Baru (CRUD)"
        >
          <PlusCircle size={22} />
          <span className="sidebar-tooltip">Tambah Buku</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav-btn ${tab === 'Profile' ? 'sidebar-nav-btn--active' : ''}`}
          onClick={() => onTab('Profile')}
          title="Profil Praktikan (Nama, NIM, Kelompok)"
        >
          <User size={22} />
          <span className="sidebar-tooltip">Profil</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav-btn ${tab === 'About' ? 'sidebar-nav-btn--active' : ''}`}
          onClick={() => onTab('About')}
          title="Tentang PWA & Panduan"
        >
          <Info size={22} />
          <span className="sidebar-tooltip">Tentang</span>
        </button>
      </nav>

      {/* Bottom PWA Badge Button */}
      <div className="clay-sidebar__bottom">
        <button
          type="button"
          className="sidebar-pill-btn"
          onClick={() => onTab('About')}
          title="PWA Offline Ready"
        >
          <Download size={14} />
          <span className="sidebar-pill-text">PWA</span>
        </button>
      </div>
    </aside>
  )
}
