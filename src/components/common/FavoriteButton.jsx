import { Heart } from 'lucide-react'
import { useIsFavorited } from '../../hooks/useFavorites'

/**
 * FavoriteButton — Tombol bookmark/favorit buku dengan animasi dan offline support.
 */
export default function FavoriteButton({ bookId, onToggle }) {
  const { isFavorited, loading, toggleFavorite } = useIsFavorited(bookId)

  const handleClick = async (e) => {
    e.stopPropagation() // Mencegah klik menyebar ke card parent
    const result = await toggleFavorite()
    if (result && onToggle) onToggle(result)
  }

  return (
    <button
      type="button"
      className={`fav-btn ${isFavorited ? 'fav-btn--active' : ''}`}
      onClick={handleClick}
      disabled={loading}
      aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Heart
        size={18}
        fill={isFavorited ? '#EF4444' : 'none'}
        stroke={isFavorited ? '#EF4444' : 'currentColor'}
      />
    </button>
  )
}
