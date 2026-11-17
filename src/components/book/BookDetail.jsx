import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  Book,
  Calendar,
  Layers,
  Building,
  Hash,
  Send,
  Loader,
  Edit3,
  Trash2,
  CheckCircle,
} from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { useReviews, useCreateReview } from '../../hooks/useReviews'
import { formatDate } from '../../utils/helpers'

/**
 * BookDetail — Tampilan komprehensif detail buku dan ulasan pembaca.
 */
export default function BookDetail({ book, onBack, onEdit, onDelete }) {
  const coverSrc = book.cover || '/covers/clean-code.svg'
  const isAvailable = book.status === 'Tersedia'

  // Ulasan
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useReviews(book.id)
  const { createReview, loading: submitting } = useCreateReview()

  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!comment.trim()) {
      setErrorMsg('Harap masukkan ulasan atau komentar Anda.')
      return
    }

    const res = await createReview(book.id, {
      rating,
      comment: comment.trim(),
    })

    if (res) {
      setSuccessMsg('Terima kasih! Ulasan Anda berhasil disimpan.')
      setComment('')
      setRating(5)
      refetchReviews()
      setTimeout(() => setSuccessMsg(''), 4000)
    } else {
      setErrorMsg('Gagal mengirimkan ulasan.')
    }
  }

  return (
    <div className="book-detail">
      {/* Tombol Kembali */}
      <button type="button" className="detail-back-btn" onClick={onBack}>
        <ArrowLeft size={18} /> Kembali ke Katalog
      </button>

      {/* Hero Section */}
      <div className="detail-hero">
        <div className="detail-hero__cover-wrap">
          <img
            src={coverSrc}
            alt={book.title}
            className="detail-hero__cover"
            onError={(e) => {
              e.currentTarget.src = '/covers/clean-code.svg'
            }}
          />
        </div>

        <div className="detail-hero__info">
          <div className="detail-hero__tags">
            <span className="category-tag">{book.category}</span>
            <span className={`status-pill ${isAvailable ? 'status-pill--available' : 'status-pill--borrowed'}`}>
              {book.status || 'Tersedia'}
            </span>
          </div>

          <h1 className="detail-hero__title">{book.title}</h1>
          <p className="detail-hero__author">Ditulis oleh: <strong>{book.author}</strong></p>

          <div className="detail-hero__rating-bar">
            <div className="stars-row">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(book.rating || 5) ? '#F59E0B' : 'none'}
                  stroke="#F59E0B"
                />
              ))}
            </div>
            <span className="rating-score">{Number(book.rating || 5).toFixed(1)} / 5.0</span>
            <span className="rating-count">({reviews.length} ulasan)</span>
          </div>

          <div className="detail-hero__actions">
            <FavoriteButton bookId={book.id} />
            {onEdit && (
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onEdit(book)}
              >
                <Edit3 size={16} /> Edit Data
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn btn--danger-ghost"
                onClick={() => onDelete(book)}
              >
                <Trash2 size={16} /> Hapus Buku
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spesifikasi Grid */}
      <div className="detail-specs-grid">
        <div className="spec-item">
          <Calendar size={18} className="spec-icon" />
          <div className="spec-texts">
            <span className="spec-label">Tahun Terbit</span>
            <span className="spec-val">{book.year}</span>
          </div>
        </div>
        <div className="spec-item">
          <Layers size={18} className="spec-icon" />
          <div className="spec-texts">
            <span className="spec-label">Jumlah Halaman</span>
            <span className="spec-val">{book.pages} hlm</span>
          </div>
        </div>
        <div className="spec-item">
          <Building size={18} className="spec-icon" />
          <div className="spec-texts">
            <span className="spec-label">Penerbit</span>
            <span className="spec-val">{book.publisher || 'Mandiri'}</span>
          </div>
        </div>
        <div className="spec-item">
          <Hash size={18} className="spec-icon" />
          <div className="spec-texts">
            <span className="spec-label">ISBN</span>
            <span className="spec-val">{book.isbn || '—'}</span>
          </div>
        </div>
      </div>

      {/* Sinopsis */}
      <section className="detail-section">
        <h2 className="section-title">
          <Book size={20} className="title-icon" /> Sinopsis &amp; Ringkasan Buku
        </h2>
        <p className="detail-desc">{book.description || 'Tidak ada deskripsi tersedia.'}</p>
      </section>

      {/* Pokok Bahasan / Bab */}
      {book.chapters && book.chapters.length > 0 && (
        <section className="detail-section">
          <h2 className="section-title">Pokok Bahasan &amp; Bab Kunci</h2>
          <div className="chapters-list">
            {book.chapters.map((ch, idx) => (
              <div key={idx} className="chapter-item">
                <span className="chapter-num">{idx + 1}</span>
                <div className="chapter-info">
                  <strong>{ch.name}</strong>
                  <p>{ch.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ulasan & Rating */}
      <section className="detail-section">
        <h2 className="section-title">Ulasan Pembaca &amp; Mahasiswa</h2>

        {/* Form Kirim Ulasan */}
        <form onSubmit={handleReviewSubmit} className="review-form">
          <label className="form-label">Beri Rating Anda:</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="star-selector-btn"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`Beri rating ${star} bintang`}
              >
                <Star
                  size={24}
                  fill={(hoverRating || rating) >= star ? '#F59E0B' : 'none'}
                  stroke="#F59E0B"
                />
              </button>
            ))}
            <span className="selected-rating-text">{rating} dari 5 bintang</span>
          </div>

          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Tulis pendapat atau ulasan Anda mengenai buku ini..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />

          {errorMsg && <p className="form-msg form-msg--error">{errorMsg}</p>}
          {successMsg && (
            <p className="form-msg form-msg--success">
              <CheckCircle size={16} /> {successMsg}
            </p>
          )}

          <div className="review-form-actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={16} className="spin" /> Mengirimkan…
                </>
              ) : (
                <>
                  <Send size={16} /> Kirim Ulasan
                </>
              )}
            </button>
          </div>
        </form>

        {/* List Ulasan */}
        <div className="reviews-feed">
          {reviewsLoading ? (
            <div className="loading-state">
              <Loader size={20} className="spin" /> Memuat ulasan…
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__user">
                    <span className="user-avatar">{rev.user ? rev.user[0].toUpperCase() : 'U'}</span>
                    <div>
                      <strong className="user-name">{rev.user || 'Pembaca Anonim'}</strong>
                      <span className="review-date">{formatDate(rev.date)}</span>
                    </div>
                  </div>
                  <div className="review-card__stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? '#F59E0B' : 'none'}
                        stroke="#F59E0B"
                      />
                    ))}
                  </div>
                </div>
                <p className="review-card__comment">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="empty-subtext">Belum ada ulasan untuk buku ini. Jadilah yang pertama memberikan ulasan!</p>
          )}
        </div>
      </section>
    </div>
  )
}
