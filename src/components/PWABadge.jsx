import { useState, useEffect } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

/**
 * PWABadge — Banner status PWA: offline indicator & instalasi Progressive Web App.
 */
export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Tangkap event instalasi browser
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  if (dismissed) return null

  // Banner status offline
  if (isOffline) {
    return (
      <aside className="pwa-badge pwa-badge--offline" role="status" aria-live="polite">
        <div className="pwa-badge-content">
          <WifiOff size={18} className="pwa-badge-icon" />
          <div>
            <strong>Mode Offline Aktif</strong>
            <p>Buku dan data tersimpan diakses melalui cache Service Worker.</p>
          </div>
        </div>
      </aside>
    )
  }

  // Notifikasi instalasi PWA
  if (installPrompt && !installed) {
    return (
      <aside className="pwa-badge" role="region" aria-label="Instal Aplikasi PWA">
        <div className="pwa-badge-content">
          <div className="pwa-badge-logo">
            <img src="/favicon.svg" alt="BookVerse" width="28" height="28" />
          </div>
          <div>
            <strong>Pasang Aplikasi BookVerse</strong>
            <p>Instal di layar utama ponsel/desktop untuk akses cepat &amp; offline.</p>
          </div>
        </div>
        <div className="pwa-badge-actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleInstallClick}
          >
            <Download size={14} /> Instal PWA
          </button>
          <button
            type="button"
            className="icon-btn-ghost"
            onClick={() => setDismissed(true)}
            aria-label="Tutup notifikasi"
          >
            <X size={16} />
          </button>
        </div>
      </aside>
    )
  }

  return null
}
