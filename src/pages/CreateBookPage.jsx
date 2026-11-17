import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react'
import bookService from '../services/bookService'
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  hasDraft,
  getDraftTimestamp,
  formatDraftTime,
} from '../utils/draftStorage'
import ConfirmModal from '../components/modals/ConfirmModal'

const PRESET_COVERS = [
  { label: 'Clean Code', url: '/covers/clean-code.svg' },
  { label: 'React PWA', url: '/covers/react-deep-dive.svg' },
  { label: 'Atomic Habits', url: '/covers/atomic-habits.svg' },
  { label: 'Bumi Manusia', url: '/covers/bumi-manusia.svg' },
  { label: 'Laskar Pelangi', url: '/covers/laskar-pelangi.svg' },
  { label: 'Design Systems', url: '/covers/design-system.svg' },
  { label: 'AI Modern', url: '/covers/ai-intelligence.svg' },
  { label: 'Psychology of Money', url: '/covers/psychology-money.svg' },
]

export default function CreateBookPage({ onBack, onSuccess }) {
  const [currentStep, setCurrentStep] = useState('cover') // 'cover' | 'form'

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Teknologi',
    year: 2026,
    pages: 280,
    publisher: 'Informatika Press',
    isbn: '978-623-1234-56-7',
    rating: 5,
    status: 'Tersedia',
    description: '',
  })

  const [coverUrl, setCoverUrl] = useState('/covers/clean-code.svg')
  const [coverPreview, setCoverPreview] = useState(null)

  // Bab Pokok Bahasan
  const [chapters, setChapters] = useState([
    { name: 'Bab 1: Pendahuluan & Konsep', detail: 'Pengenalan topik dan studi kasus dasar.' },
    { name: 'Bab 2: Implementasi Inti', detail: 'Penerapan teknis dan panduan praktis.' },
  ])

  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Draft
  const [showDraftModal, setShowDraftModal] = useState(() => hasDraft('create'))
  const [draftTimestamp, setDraftTimestamp] = useState(() => getDraftTimestamp('create'))

  const handleSaveDraft = useCallback(
    (notify = true) => {
      const draftData = {
        formData,
        coverUrl,
        chapters,
      }
      const ok = saveDraft(draftData, 'create')
      if (ok) {
        const ts = getDraftTimestamp('create')
        setDraftTimestamp(ts)
        if (notify) {
          setSuccessMsg(`Draft berhasil disimpan (${formatDraftTime(ts)})`)
          setTimeout(() => setSuccessMsg(''), 3000)
        }
      }
    },
    [formData, coverUrl, chapters],
  )

  // Auto-save setiap 20 detik
  useEffect(() => {
    if (currentStep !== 'form') return
    const timer = setInterval(() => {
      handleSaveDraft(false)
    }, 20000)
    return () => clearInterval(timer)
  }, [handleSaveDraft, currentStep])

  const handleLoadDraft = () => {
    const draft = loadDraft('create')
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.coverUrl) {
        setCoverUrl(draft.coverUrl)
        setCoverPreview(draft.coverUrl)
      }
      if (draft.chapters) setChapters(draft.chapters)
      setCurrentStep('form')
      setShowDraftModal(false)
      setSuccessMsg('Draft sebelumnya berhasil dimuat!')
      setTimeout(() => setSuccessMsg(''), 4000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft('create')
    setShowDraftModal(false)
    setDraftTimestamp(null)
  }

  // Handle upload gambar sampul dari disk
  const handleCoverFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 4MB.')
      return
    }

    setCoverFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setCoverPreview(dataUrl)
      setCoverUrl(dataUrl)
      setErrorMsg('')
    }
    reader.readAsDataURL(file)
  }

  const handleSelectPreset = (url) => {
    setCoverPreview(null)
    setCoverUrl(url)
    setErrorMsg('')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Chapters handlers
  const handleChapterChange = (index, field, value) => {
    setChapters((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      { name: `Bab ${prev.length + 1}`, detail: '' },
    ])
  }

  const removeChapter = (index) => {
    if (chapters.length <= 1) return
    setChapters((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      setErrorMsg('Judul buku minimal harus 3 karakter.')
      return
    }

    if (!formData.author.trim()) {
      setErrorMsg('Harap masukkan nama penulis buku.')
      return
    }

    const payload = {
      ...formData,
      cover: coverUrl || '/covers/clean-code.svg',
      chapters: chapters.filter((c) => c.name.trim()),
    }

    try {
      setSaving(true)
      const res = await bookService.createBook(payload)
      if (res.success) {
        deleteDraft('create')
        if (onSuccess) onSuccess(res.data)
        else if (onBack) onBack()
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan buku baru.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-page">
      {/* Header Form */}
      <div className="form-page__header">
        <button type="button" className="detail-back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Kembali ke Katalog
        </button>
        <div className="form-page__actions">
          {currentStep === 'form' && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => handleSaveDraft(true)}
            >
              <Save size={14} /> Simpan Draft
            </button>
          )}
        </div>
      </div>

      <div className="form-title-group">
        <h1 className="hero-title">Tambah Buku ke Perpustakaan</h1>
        <p className="hero-desc">
          Masukkan informasi lengkap buku baru. Data akan disimpan secara lokal dan dapat
          diakses tanpa koneksi internet.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="toast toast--error">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="toast toast--success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {/* Step Indicators */}
      <div className="form-steps-nav">
        <button
          type="button"
          className={`step-badge ${currentStep === 'cover' ? 'step-badge--active' : 'step-badge--done'}`}
          onClick={() => setCurrentStep('cover')}
        >
          1. Sampul Buku
        </button>
        <div className="step-connector" />
        <button
          type="button"
          className={`step-badge ${currentStep === 'form' ? 'step-badge--active' : ''}`}
          onClick={() => setCurrentStep('form')}
        >
          2. Informasi &amp; Pokok Bahasan
        </button>
      </div>

      {/* STEP 1: SAMPUL */}
      {currentStep === 'cover' && (
        <div className="form-card">
          <h2 className="form-card__title">Pilih atau Unggah Sampul Buku</h2>
          <p className="form-card__desc">
            Unggah foto/desain sampul dari perangkat Anda (JPG, PNG, WebP) atau pilih dari preset tema yang tersedia.
          </p>

          <div className="cover-picker-container">
            {/* Active Preview */}
            <div className="cover-preview-box">
              <img
                src={coverPreview || coverUrl}
                alt="Pratinjau Sampul"
                className="cover-preview-img"
              />
              <span className="cover-preview-label">Sampul Terpilih</span>
            </div>

            <div className="cover-picker-controls">
              {/* File Upload Dropzone */}
              <div className="upload-dropzone">
                <input
                  id="cover-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleCoverFileChange}
                  className="hidden-file-input"
                />
                <label htmlFor="cover-file-input" className="upload-dropzone__label">
                  <Upload size={32} className="upload-icon" />
                  <span className="upload-main-text">Klik untuk Unggah Gambar Sampul</span>
                  <span className="upload-sub-text">Mendukung format JPG, PNG, SVG hingga 4MB</span>
                </label>
              </div>

              {/* Presets */}
              <div className="preset-container">
                <span className="preset-label">Atau gunakan preset sampul siap pakai:</span>
                <div className="preset-grid">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      className={`preset-btn ${coverUrl === preset.url ? 'preset-btn--active' : ''}`}
                      onClick={() => handleSelectPreset(preset.url)}
                    >
                      <img src={preset.url} alt={preset.label} className="preset-mini-thumb" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setCurrentStep('form')}
                >
                  Gunakan Sampul Ini &amp; Lanjutkan Form &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: FORMULIR INFORMASI */}
      {currentStep === 'form' && (
        <form onSubmit={handleSubmit} className="entry-form">
          {/* Thumb Sampul Kecil */}
          <div className="selected-cover-bar">
            <img src={coverPreview || coverUrl} alt="Sampul" className="selected-cover-thumb" />
            <div className="selected-cover-info">
              <strong>Sampul Terpilih</strong>
              <span>Tekan tombol di samping jika ingin mengganti sampul</span>
            </div>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setCurrentStep('cover')}
            >
              Ganti Sampul
            </button>
          </div>

          <div className="form-card">
            <h2 className="form-card__title">Informasi Dasar Buku</h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Judul Buku <span className="req">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Contoh: Belajar Pemrograman Web Modern"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author" className="form-label">
                  Penulis / Pengarang <span className="req">*</span>
                </label>
                <input
                  id="author"
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleFormChange}
                  placeholder="Contoh: Andri Pratama"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-grid form-grid--3">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Kategori / Genre <span className="req">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="form-select"
                >
                  <option value="Teknologi">Teknologi &amp; Coding</option>
                  <option value="Pengembangan Diri">Pengembangan Diri</option>
                  <option value="Sastra">Fiksi &amp; Sastra</option>
                  <option value="Desain">UI/UX &amp; Desain</option>
                  <option value="Sains & AI">Sains &amp; AI</option>
                  <option value="Bisnis">Bisnis &amp; Finansial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year" className="form-label">
                  Tahun Terbit <span className="req">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleFormChange}
                  min="1900"
                  max="2030"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pages" className="form-label">
                  Jumlah Halaman <span className="req">*</span>
                </label>
                <input
                  id="pages"
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleFormChange}
                  min="1"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="publisher" className="form-label">
                  Penerbit
                </label>
                <input
                  id="publisher"
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleFormChange}
                  placeholder="Contoh: Gramedia Pustaka Utama"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status Ketersediaan
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="form-select"
                >
                  <option value="Tersedia">Tersedia untuk Dibaca/Dipinjam</option>
                  <option value="Dipinjam">Sedang Dipinjam</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Sinopsis &amp; Ringkasan Buku
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Tuliskan gambaran singkat tentang isi buku ini..."
                rows={4}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Bab Pokok Bahasan */}
          <div className="form-card">
            <div className="form-card__header-row">
              <div>
                <h2 className="form-card__title">Pokok Bahasan / Daftar Bab</h2>
                <p className="form-card__desc">Tambahkan bab-bab kunci yang dibahas dalam buku ini.</p>
              </div>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={addChapter}
              >
                <Plus size={14} /> Tambah Bab
              </button>
            </div>

            <div className="multi-fields-list">
              {chapters.map((ch, idx) => (
                <div key={idx} className="multi-field-row">
                  <span className="field-num-pill">{idx + 1}</span>
                  <input
                    type="text"
                    placeholder="Nama Bab (misal: Bab 1: Dasar)"
                    value={ch.name}
                    onChange={(e) => handleChapterChange(idx, 'name', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Deskripsi singkat materi bab"
                    value={ch.detail}
                    onChange={(e) => handleChapterChange(idx, 'detail', e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="btn btn--danger-ghost btn--sm"
                    onClick={() => removeChapter(idx)}
                    disabled={chapters.length <= 1}
                    title="Hapus baris ini"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-submit-bar">
            <button
              type="button"
              className="btn btn--outline"
              onClick={onBack}
              disabled={saving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader size={16} className="spin" /> Menyimpan Buku…
                </>
              ) : (
                'Simpan Buku ke Perpustakaan'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Modal Pulihkan Draft */}
      <ConfirmModal
        open={showDraftModal}
        title="Pulihkan Draft Sebelumnya?"
        message={`Ditemukan draft pengisian buku yang tersimpan (${draftTimestamp ? formatDraftTime(draftTimestamp) : 'sebelumnya'}). Apakah Anda ingin melanjutkan pengisian draft tersebut?`}
        confirmLabel="Muat Draft"
        cancelLabel="Hapus Draft"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
