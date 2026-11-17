import { useState, useEffect, useCallback } from 'react'
import favoriteService from '../services/favoriteService'

/**
 * useFavorites — Hook untuk mengelola daftar buku favorit pengguna
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await favoriteService.getFavorites()
      if (res.success) {
        setFavorites(res.data)
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat buku favorit.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return { favorites, loading, error, refetch: fetchFavorites }
}

/**
 * useToggleFavorite — Hook untuk memicu toggle favorit buku
 */
export function useToggleFavorite() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleFavorite = async (bookId) => {
    try {
      setLoading(true)
      setError(null)
      const res = await favoriteService.toggleFavorite(bookId)
      return res.data
    } catch (err) {
      setError(err.message || 'Gagal mengubah status favorit.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { toggleFavorite, loading, error }
}

/**
 * useIsFavorited — Mengecek apakah suatu buku spesifik sedang difavoritkan
 */
export function useIsFavorited(bookId) {
  const { favorites, refetch } = useFavorites()
  const { toggleFavorite: toggle, loading } = useToggleFavorite()

  const isFavorited = favorites.some((id) => String(id) === String(bookId))

  const handleToggle = async () => {
    const res = await toggle(bookId)
    if (res) {
      await refetch()
    }
    return res
  }

  return {
    isFavorited,
    loading,
    toggleFavorite: handleToggle,
  }
}
