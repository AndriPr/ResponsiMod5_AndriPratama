import { useState, useMemo, useRef } from 'react'
import { ChevronLeft, ChevronRight, Plus, RefreshCw, AlertCircle, BookOpen } from 'lucide-react'
import { useBooks } from '../hooks/useBooks'
import BookCard from '../components/book/BookCard'
import CategoryShelf from '../components/common/CategoryShelf'
import ShowcaseBanner from '../components/common/ShowcaseBanner'
import ConfirmModal from '../components/modals/ConfirmModal'
import bookService from '../services/bookService'

const RIBBON_COLORS = ['#F59E0B', '#EC4899', '#38BDF8', '#10B981', '#8B5CF6', '#F43F5E']

export default function Catalog({ onNavigate, search = '' }) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [sortKey, setSortKey] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')

  const carouselRef = useRef(null)

  // Fetch data
  const { books, loading, error, refetch } = useBooks({
    search,
    category: activeCategory,
    sort_by: sortKey,
    order: sortOrder,
  })

  // Popular books (top 5-6 books for the carousel)
  const popularBooks = useMemo(() => {
    return [...books].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)).slice(0, 6)
  }, [books])

  // Scroll handlers for popular carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await bookService.deleteBook(deleteTarget.id)
      setFeedbackMsg(`Buku "${deleteTarget.title}" berhasil dihapus.`)
      setDeleteTarget(null)
      refetch()
      setTimeout(() => setFeedbackMsg(''), 4000)
    } catch (err) {
      alert(err.message || 'Gagal menghapus buku.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="clay-catalog-canvas">
      {/* 1. Category Shelf with Cute 3D Book Icons (as seen in reference) */}
      <CategoryShelf
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
      />

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="clay-toast clay-toast--success">
          {feedbackMsg}
        </div>
      )}

      {/* 2. "Popular" Section (with View All and < > carousel buttons) */}
      <section className="clay-popular-section">
        <div className="clay-section-header">
          <div className="section-title-wrap">
            <h2 className="clay-section-title">Popular</h2>
            <span className="clay-section-count">{books.length} books</span>
          </div>

          <div className="clay-section-actions">
            <button
              type="button"
              className="clay-pill-btn"
              onClick={() => setActiveCategory('Semua')}
            >
              View All
            </button>
            <div className="clay-carousel-controls">
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={() => scrollCarousel('left')}
                aria-label="Geser ke kiri"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={() => scrollCarousel('right')}
                aria-label="Geser ke kanan"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Hardcover Books */}
        {loading ? (
          <div className="clay-state-box">
            <RefreshCw size={24} className="spin" />
            <p>Memuat koleksi buku…</p>
          </div>
        ) : popularBooks.length > 0 ? (
          <div className="clay-popular-carousel" ref={carouselRef}>
            <ul className="popular-books-track">
              {popularBooks.map((book, idx) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={(b) => onNavigate('Detail', b)}
                  onEdit={(b) => onNavigate('Edit', b)}
                  onDelete={(b) => setDeleteTarget(b)}
                  ribbonColor={RIBBON_COLORS[idx % RIBBON_COLORS.length]}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="clay-state-box">
            <p>Tidak ada buku dalam kategori ini.</p>
          </div>
        )}
      </section>

      {/* 3. Showcase Bestsellers Banner (Stacked books + 3 mini cards) */}
      <ShowcaseBanner onCategorySelect={setActiveCategory} />

      {/* 4. Full Catalog Grid View & Sorting */}
      <section className="clay-full-catalog-section">
        <div className="clay-section-header">
          <div>
            <h3 className="clay-section-subtitle">Semua Koleksi Perpustakaan</h3>
            <p className="clay-section-desc">
              Menampilkan {books.length} buku {activeCategory !== 'Semua' ? `dalam kategori ${activeCategory}` : ''}
            </p>
          </div>

          <div className="catalog-sort-wrap">
            <select
              value={`${sortKey}_${sortOrder}`}
              onChange={(e) => {
                const [k, ord] = e.target.value.split('_')
                setSortKey(k)
                setSortOrder(ord)
              }}
              className="clay-sort-select"
            >
              <option value="title_asc">Judul: A &rarr; Z</option>
              <option value="title_desc">Judul: Z &rarr; A</option>
              <option value="rating_desc">Rating Tertinggi</option>
              <option value="year_desc">Tahun Terbaru</option>
            </select>

            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => onNavigate('Create')}
            >
              <Plus size={15} /> Tambah Buku
            </button>
          </div>
        </div>

        {error && (
          <div className="clay-state-box clay-state-box--error">
            <AlertCircle size={28} />
            <p>{error}</p>
            <button type="button" className="btn btn--outline btn--sm" onClick={refetch}>
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="clay-state-box">
            <BookOpen size={36} color="#A3968A" />
            <p>Buku tidak ditemukan untuk kriteria pencarian ini.</p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <ul className="clay-grid-books">
            {books.map((book, idx) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={(b) => onNavigate('Detail', b)}
                onEdit={(b) => onNavigate('Edit', b)}
                onDelete={(b) => setDeleteTarget(b)}
                ribbonColor={RIBBON_COLORS[idx % RIBBON_COLORS.length]}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Modal Hapus */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Buku"
        message={`Apakah Anda yakin ingin menghapus buku "${deleteTarget?.title}"?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
