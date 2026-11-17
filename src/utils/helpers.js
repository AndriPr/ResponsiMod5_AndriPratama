/**
 * helpers.js — Fungsi utilitas murni untuk pencarian, filter, dan manipulasi data.
 */

/**
 * Filter pencarian berbasis teks (case-insensitive) pada judul, penulis, dan deskripsi.
 */
export const matchesSearch = (item, query) => {
  if (!query) return true
  const q = query.toLowerCase().trim()
  return (
    (item.title || item.name || '').toLowerCase().includes(q) ||
    (item.author || '').toLowerCase().includes(q) ||
    (item.category || item.type || '').toLowerCase().includes(q) ||
    (item.description || '').toLowerCase().includes(q)
  )
}

/**
 * Filter kategori buku. 'Semua' atau '' mencakup seluruh item.
 */
export const matchesCategory = (item, category) => {
  if (!category || category === 'Semua' || category === 'All') return true
  const cat = (item.category || item.type || '').toLowerCase()
  return cat === category.toLowerCase()
}

/**
 * Mengurutkan array buku berdasarkan key dan arah (asc/desc).
 */
export const sortBooks = (books, key = 'title', order = 'asc') => {
  const sorted = [...books].sort((a, b) => {
    if (key === 'rating') {
      return (Number(a.rating) || 0) - (Number(b.rating) || 0)
    }
    if (key === 'year') {
      return (Number(a.year) || 0) - (Number(b.year) || 0)
    }
    if (key === 'pages') {
      return (Number(a.pages) || 0) - (Number(b.pages) || 0)
    }
    // Default: alfabet judul
    const valA = String(a.title || a.name || '')
    const valB = String(b.title || b.name || '')
    return valA.localeCompare(valB, 'id', { sensitivity: 'base' })
  })

  return order === 'desc' ? sorted.reverse() : sorted
}

/**
 * Memotong teks panjang dengan elipsis (...)
 */
export const truncate = (str, max = 100) => {
  if (!str || str.length <= max) return str || ''
  return str.slice(0, max).trimEnd() + '…'
}

/**
 * Mengambil daftar kategori unik dari koleksi buku.
 */
export const extractCategories = (books) => {
  const set = new Set()
  books.forEach((b) => {
    const cat = b.category || b.type
    if (cat) set.add(cat)
  })
  return ['Semua', ...Array.from(set).sort()]
}

/**
 * Menghitung rata-rata rating dari daftar ulasan.
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

/**
 * Format tanggal ke format lokal Indonesia (DD MMMM YYYY).
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}
