import { useState, useEffect } from 'react'
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

export default function EditBookPage({ book, bookId, onBack, onSuccess }) {
  const targetId = bookId || book?.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Teknologi',
    year: 2026,
    pages: 280,
    publisher: '',
    isbn: '',
    rating: 5,
    status: 'Tersedia',
    description: '',
  })

  const [coverUrl, setCoverUrl] = useState('')
  const [coverPreview, setCoverPreview] = useState(null)
  const [chapters, setChapters] = useState([])

  // Draft modal
  const [showDraftModal, setShowDraftModal] = useState(() =>
    targetId ? hasDraft(targetId) : false,
  )
  const [draftTimestamp, setDraftTimestamp] = useState(() =>
    targetId ? getDraftTimestamp(targetId) : null,
  )

  // Load initial book
  useEffect(() => {
    const fetchTarget = async () => {
      try {
        setLoading(true)
        let data = book
        if (!data || !data.title) {
          const res = await bookService.getBookById(targetId)
          if (res.success) data = res.data
        }

        if (data) {
          setFormData({
            title: data.title || '',
            author: data.author || '',
            category: data.category || 'Teknologi',
            year: data.year || 2026,
            pages: data.pages || 200,
            publisher: data.publisher || '',
            isbn: data.isbn || '',
            rating: data.rating || 5,
            status: data.status || 'Tersedia',
            description: data.description || '',
          })
          setCoverUrl(data.cover || '/covers/clean-code.svg')
          setChapters(
            Array.isArray(data.chapters) && data.chapters.length > 0
              ? data.chapters
              : [{ name: 'Bab 1: Konsep Dasar', detail: 'Ringkasan materi utama' }],
          )
        }
      } catch (err) {
        setErrorMsg(err.message || 'Gagal memuat data buku untuk diedit.')
      } finally {
        setLoading(false)
      }
    }

    if (targetId) fetchTarget()
  }, [targetId, book])

  // Draft
  const handleLoadDraft = () => {
    const draft = loadDraft(targetId)
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.coverUrl) {
        setCoverUrl(draft.coverUrl)
        setCoverPreview(draft.coverUrl)
      }
      if (draft.chapters) setChapters(draft.chapters)
      setShowDraftModal(false)
      setSuccessMsg('Perubahan draft berhasil dipulihkan.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft(targetId)
    setShowDraftModal(false)
    setDraftTimestamp(null)
  }

  const handleManualSaveDraft = () => {
    const draftData = { formData, coverUrl, chapters }
    const ok = saveDraft(draftData, targetId)
    if (ok) {
      const ts = getDraftTimestamp(targetId)
      setDraftTimestamp(ts)
      setSuccessMsg(`Draft disimpan (${formatDraftTime(ts)})`)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Ukuran gambar maksimal 4MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setCoverPreview(dataUrl)
      setCoverUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!formData.title.trim()) {
      setErrorMsg('Judul buku tidak boleh kosong.')
      return
    }

    const payload = {
      ...formData,
      cover: coverUrl || '/covers/clean-code.svg',
      chapters: chapters.filter((c) => c.name.trim()),
    }

    try {
      setSaving(true)
      const res = await bookService.updateBook(targetId, payload)
      if (res.success) {
        deleteDraft(targetId)
        if (onSuccess) onSuccess(res.data)
        else if (onBack) onBack()
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan perubahan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="state-panel">
        <Loader size={28} className="spin" />
        <p>Memuat data buku untuk pengeditan…</p>
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="form-page__header">
        <button type="button" className="detail-back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Kembali
        </button>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={handleManualSaveDraft}
        >
          <Save size={14} /> Simpan Draft
        </button>
      </div>

      <div className="form-title-group">
        <h1 className="hero-title">Edit Data Buku</h1>
        <p className="hero-desc">
          ID Buku: <code className="code-pill">{targetId}</code>
        </p>
      </div>

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

      <form onSubmit={handleSubmit} className="entry-form">
        {/* Cover edit box */}
        <div className="form-card">
          <h2 className="form-card__title">Sampul Buku</h2>
          <div className="edit-cover-row">
            <img
              src={coverPreview || coverUrl}
              alt="Sampul Buku"
              className="edit-cover-thumb"
            />
            <div className="edit-cover-controls">
              <input
                id="edit-cover-file"
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden-file-input"
              />
              <label htmlFor="edit-cover-file" className="btn btn--outline btn--sm">
                <Upload size={14} /> Pilih File Gambar Baru
              </label>

              <div className="preset-quick-row">
                <span className="preset-label">Preset:</span>
                <div className="preset-pills-row">
                  {PRESET_COVERS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      className={`pill ${coverUrl === p.url ? 'pill--active' : ''}`}
                      onClick={() => {
                        setCoverPreview(null)
                        setCoverUrl(p.url)
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info dasar */}
        <div className="form-card">
          <h2 className="form-card__title">Informasi Buku</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="edit-title" className="form-label">
                Judul Buku <span className="req">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-author" className="form-label">
                Penulis / Pengarang <span className="req">*</span>
              </label>
              <input
                id="edit-author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleFormChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid form-grid--3">
            <div className="form-group">
              <label htmlFor="edit-category" className="form-label">
                Kategori
              </label>
              <select
                id="edit-category"
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
              <label htmlFor="edit-year" className="form-label">
                Tahun Terbit
              </label>
              <input
                id="edit-year"
                type="number"
                name="year"
                value={formData.year}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-pages" className="form-label">
                Halaman
              </label>
              <input
                id="edit-pages"
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="edit-publisher" className="form-label">
                Penerbit
              </label>
              <input
                id="edit-publisher"
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-status" className="form-label">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Dipinjam">Dipinjam</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-desc" className="form-label">
              Sinopsis
            </label>
            <textarea
              id="edit-desc"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={4}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Chapters */}
        <div className="form-card">
          <div className="form-card__header-row">
            <h2 className="form-card__title">Pokok Bahasan / Daftar Bab</h2>
            <button type="button" className="btn btn--outline btn--sm" onClick={addChapter}>
              <Plus size={14} /> Tambah Bab
            </button>
          </div>
          <div className="multi-fields-list">
            {chapters.map((ch, idx) => (
              <div key={idx} className="multi-field-row">
                <span className="field-num-pill">{idx + 1}</span>
                <input
                  type="text"
                  placeholder="Nama Bab"
                  value={ch.name}
                  onChange={(e) => handleChapterChange(idx, 'name', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Deskripsi materi"
                  value={ch.detail}
                  onChange={(e) => handleChapterChange(idx, 'detail', e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="btn btn--danger-ghost btn--sm"
                  onClick={() => removeChapter(idx)}
                  disabled={chapters.length <= 1}
                  title="Hapus baris"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="form-submit-bar">
          <button type="button" className="btn btn--outline" onClick={onBack} disabled={saving}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? (
              <>
                <Loader size={16} className="spin" /> Menyimpan Perubahan…
              </>
            ) : (
              'Simpan Pembaruan'
            )}
          </button>
        </div>
      </form>

      {/* Draft dialog */}
      <ConfirmModal
        open={showDraftModal}
        title="Pulihkan Draft Perubahan?"
        message={`Ditemukan draft pengeditan yang tersimpan dari ${draftTimestamp ? formatDraftTime(draftTimestamp) : 'sebelumnya'}. Pulihkan perubahan ini?`}
        confirmLabel="Pulihkan"
        cancelLabel="Hapus Draft"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
