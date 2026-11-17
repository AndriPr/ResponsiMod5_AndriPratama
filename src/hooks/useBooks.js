import { useState, useEffect, useCallback } from 'react'
import bookService from '../services/bookService'

/**
 * useBooks — Hook untuk mengambil dan memfilter daftar buku
 */
export function useBooks(params = {}) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const paramKey = JSON.stringify(params)

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await bookService.getBooks(params)
      if (res.success) {
        setBooks(res.data)
        setTotal(res.total)
      } else {
        setError(res.message || 'Gagal memuat katalog buku.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data buku.')
      setBooks([])
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return { books, loading, error, total, refetch: fetchBooks }
}

/**
 * useBookById — Hook untuk mengambil detail 1 buku berdasarkan ID
 */
export function useBookById(id) {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBook = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await bookService.getBookById(id)
      if (res.success) {
        setBook(res.data)
      } else {
        setError(res.message || 'Buku tidak ditemukan.')
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat detail buku.')
      setBook(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBook()
  }, [fetchBook])

  return { book, loading, error, refetch: fetchBook }
}
