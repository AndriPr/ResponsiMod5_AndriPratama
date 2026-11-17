// ---------------------------------------------------------------------------
// CategoryShelf.jsx — Horizontal category shelf with cute book icons
// matching the user's reference design.
// ---------------------------------------------------------------------------

const CATEGORIES_WITH_ICONS = [
  { id: 'Semua', label: 'All', color: '#6366F1', bookColor: '#818CF8', ribbonColor: '#F59E0B' },
  { id: 'Teknologi', label: 'Tech & Code', color: '#0EA5E9', bookColor: '#38BDF8', ribbonColor: '#F43F5E' },
  { id: 'Pengembangan Diri', label: 'Habits', color: '#F59E0B', bookColor: '#FBBF24', ribbonColor: '#10B981' },
  { id: 'Sastra', label: 'Fiction', color: '#EC4899', bookColor: '#F472B6', ribbonColor: '#6366F1' },
  { id: 'Sains & AI', label: 'Science & AI', color: '#10B981', bookColor: '#34D399', ribbonColor: '#F59E0B' },
  { id: 'Desain', label: 'UI/UX Design', color: '#8B5CF6', bookColor: '#A78BFA', ribbonColor: '#EC4899' },
  { id: 'Bisnis', label: 'Business', color: '#14B8A6', bookColor: '#2DD4BF', ribbonColor: '#E11D48' },
]

export default function CategoryShelf({ activeCategory, onCategory }) {
  return (
    <div className="clay-category-shelf">
      <div className="clay-category-track">
        {CATEGORIES_WITH_ICONS.map((cat) => {
          const isActive = activeCategory === cat.id || (cat.id === 'Semua' && activeCategory === 'All')
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-item-btn ${isActive ? 'category-item-btn--active' : ''}`}
              onClick={() => onCategory(cat.id)}
            >
              {/* Cute 3D Mini Book Icon */}
              <div className="mini-book-icon-wrap">
                <svg
                  className="mini-book-svg"
                  viewBox="0 0 40 48"
                  width="32"
                  height="38"
                  fill="none"
                >
                  {/* Book back shadow */}
                  <rect x="7" y="6" width="28" height="38" rx="4" fill="#D3C7BD" />
                  {/* Book spine & cover */}
                  <rect x="5" y="4" width="28" height="38" rx="4" fill={cat.bookColor} />
                  {/* Spine inner curve */}
                  <path d="M5 8C7 8 8 7 8 4V42C8 39 7 38 5 38V8Z" fill="rgba(0,0,0,0.15)" />
                  {/* Page edges */}
                  <rect x="30" y="7" width="3" height="32" rx="1" fill="#FFFDF8" />
                  {/* Ribbon bookmark hanging down */}
                  <path
                    d="M17 4V34L20 31L23 34V4"
                    fill={cat.ribbonColor}
                  />
                  {/* Decorative badge / emblem */}
                  <circle cx="19" cy="18" r="4" fill="rgba(255,255,255,0.7)" />
                </svg>
              </div>

              {/* Label */}
              <span className="category-item-label">{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
