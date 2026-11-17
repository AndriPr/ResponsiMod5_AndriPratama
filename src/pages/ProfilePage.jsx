import { useState } from 'react'
import {
  User,
  GraduationCap,
  Users,
  Camera,
  Check,
  Save,
  BookOpen,
  Heart,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Play,
  Copy,
  Wifi,
  HardDrive,
  Sparkles,
} from 'lucide-react'
import userService from '../services/userService'
import { useFavorites } from '../hooks/useFavorites'
import { useBooks } from '../hooks/useBooks'
import bookService from '../services/bookService'
import { clearAllDrafts } from '../utils/draftStorage'
import ConfirmModal from '../components/modals/ConfirmModal'

export default function ProfilePage({ onReplaySplash, onRefreshCatalog }) {
  const [profile, setProfile] = useState(() => userService.getUserProfile())

  // Form states untuk Nama, NIM, Kelompok
  const [name, setName] = useState(profile.name || 'Andri Pratama')
  const [nim, setNim] = useState(profile.nim || '21120122140123')
  const [kelompok, setKelompok] = useState(profile.kelompok || 'Kelompok 15')
  const [bio, setBio] = useState(profile.bio || '')
  const [avatar, setAvatar] = useState(profile.avatar || null)

  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Data stats
  const { favorites } = useFavorites()
  const { books } = useBooks()

  // Modal reset
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetting, setResetting] = useState(false)

  // PWA standalone detection
  const [isStandalone] = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')
    )
  })

  const handleCopyNim = () => {
    if (nim) {
      navigator.clipboard.writeText(nim)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setFeedback('Ukuran foto profil maksimal 2MB.')
      setTimeout(() => setFeedback(''), 3500)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result
      setAvatar(base64)
      userService.updateAvatar(base64)
      setFeedback('Foto profil berhasil diperbarui!')
      setTimeout(() => setFeedback(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const updated = {
      ...profile,
      name: name.trim() || 'Andri Pratama',
      nim: nim.trim() || '21120122140123',
      kelompok: kelompok.trim() || 'Kelompok 15',
      bio: bio.trim(),
      avatar,
    }

    const res = userService.saveUserProfile(updated)
    if (res.success) {
      setProfile(res.data)
      setFeedback('Profil mahasiswa berhasil disimpan!')
      setTimeout(() => setFeedback(''), 3500)
    } else {
      setFeedback('Gagal menyimpan profil.')
    }
  }

  const handleResetCatalog = async () => {
    try {
      setResetting(true)
      await bookService.resetToDefault()
      clearAllDrafts()
      setShowResetModal(false)
      setFeedback('Katalog buku dan draft berhasil di-reset ke data bawaan.')
      if (onRefreshCatalog) onRefreshCatalog()
      setTimeout(() => setFeedback(''), 4000)
    } catch (err) {
      alert('Gagal me-reset katalog: ' + err.message)
    } finally {
      setResetting(false)
    }
  }

  // Menghitung total ulasan yang ada di katalog
  const totalReviewsCount = books.reduce((acc, b) => acc + (b.reviews?.length || 0), 0)

  return (
    <div className="page-profile">
      {/* Header Halaman */}
      <section className="profile-header">
        <div>
          <h1 className="hero-title">Profil Praktikan PPB</h1>
          <p className="hero-desc">
            Informasi identitas mahasiswa, kelompok praktikum, dan statistik penggunaan aplikasi PWA.
          </p>
        </div>
        {onReplaySplash && (
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={onReplaySplash}
            title="Putar ulang animasi intro"
          >
            <Play size={14} /> Putar Ulang Intro
          </button>
        )}
      </section>

      {/* Toast Feedback */}
      {feedback && (
        <div className="toast toast--success">
          <Check size={18} /> {feedback}
        </div>
      )}

      {/* KARTU IDENTITAS RESMI MAHASISWA (PERSYARATAN UTAMA: NAMA, NIM, KELOMPOK) */}
      <section className="student-card">
        <div className="student-card__header">
          <div className="student-card__badge">
            <GraduationCap size={16} /> Praktikum PPB 2026 Ganjil
          </div>
          <span className="student-card__id-label">KARTU PRAKTIKAN RESMI</span>
        </div>

        <div className="student-card__body">
          {/* Avatar */}
          <div className="student-avatar-wrap">
            {avatar ? (
              <img src={avatar} alt={profile.name} className="student-avatar-img" />
            ) : (
              <div className="student-avatar-placeholder">
                <User size={42} stroke="#38BDF8" />
              </div>
            )}
            <label htmlFor="student-avatar-input" className="student-avatar-btn" title="Ganti Foto">
              <Camera size={14} />
              <input
                id="student-avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden-file-input"
              />
            </label>
          </div>

          {/* Core Info: Nama, NIM, Kelompok */}
          <div className="student-info">
            <h2 className="student-name">{profile.name}</h2>
            
            <div className="student-credentials-grid">
              <div className="cred-badge">
                <span className="cred-label">NIM</span>
                <span className="cred-value mono">{profile.nim}</span>
                <button
                  type="button"
                  className="copy-mini-btn"
                  onClick={handleCopyNim}
                  title="Salin NIM"
                >
                  {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                </button>
              </div>

              <div className="cred-badge cred-badge--accent">
                <Users size={14} />
                <span className="cred-label">Kelompok</span>
                <strong className="cred-value">{profile.kelompok}</strong>
              </div>
            </div>

            <p className="student-bio">
              {profile.bio || 'Belum ada bio atau catatan praktikan.'}
            </p>
          </div>
        </div>

        {/* Statistik Penggunaan */}
        <div className="student-card__stats">
          <div className="stat-box">
            <BookOpen size={20} className="stat-icon stat-icon--blue" />
            <span className="stat-num">{books.length}</span>
            <span className="stat-caption">Buku di Katalog</span>
          </div>
          <div className="stat-box">
            <Heart size={20} className="stat-icon stat-icon--red" />
            <span className="stat-num">{favorites.length}</span>
            <span className="stat-caption">Buku Favorit</span>
          </div>
          <div className="stat-box">
            <MessageSquare size={20} className="stat-icon stat-icon--amber" />
            <span className="stat-num">{totalReviewsCount}</span>
            <span className="stat-caption">Ulasan Pembaca</span>
          </div>
        </div>
      </section>

      {/* FORM EDIT DATA PROFIL */}
      <section className="form-card">
        <h2 className="form-card__title">Perbarui Data Mahasiswa</h2>
        <p className="form-card__desc">
          Anda dapat mengubah Nama, NIM, dan Kelompok di bawah ini. Perubahan akan disimpan secara permanen di penyimpanan lokal browser.
        </p>

        <form onSubmit={handleSaveProfile} className="profile-edit-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="student-name-input" className="form-label">
                Nama Lengkap Praktikan <span className="req">*</span>
              </label>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Mahasiswa"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="student-nim-input" className="form-label">
                Nomor Induk Mahasiswa (NIM) <span className="req">*</span>
              </label>
              <input
                id="student-nim-input"
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 21120122140123"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="student-kelompok-input" className="form-label">
                Kelompok Praktikum <span className="req">*</span>
              </label>
              <input
                id="student-kelompok-input"
                type="text"
                value={kelompok}
                onChange={(e) => setKelompok(e.target.value)}
                placeholder="Contoh: Kelompok 15"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="student-role-input" className="form-label">
                Mata Kuliah / Program
              </label>
              <input
                id="student-role-input"
                type="text"
                value={profile.role}
                readOnly
                className="form-input form-input--disabled"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="student-bio-input" className="form-label">
              Bio / Catatan Mahasiswa
            </label>
            <textarea
              id="student-bio-input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tuliskan catatan atau peran Anda dalam praktikum..."
              className="form-textarea"
            />
          </div>

          <div className="profile-form-actions">
            <button type="submit" className="btn btn--primary">
              <Save size={16} /> Simpan Data Profil
            </button>
          </div>
        </form>
      </section>

      {/* DIAGNOSTIK PWA & SERVICE WORKER */}
      <section className="form-card">
        <h2 className="form-card__title">Status Progressive Web App (PWA)</h2>
        <p className="form-card__desc">
          Pemeriksaan fungsionalitas teknologi PWA dan Service Worker pada lingkungan browser Anda.
        </p>

        <div className="pwa-diag-grid">
          <div className="pwa-diag-item">
            <ShieldCheck size={20} className="diag-icon diag-icon--ok" />
            <div className="diag-texts">
              <strong>Service Worker</strong>
              <span>{'serviceWorker' in navigator ? 'Didukung & Aktif' : 'Tidak didukung'}</span>
            </div>
          </div>

          <div className="pwa-diag-item">
            <Wifi size={20} className="diag-icon diag-icon--ok" />
            <div className="diag-texts">
              <strong>Koneksi Jaringan</strong>
              <span>{navigator.onLine ? 'Online (Terhubung)' : 'Offline (Bekerja dari Cache)'}</span>
            </div>
          </div>

          <div className="pwa-diag-item">
            <HardDrive size={20} className="diag-icon diag-icon--ok" />
            <div className="diag-texts">
              <strong>Penyimpanan Cache &amp; Storage</strong>
              <span>Tersedia (LocalStorage &amp; Cache API)</span>
            </div>
          </div>

          <div className="pwa-diag-item">
            <Sparkles size={20} className="diag-icon diag-icon--accent" />
            <div className="diag-texts">
              <strong>Mode Tampilan</strong>
              <span>{isStandalone ? 'Aplikasi Terpasang (Standalone)' : 'Browser Web Tab'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* RESET & DATA MANAGEMENT */}
      <section className="form-card form-card--danger-zone">
        <h2 className="form-card__title">Pengaturan Data Koleksi</h2>
        <p className="form-card__desc">
          Kembalikan katalog ke 8 buku bawaan atau bersihkan seluruh draft pengisian formulir.
        </p>

        <div className="danger-actions-row">
          <button
            type="button"
            className="btn btn--danger-ghost"
            onClick={() => setShowResetModal(true)}
          >
            <RotateCcw size={15} /> Reset Koleksi ke Data Awal
          </button>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => {
              clearAllDrafts()
              setFeedback('Semua draft formulir berhasil dibersihkan.')
              setTimeout(() => setFeedback(''), 3000)
            }}
          >
            Bersihkan Draft Form
          </button>
        </div>
      </section>

      {/* Modal Konfirmasi Reset */}
      <ConfirmModal
        open={showResetModal}
        title="Reset Katalog ke Data Awal?"
        message="Tindakan ini akan mengembalikan daftar buku ke 8 koleksi awal dan menghapus buku tambahan yang telah Anda buat. Apakah Anda yakin?"
        confirmLabel="Reset Sekarang"
        cancelLabel="Batal"
        danger
        loading={resetting}
        onConfirm={handleResetCatalog}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  )
}
