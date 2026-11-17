import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import './SplashScreen.css'

/**
 * SplashScreen — Animasi splash pengenalan aplikasi BookVerse PWA.
 * Otomatis tertutup setelah 3.5 detik atau ketika tombol Lewati ditekan.
 */
export default function SplashScreen({ onFinish, duration = 3500 }) {
  const [isFading, setIsFading] = useState(false)
  const dismissedRef = useRef(false)

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setIsFading(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 500)
  }, [onFinish])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [duration, handleDismiss])

  return (
    <div
      className={`splash-overlay ${isFading ? 'splash-overlay--fading' : ''}`}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="BookVerse Splash"
    >
      <div className="splash-content" onClick={(e) => e.stopPropagation()}>
        <div className="splash-logo-wrap">
          <div className="splash-logo-glow" />
          <img src="/favicon.svg" alt="BookVerse Logo" className="splash-logo" />
        </div>

        <h1 className="splash-brand-title">BookVerse</h1>
        <div className="splash-brand-sub">PERPUSTAKAAN DIGITAL PWA</div>
        <p className="splash-tagline">
          Koleksi Buku &amp; Manajemen Pustaka Digital Berkemampuan Offline Modern.
        </p>

        <div className="splash-pwa-badge">
          <BookOpen size={14} color="#F59E0B" />
          <span>Responsi Praktikum PPB 2026</span>
        </div>
      </div>

      <button
        type="button"
        className="splash-skip-btn"
        onClick={handleDismiss}
        aria-label="Buka Perpustakaan"
      >
        <span>Masuk Aplikasi</span>
        <ArrowRight size={15} />
      </button>

      <span className="splash-hint">Klik di mana saja untuk melanjutkan</span>
    </div>
  )
}
