// ---------------------------------------------------------------------------
// favoriteService.js — Layanan buku favorit & wishlist pengguna.
// Persistensi data tersimpan secara lokal di localStorage sehingga
// fitur favorit bekerja 100% offline.
// ---------------------------------------------------------------------------

const FAVORITES_STORAGE_KEY = 'bookverse_favorites'

const readLocalFavs = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeLocalFavs = (ids) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
    return true
  } catch {
    return false
  }
}

class FavoriteService {
  /**
   * Mengambil seluruh ID buku yang difavoritkan
   */
  async getFavorites() {
    await new Promise((r) => setTimeout(r, 60))
    const list = readLocalFavs()
    return {
      success: true,
      data: list,
    }
  }

  /**
   * Toggle status favorit (Tambah <-> Hapus)
   */
  async toggleFavorite(bookId) {
    await new Promise((r) => setTimeout(r, 60))
    const current = readLocalFavs()
    const idStr = String(bookId)
    const idx = current.findIndex((id) => String(id) === idStr)

    let isFavorited = false
    if (idx === -1) {
      current.push(idStr)
      isFavorited = true
    } else {
      current.splice(idx, 1)
      isFavorited = false
    }

    writeLocalFavs(current)
    return {
      success: true,
      data: { isFavorited, bookId: idStr, totalFavorites: current.length },
    }
  }

  /**
   * Mengecek apakah buku ber-ID tertentu masuk daftar favorit
   */
  isFavoritedSync(bookId) {
    const current = readLocalFavs()
    return current.some((id) => String(id) === String(bookId))
  }
}

export default new FavoriteService()
