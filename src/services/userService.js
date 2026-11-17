// ---------------------------------------------------------------------------
// userService.js — Layanan identitas pengguna & profil mahasiswa praktikan.
// Menyimpan Nama, NIM, Kelompok, dan preferensi akun ke localStorage.
// ---------------------------------------------------------------------------

const USER_STORAGE_KEY = 'bookverse_user_profile'
const USER_ID_KEY = 'bookverse_user_id'

/**
 * Generate UUID v4 standar untuk identitas browser
 */
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Mengambil User ID sesi yang persisten
 */
export const getUserIdentifier = () => {
  try {
    let id = localStorage.getItem(USER_ID_KEY)
    if (!id) {
      id = generateUUID()
      localStorage.setItem(USER_ID_KEY, id)
    }
    return id
  } catch {
    return generateUUID()
  }
}

/**
 * Mengambil profil mahasiswa lengkap dari localStorage (atau nilai default).
 * Memenuhi syarat modul: Nama, NIM, dan Kelompok.
 */
export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        name: parsed.name || 'Andri Pratama',
        nim: parsed.nim || '21120122140123',
        kelompok: parsed.kelompok || 'Kelompok 15',
        role: parsed.role || 'Praktikan Pemrograman Perangkat Bergerak 2026',
        bio:
          parsed.bio ||
          'Mahasiswa Teknik Komputer yang sedang mendalami pengembangan Progressive Web App (PWA) offline-first dengan React, Vite, dan Service Worker.',
        email: parsed.email || 'andriipraatama@gmail.com',
        avatar: parsed.avatar || null,
        userId: parsed.userId || getUserIdentifier(),
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      }
    }
  } catch (err) {
    console.warn('Gagal memuat profil pengguna:', err)
  }

  // Profil bawaan (default)
  return {
    name: 'Andri Pratama',
    nim: '21120122140123',
    kelompok: 'Kelompok 15',
    role: 'Praktikan Pemrograman Perangkat Bergerak 2026',
    bio:
      'Mahasiswa Teknik Komputer yang sedang mendalami pengembangan Progressive Web App (PWA) offline-first dengan React, Vite, dan Service Worker.',
    email: 'andriipraatama@gmail.com',
    avatar: null,
    userId: getUserIdentifier(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Menyimpan pembaruan profil pengguna ke localStorage
 */
export const saveUserProfile = (profile) => {
  try {
    const updated = {
      ...profile,
      userId: profile.userId || getUserIdentifier(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated))
    return { success: true, data: updated }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

/**
 * Memperbarui foto avatar (base64)
 */
export const updateAvatar = (avatarBase64) => {
  const current = getUserProfile()
  current.avatar = avatarBase64
  return saveUserProfile(current)
}

export default {
  getUserIdentifier,
  getUserProfile,
  saveUserProfile,
  updateAvatar,
}
