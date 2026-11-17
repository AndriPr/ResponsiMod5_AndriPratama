import { INITIAL_BOOKS } from '../data/initialBooks'
import { matchesSearch, matchesCategory, sortBooks } from '../utils/helpers'

// ---------------------------------------------------------------------------
// bookService.js — Pengelola data CRUD buku perpustakaan.
// Mendukung operasi penuh Create, Read, Update, Delete dengan persistensi localStorage
// serta kemampuan sinkronisasi offline-first.
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'bookverse_catalog_v1'

/**
 * Membaca buku dari localStorage atau menginisialisasi dengan INITIAL_BOOKS
 */
const getStoredBooks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('Gagal membaca buku dari localStorage, menggunakan seed data:', err)
  }

  // Simpan initial books ke localStorage pertama kali
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS))
  } catch {
    // quota exceeded silently fail
  }
  return [...INITIAL_BOOKS]
}

/**
 * Menyimpan daftar buku ke localStorage
 */
const saveStoredBooks = (books) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    return true
  } catch (err) {
    console.error('Gagal menyimpan buku ke localStorage:', err)
    return false
  }
}

class BookService {
  /**
   * READ (Semua buku dengan parameter pencarian, kategori, dan sorting)
   */
  async getBooks(params = {}) {
    // Simulasi delay asinkron halus (100ms) untuk nuansa API nyata
    await new Promise((r) => setTimeout(r, 120))

    const books = getStoredBooks()
    let filtered = books.filter(
      (b) =>
        matchesSearch(b, params.search) &&
        matchesCategory(b, params.category),
    )

    if (params.sort_by) {
      filtered = sortBooks(filtered, params.sort_by, params.order || 'asc')
    }

    return {
      success: true,
      data: filtered,
      total: filtered.length,
    }
  }

  /**
   * READ (Satu buku berdasarkan ID)
   */
  async getBookById(id) {
    await new Promise((r) => setTimeout(r, 80))
    const books = getStoredBooks()
    const book = books.find((b) => String(b.id) === String(id))

    if (!book) {
      throw new Error(`Buku dengan ID "${id}" tidak ditemukan.`)
    }

    return {
      success: true,
      data: book,
    }
  }

  /**
   * CREATE (Menambahkan buku baru)
   */
  async createBook(bookData) {
    await new Promise((r) => setTimeout(r, 150))
    const books = getStoredBooks()

    const newBook = {
      id: `book-${Date.now()}`,
      title: bookData.title.trim(),
      author: bookData.author.trim() || 'Penulis Anonim',
      category: bookData.category || 'Teknologi',
      year: Number(bookData.year) || new Date().getFullYear(),
      pages: Number(bookData.pages) || 200,
      publisher: bookData.publisher?.trim() || 'Penerbit Mandiri',
      isbn: bookData.isbn?.trim() || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      rating: Number(bookData.rating) || 5.0,
      cover: bookData.cover || '/covers/clean-code.svg',
      status: bookData.status || 'Tersedia',
      description: bookData.description?.trim() || 'Belum ada sinopsis buku ini.',
      chapters: Array.isArray(bookData.chapters) ? bookData.chapters : [],
      reviews: [],
      createdAt: new Date().toISOString(),
    }

    // Masukkan ke urutan teratas
    const updated = [newBook, ...books]
    saveStoredBooks(updated)

    return {
      success: true,
      data: newBook,
      message: 'Buku berhasil ditambahkan ke katalog!',
    }
  }

  /**
   * UPDATE (Memperbarui data buku yang ada)
   */
  async updateBook(id, bookData) {
    await new Promise((r) => setTimeout(r, 150))
    const books = getStoredBooks()
    const index = books.findIndex((b) => String(b.id) === String(id))

    if (index === -1) {
      throw new Error('Buku tidak ditemukan untuk diperbarui.')
    }

    const current = books[index]
    const updatedBook = {
      ...current,
      ...bookData,
      id: current.id, // Pertahankan ID asli
      year: Number(bookData.year ?? current.year),
      pages: Number(bookData.pages ?? current.pages),
      rating: Number(bookData.rating ?? current.rating),
      updatedAt: new Date().toISOString(),
    }

    books[index] = updatedBook
    saveStoredBooks(books)

    return {
      success: true,
      data: updatedBook,
      message: 'Data buku berhasil diperbarui!',
    }
  }

  /**
   * DELETE (Menghapus buku dari katalog)
   */
  async deleteBook(id) {
    await new Promise((r) => setTimeout(r, 150))
    const books = getStoredBooks()
    const index = books.findIndex((b) => String(b.id) === String(id))

    if (index === -1) {
      throw new Error('Buku tidak ditemukan.')
    }

    const deleted = books[index]
    const remaining = books.filter((b) => String(b.id) !== String(id))
    saveStoredBooks(remaining)

    return {
      success: true,
      data: deleted,
      message: `Buku "${deleted.title}" berhasil dihapus.`,
    }
  }

  /**
   * RESET (Mengembalikan ke data default modul)
   */
  async resetToDefault() {
    saveStoredBooks(INITIAL_BOOKS)
    return {
      success: true,
      data: INITIAL_BOOKS,
      message: 'Koleksi buku berhasil di-reset ke data bawaan.',
    }
  }
}

export default new BookService()
