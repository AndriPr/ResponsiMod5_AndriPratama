import { Sparkles, ShieldCheck } from 'lucide-react'

const CURRENT_YEAR = 2026

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-title">BookVerse PWA</span>
            <p className="footer-desc">
              Aplikasi Progressive Web App Perpustakaan Digital responsif dan offline-first.
            </p>
          </div>
          <div className="footer-meta">
            <span className="status-tag">
              <ShieldCheck size={14} color="#10B981" /> Service Worker Aktif
            </span>
            <span className="status-tag">
              <Sparkles size={14} color="#F59E0B" /> PWA Installable
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Dibuat untuk <strong>Responsi Praktikum PPB 2026 Ganjil</strong> &bull; Andri Pratama
          </p>
          <p className="footer-copy">
            &copy; {CURRENT_YEAR} BookVerse PWA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
