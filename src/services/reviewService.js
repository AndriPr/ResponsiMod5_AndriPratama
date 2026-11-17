import bookService from './bookService'
import { getUserProfile } from './userService'

// ---------------------------------------------------------------------------
// reviewService.js — Layanan ulasan dan rating buku.
// Menambahkan ulasan pembaca ke buku terkait secara persisten.
// ---------------------------------------------------------------------------

class ReviewService {
  /**
   * Mengambil ulasan untuk buku tertentu
   */
  async getReviews(bookId) {
    try {
      const res = await bookService.getBookById(bookId)
      return {
        success: true,
        data: res.data.reviews || [],
      }
    } catch (err) {
      return {
        success: false,
        message: err.message,
        data: [],
      }
    }
  }

  /**
   * Menambahkan ulasan baru ke buku
   */
  async createReview(bookId, { rating, comment }) {
    await new Promise((r) => setTimeout(r, 100))
    const profile = getUserProfile()

    const res = await bookService.getBookById(bookId)
    const book = res.data

    const newReview = {
      id: `rev-${Date.now()}`,
      user: profile.name || 'Pembaca Anonim',
      rating: Number(rating) || 5,
      comment: comment?.trim() || '',
      date: new Date().toISOString().split('T')[0],
    }

    const updatedReviews = [newReview, ...(book.reviews || [])]

    // Recalculate average rating of the book
    const avg =
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
      updatedReviews.length
    const roundedAvg = Math.round(avg * 10) / 10

    await bookService.updateBook(bookId, {
      reviews: updatedReviews,
      rating: roundedAvg,
    })

    return {
      success: true,
      data: newReview,
    }
  }
}

export default new ReviewService()
