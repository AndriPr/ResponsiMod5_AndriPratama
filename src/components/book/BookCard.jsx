import { Star, Edit3, Trash2 } from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { truncate } from '../../utils/helpers'

/**
 * BookCard — Komponen kartu buku pada grid katalog.
 */
export default function BookCard({ book, onSelect, onEdit, onDelete }) {
  const coverSrc = book.cover || '/covers/clean-code.svg'
  const isAvailable = book.status === 'Tersedia'

  return (
    <li className="book-card">
      <div
        className="book-card__main"
        onClick={() => onSelect(book)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(book)}
      >
        <div className="book-card__cover-wrap">
          <img
            src={coverSrc}
            alt={book.title}
            className="book-card__cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/covers/clean-code.svg'
            }}
          />
          <div className="book-card__badge-row">
            <span className="category-tag">{book.category}</span>
            <span className={`status-pill ${isAvailable ? 'status-pill--available' : 'status-pill--borrowed'}`}>
              {book.status || 'Tersedia'}
            </span>
          </div>
        </div>

        <div className="book-card__info">
          <h3 className="book-card__title" title={book.title}>
            {truncate(book.title, 55)}
          </h3>
          <p className="book-card__author">{book.author}</p>

          <div className="book-card__meta">
            <span className="book-card__year">{book.year}</span>
            <span className="book-card__dot">•</span>
            <span className="book-card__pages">{book.pages} hlm</span>
            <div className="book-card__rating">
              <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
              <span>{Number(book.rating || 5).toFixed(1)}</span>
            </div>
          </div>

          {book.description && (
            <p className="book-card__desc">{truncate(book.description, 80)}</p>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="book-card__actions">
        <FavoriteButton bookId={book.id} />
        {onEdit && (
          <button
            type="button"
            className="action-icon-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(book)
            }}
            title="Edit Buku"
            aria-label="Edit Buku"
          >
            <Edit3 size={15} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="action-icon-btn action-icon-btn--danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(book)
            }}
            title="Hapus Buku"
            aria-label="Hapus Buku"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </li>
  )
}
