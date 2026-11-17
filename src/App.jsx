import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ChatAssistant from './components/ChatAssistant.jsx'
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

  // Global search input in topbar
  const [searchQuery, setSearchQuery] = useState('')

  // Chat assistant panel visibility
  const [isChatOpen, setIsChatOpen] = useState(true)

  // Delete target state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Navigation handler
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
    <div className="clay-app-shell">
      {/* 1. Splash Screen Intro */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. Main Claymorphism Desktop Layout Frame */}
      <div className="clay-main-frame">
        {/* Left Column: Vertical Icon Rail */}
        <Sidebar
          tab={mode === 'list' ? tab : ''}
          onTab={(t) => handleNavigate(t)}
          onNavigateCreate={() => handleNavigate('Create')}
        />

        {/* Center Column: App Content Canvas */}
        <div className="clay-center-column">
          {/* Topbar: Pill Search, Cart/Fav, Add Book, Chat Toggle */}
          <Header
            search={searchQuery}
            onSearch={setSearchQuery}
            onTab={(t) => handleNavigate(t)}
            onToggleChat={() => setIsChatOpen((prev) => !prev)}
            isChatOpen={isChatOpen}
            onNavigateCreate={() => handleNavigate('Create')}
          />

          {/* Dynamic Content View */}
          <main className="clay-content-body">
            {mode === 'create' && (
              <CreateBookPage
                onBack={handleBackToList}
                onSuccess={() => {
                  handleBackToList()
                  setTab('Catalog')
                }}
              />
            )}

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

            {mode === 'detail' && selectedBook && (
              <BookDetail
                book={selectedBook}
                onBack={handleBackToList}
                onEdit={(b) => handleNavigate('Edit', b)}
                onDelete={(b) => setDeleteTarget(b)}
              />
            )}

            {mode === 'list' && (
              <>
                {tab === 'Catalog' && (
                  <Catalog
                    onNavigate={(dest, payload) => handleNavigate(dest, payload)}
                    search={searchQuery}
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

          <Footer />
        </div>

        {/* Right Column: Chat Assistant Panel */}
        {isChatOpen && (
          <ChatAssistant
            onClose={() => setIsChatOpen(false)}
            onSelectBook={(b) => handleNavigate('Detail', b)}
          />
        )}
      </div>

      {/* Global Delete Confirmation */}
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

      {/* PWA Offline & Install Badge */}
      <PWABadge />
    </div>
  )
}
