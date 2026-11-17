import { Star, Edit3, Trash2 } from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { truncate } from '../../utils/helpers'

/**
 * BookCard — Kartu buku bergaya Hardcover 3D dengan pita pembatas (ribbon bookmark)
 * persis seperti referensi desain UI yang diunggah.
 */
export default function BookCard({ book, onSelect, onEdit, onDelete, ribbonColor = '#F59E0B' }) {
  const coverSrc = book.cover || '/covers/clean-code.svg'

  return (
    <li className="clay-book-card">
      <div
        className="clay-book-visual-wrap"
        onClick={() => onSelect(book)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(book)}
      >
        {/* Physical Hardcover Book Shell */}
        <div className="hardcover-book">
          {/* Spine fold effect */}
          <div className="hardcover-spine-edge" />

          {/* Book Cover Image */}
          <img
            src={coverSrc}
            alt={book.title}
            className="hardcover-cover-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/covers/clean-code.svg'
            }}
          />

          {/* Page edges at bottom */}
          <div className="hardcover-pages-bottom" />

          {/* Hanging Bookmark Ribbon */}
          <div className="hardcover-ribbon" style={{ backgroundColor: ribbonColor }}>
            <div className="ribbon-tail" style={{ borderTopColor: ribbonColor }} />
          </div>

          {/* Floating Actions on Hover */}
          <div className="hardcover-hover-overlay">
            <div className="hardcover-actions" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton bookId={book.id} />
              {onEdit && (
                <button
                  type="button"
                  className="clay-act-btn"
                  onClick={() => onEdit(book)}
                  title="Edit Buku"
                >
                  <Edit3 size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="clay-act-btn clay-act-btn--danger"
                  onClick={() => onDelete(book)}
                  title="Hapus Buku"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Book Title & Author Info Below */}
        <div className="clay-book-meta">
          <h4 className="clay-book-title" title={book.title}>
            {truncate(book.title.split(':')[0], 28)}
          </h4>
          <p className="clay-book-author">{truncate(book.author, 24)}</p>

          <div className="clay-book-subinfo">
            <div className="clay-book-rating">
              <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
              <span>{Number(book.rating || 5).toFixed(1)}</span>
            </div>
            <span className="clay-book-category-tag">{book.category}</span>
          </div>
        </div>
      </div>
    </li>
  )
}
