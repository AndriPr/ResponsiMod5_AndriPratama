import { Search, Heart, MessageSquare, Plus } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

export default function Header({
  search,
  onSearch,
  onTab,
  onToggleChat,
  isChatOpen,
  onNavigateCreate,
}) {
  const { favorites } = useFavorites()
  const favCount = favorites ? favorites.length : 0

  return (
    <header className="clay-topbar">
      {/* Pill Search Bar */}
      <div className="clay-search-pill">
        <Search size={18} className="clay-search-icon" />
        <input
          type="search"
          placeholder="Search for books, authors, or genres..."
          value={search}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="clay-search-input"
          aria-label="Cari buku"
        />
        <button
          type="button"
          className="clay-search-submit-btn"
          onClick={() => onTab && onTab('Catalog')}
        >
          search
        </button>
      </div>

      {/* Right Action Icons (Favorites Cart + Chat Toggle + Add Book) */}
      <div className="clay-topbar-actions">
        {onNavigateCreate && (
          <button
            type="button"
            className="topbar-action-pill"
            onClick={onNavigateCreate}
            title="Tambah Buku (CRUD)"
          >
            <Plus size={16} />
            <span className="topbar-action-label">Tambah Buku</span>
          </button>
        )}

        {/* Favorites Cart with Red Badge */}
        <button
          type="button"
          className="clay-cart-btn"
          onClick={() => onTab('Favorites')}
          title="Buku Favorit & Simpanan"
        >
          <Heart size={20} />
          {favCount > 0 && <span className="clay-cart-badge">{favCount}</span>}
        </button>

        {/* Toggle Assistant Chat */}
        {onToggleChat && (
          <button
            type="button"
            className={`clay-chat-toggle-btn ${isChatOpen ? 'active' : ''}`}
            onClick={onToggleChat}
            title={isChatOpen ? 'Tutup Chat' : 'Buka Asisten Chat'}
          >
            <MessageSquare size={19} />
          </button>
        )}
      </div>
    </header>
  )
}
