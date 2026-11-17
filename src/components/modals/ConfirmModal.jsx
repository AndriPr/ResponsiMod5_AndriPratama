import { AlertTriangle, Info } from 'lucide-react'

/**
 * ConfirmModal — Modal konfirmasi interaktif untuk hapus, pemulihan draft, dsb.
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-box"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-msg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-icon ${danger ? 'modal-icon--danger' : 'modal-icon--info'}`}>
          {danger ? <AlertTriangle size={28} /> : <Info size={28} />}
        </div>
        <h3 id="confirm-title" className="modal-title">
          {title}
        </h3>
        <p id="confirm-msg" className="modal-msg">
          {message}
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Memproses…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
