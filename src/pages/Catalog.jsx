import { useState, useMemo } from 'react'
import { Plus, BookOpen, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react'
import { useBooks } from '../hooks/useBooks'
import BookCard from '../components/book/BookCard'
import AdvancedFilter from '../components/common/AdvancedFilter'
import ConfirmModal from '../components/modals/ConfirmModal'
import bookService from '../services/bookService'
import { extractCategories } from '../utils/helpers'

/**
 * Catalog — Halaman utama katalog buku perpustakaan digital.
 */
export default function Catalog({ onNavigate }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [sortKey, setSortKey] = useState('title')
  const [sortOrder, setSortOrder] = useState('asc')

  // Data fetching dari hook useBooks
  const { books, loading, error, refetch } = useBooks({
    search,
    category: activeCategory,
    sort_by: sortKey,
    order: sortOrder,
  })

  // List kategori unik
  const categories = useMemo(() => extractCategories(books), [books])

  // State Hapus Buku
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
    <div className="page-catalog">
      {/* Hero Banner */}
      <section className="catalog-hero">
        <div className="catalog-hero__text">
          <div className="hero-badge">
            <Sparkles size={14} color="#F59E0B" />
            <span>Koleksi Terbuka &amp; Akses Offline</span>
          </div>
          <h1 className="hero-title">Perpustakaan Digital Modern</h1>
          <p className="hero-desc">
            Jelajahi dan kelola ribuan buku literatur, teknologi, sains, dan sastra pilihan.
            Aplikasi berbasis Progressive Web App yang dapat berjalan penuh secara offline.
          </p>
        </div>

        <div className="catalog-hero__stats">
          <div className="hero-stat-card">
            <BookOpen size={24} className="hero-stat-icon" />
            <span className="stat-number">{books.length}</span>
            <span className="stat-label">Buku Terdaftar</span>
          </div>
          <div className="hero-stat-card">
            <Layers size={24} className="hero-stat-icon" />
            <span className="stat-number">{Math.max(categories.length - 1, 1)}</span>
            <span className="stat-label">Kategori Pustaka</span>
          </div>
        </div>
      </section>

      {/* Pesan Feedback */}
      {feedbackMsg && (
        <div className="toast toast--success">
          <Sparkles size={16} /> {feedbackMsg}
        </div>
      )}

      {/* Filter & Bar Pencarian */}
      <section className="catalog-controls">
        <AdvancedFilter
          search={search}
          onSearch={setSearch}
          categories={categories}
          activeCategory={activeCategory}
          onCategory={setActiveCategory}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={({ key, order }) => {
            setSortKey(key)
            setSortOrder(order)
          }}
        />
      </section>

      {/* Grid Koleksi Buku */}
      <section className="catalog-content">
        <div className="catalog-header-bar">
          <div className="catalog-header-title">
            <h2>Daftar Koleksi Pustaka</h2>
            <span className="catalog-count-pill">
              {books.length} buku {activeCategory !== 'Semua' ? `(${activeCategory})` : ''}
            </span>
          </div>

          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => onNavigate('Create')}
          >
            <Plus size={16} /> Tambah Buku Baru
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="state-panel">
            <RefreshCw size={28} className="spin state-icon" />
            <p>Memuat katalog koleksi buku…</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="state-panel state-panel--error">
            <AlertCircle size={32} />
            <p>{error}</p>
            <button type="button" className="btn btn--outline" onClick={refetch}>
              Coba Muat Ulang
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="state-panel">
            <BookOpen size={40} className="state-icon" />
            <h3>Tidak ada buku yang cocok</h3>
            <p>Cobalah mengganti kata kunci pencarian atau memilih kategori lain.</p>
            {search && (
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => setSearch('')}
              >
                Reset Pencarian
              </button>
            )}
          </div>
        )}

        {/* Grid List */}
        {!loading && books.length > 0 && (
          <ul className="books-grid">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onSelect={(b) => onNavigate('Detail', b)}
                onEdit={(b) => onNavigate('Edit', b)}
                onDelete={(b) => setDeleteTarget(b)}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Modal Hapus */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Buku dari Katalog"
        message={`Apakah Anda yakin ingin menghapus buku "${deleteTarget?.title}"? Tindakan ini akan menghapus data dari penyimpanan browser.`}
        confirmLabel="Hapus Buku"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
