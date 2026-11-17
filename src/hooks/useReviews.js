import { useState, useEffect, useCallback } from 'react'
import reviewService from '../services/reviewService'

/**
 * useReviews — Hook untuk memuat daftar ulasan buku
 */
export function useReviews(bookId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async () => {
    if (!bookId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await reviewService.getReviews(bookId)
      if (res.success) {
        setReviews(res.data)
      } else {
        setError(res.message || 'Gagal memuat ulasan.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat ulasan.')
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, loading, error, refetch: fetchReviews }
}

/**
 * useCreateReview — Hook untuk mengirim ulasan baru
 */
export function useCreateReview() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const createReview = async (bookId, reviewData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      const res = await reviewService.createReview(bookId, reviewData)
      if (res.success) {
        setSuccess(true)
        return res.data
      } else {
        setError(res.message || 'Gagal mengirimkan ulasan.')
        return null
      }
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulasan.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createReview, loading, error, success }
}
