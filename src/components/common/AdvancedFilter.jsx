import { Search, SlidersHorizontal, X } from 'lucide-react'

/**
 * AdvancedFilter — Bar pencarian, pill filter kategori, dan dropdown pengurutan.
 */
export default function AdvancedFilter({
  search,
  onSearch,
  categories,
  activeCategory,
  onCategory,
  sortKey,
  sortOrder,
  onSort,
}) {
  return (
    <div className="adv-filter">
      {/* Search Input */}
      <div className="adv-filter__search">
        <Search size={18} className="adv-filter__icon" />
        <input
          type="search"
          placeholder="Cari judul buku, penulis, atau kata kunci..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="adv-filter__input"
          aria-label="Cari buku"
        />
        {search && (
          <button
            type="button"
            className="adv-filter__clear"
            onClick={() => onSearch('')}
            aria-label="Hapus pencarian"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="adv-filter__row">
        {/* Category Pills */}
        <div className="adv-filter__pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill ${activeCategory === cat ? 'pill--active' : ''}`}
              onClick={() => onCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="adv-filter__sort">
          <SlidersHorizontal size={15} />
          <select
            value={`${sortKey}_${sortOrder}`}
            onChange={(e) => {
              const [key, order] = e.target.value.split('_')
              onSort({ key, order })
            }}
            aria-label="Urutkan koleksi"
            className="adv-filter__select"
          >
            <option value="title_asc">Judul A → Z</option>
            <option value="title_desc">Judul Z → A</option>
            <option value="rating_desc">Rating Tertinggi</option>
            <option value="year_desc">Tahun Terbaru</option>
            <option value="year_asc">Tahun Terlama</option>
            <option value="pages_asc">Halaman Terpendek</option>
          </select>
        </div>
      </div>
    </div>
  )
}
