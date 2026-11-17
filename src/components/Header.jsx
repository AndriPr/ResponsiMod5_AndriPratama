import { Plus, Heart, User, Info, Library } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

const NAV_ITEMS = [
  { id: 'Catalog', label: 'Katalog', icon: Library },
  { id: 'Favorites', label: 'Favorit', icon: Heart, hasBadge: true },
  { id: 'Profile', label: 'Profil', icon: User },
  { id: 'About', label: 'Tentang', icon: Info },
]

export default function Header({ tab, onTab, onNavigateCreate }) {
  const { favorites } = useFavorites()
  const favCount = favorites ? favorites.length : 0

  return (
    <header className="site-header">
      <div className="site-header__container">
        {/* Brand */}
        <div
          className="brand-group"
          onClick={() => onTab('Catalog')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onTab('Catalog')}
        >
          <div className="brand-logo-badge">
            <img src="/favicon.svg" alt="BookVerse" width="28" height="28" />
          </div>
          <div className="brand-texts">
            <span className="brand-name">BookVerse</span>
            <span className="brand-sub">PERPUSTAKAAN DIGITAL</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="site-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-btn ${isActive ? 'nav-btn--active' : ''}`}
                onClick={() => onTab(item.id)}
              >
                <Icon size={16} className="nav-btn__icon" />
                <span className="nav-btn__label">{item.label}</span>
                {item.hasBadge && favCount > 0 && (
                  <span className="nav-badge">{favCount}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Action Button */}
        <div className="header-actions">
          {onNavigateCreate && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={onNavigateCreate}
              title="Tambah Buku Baru"
            >
              <Plus size={16} />
              <span className="btn-text">Tambah Buku</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
