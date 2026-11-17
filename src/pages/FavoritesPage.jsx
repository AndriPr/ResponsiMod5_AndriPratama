import { useMemo } from 'react'
import { Heart, ArrowRight } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useBooks } from '../hooks/useBooks'
import BookCard from '../components/book/BookCard'

/**
 * FavoritesPage — Halaman daftar buku favorit / wishlist pengguna.
 */
export default function FavoritesPage({ onSelectBook, onNavigateCatalog }) {
  const { favorites, loading: favLoading } = useFavorites()
  const { books: allBooks, loading: booksLoading } = useBooks()

  // Filter buku yang ID-nya ada di daftar favorit
  const favoriteBooks = useMemo(() => {
    const favSet = new Set(favorites.map(String))
    return allBooks.filter((b) => favSet.has(String(b.id)))
  }, [favorites, allBooks])

  const isLoading = favLoading || booksLoading

  return (
    <div className="page-favorites">
      <section className="favorites-hero">
        <div className="favorites-hero__icon-badge">
          <Heart size={28} fill="#EF4444" stroke="#EF4444" />
        </div>
        <h1 className="hero-title">Koleksi Favorit Saya</h1>
        <p className="hero-desc">
          Daftar bacaan yang Anda tandai. Semua data tersimpan aman di perangkat dan dapat
          diakses kapan saja bahkan saat tanpa koneksi internet.
        </p>
      </section>

      <section className="favorites-content">
        <div className="catalog-header-bar">
          <div className="catalog-header-title">
            <h2>Buku yang Ditandai</h2>
            <span className="catalog-count-pill">
              {favoriteBooks.length} buku disimpan
            </span>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="state-panel">
            <p>Memuat daftar favorit…</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && favoriteBooks.length === 0 && (
          <div className="state-panel">
            <Heart size={48} stroke="#94A3B8" />
            <h3>Belum Ada Buku Favorit</h3>
            <p>
              Jelajahi katalog dan tekan ikon hati pada buku mana saja untuk menyimpannya ke daftar ini.
            </p>
            {onNavigateCatalog && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={onNavigateCatalog}
                style={{ marginTop: '14px' }}
              >
                Jelajahi Katalog <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* Grid List */}
        {!isLoading && favoriteBooks.length > 0 && (
          <ul className="books-grid">
            {favoriteBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={onSelectBook}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
