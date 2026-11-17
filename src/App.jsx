import { useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Catalog from './pages/Catalog.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CreateBookPage from './pages/CreateBookPage.jsx'
import EditBookPage from './pages/EditBookPage.jsx'
import BookDetail from './components/book/BookDetail.jsx'
import AboutPage from './pages/AboutPage.jsx'
import PWABadge from './components/PWABadge.jsx'
import ConfirmModal from './components/modals/ConfirmModal.jsx'
import SplashScreen from './components/common/SplashScreen.jsx'
import bookService from './services/bookService.js'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [tab, setTab] = useState('Catalog')
  const [mode, setMode] = useState('list') // 'list' | 'create' | 'edit' | 'detail'
  const [selectedBook, setSelectedBook] = useState(null)
  const [editingBook, setEditingBook] = useState(null)

  // Global Delete target
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Handler navigasi terpadu
  const handleNavigate = (target, payload) => {
    if (target === 'Create') {
      setMode('create')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (target === 'Edit') {
      setEditingBook(payload)
      setMode('edit')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (target === 'Detail') {
      setSelectedBook(payload)
      setMode('detail')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Pergantian Tab utama
      setTab(target)
      setMode('list')
      setSelectedBook(null)
      setEditingBook(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToList = () => {
    setMode('list')
    setSelectedBook(null)
    setEditingBook(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await bookService.deleteBook(deleteTarget.id)
      setDeleteTarget(null)
      handleBackToList()
      setTab('Catalog')
    } catch (err) {
      alert(err.message || 'Gagal menghapus buku.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="shell">
      {/* Animasi Pembuka Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Header & Navigasi */}
      <Header
        tab={mode === 'list' ? tab : ''}
        onTab={(newTab) => handleNavigate(newTab)}
        onNavigateCreate={() => handleNavigate('Create')}
      />

      {/* Konten Halaman Utama */}
      <main className="main-container">
        {/* Sub-halaman Tambah Buku */}
        {mode === 'create' && (
          <CreateBookPage
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              setTab('Catalog')
            }}
          />
        )}

        {/* Sub-halaman Edit Buku */}
        {mode === 'edit' && (
          <EditBookPage
            book={editingBook}
            bookId={editingBook?.id}
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              setTab('Catalog')
            }}
          />
        )}

        {/* Sub-halaman Detail Buku */}
        {mode === 'detail' && selectedBook && (
          <BookDetail
            book={selectedBook}
            onBack={handleBackToList}
            onEdit={(b) => handleNavigate('Edit', b)}
            onDelete={(b) => setDeleteTarget(b)}
          />
        )}

        {/* Tab Utama */}
        {mode === 'list' && (
          <>
            {tab === 'Catalog' && (
              <Catalog
                onNavigate={(dest, payload) => handleNavigate(dest, payload)}
              />
            )}
            {tab === 'Favorites' && (
              <FavoritesPage
                onSelectBook={(b) => handleNavigate('Detail', b)}
                onNavigateCatalog={() => setTab('Catalog')}
              />
            )}
            {tab === 'Profile' && (
              <ProfilePage
                onReplaySplash={() => setShowSplash(true)}
                onRefreshCatalog={() => setTab('Catalog')}
              />
            )}
            {tab === 'About' && <AboutPage />}
          </>
        )}
      </main>

      {/* Modal Hapus Global */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Buku"
        message={`Apakah Anda yakin ingin menghapus buku "${deleteTarget?.title}"?`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* PWA Offline & Install Prompt Badge */}
      <PWABadge />

      {/* Footer */}
      <Footer />
    </div>
  )
}
