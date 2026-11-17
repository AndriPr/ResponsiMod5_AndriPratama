import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Paperclip,
  ChevronRight,
  X,
} from 'lucide-react'
import { INITIAL_BOOKS } from '../data/initialBooks'
import { getUserProfile } from '../services/userService'

export default function ChatAssistant({ onClose, onSelectBook }) {
  const profile = getUserProfile()
  const messagesEndRef = useRef(null)

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Halo! Apakah ada rekomendasi buku pemrograman dan pengembangan diri terbaik?',
    },
    {
      id: 2,
      sender: 'assistant',
      text: 'Halo ' + (profile.name || 'Andri') + '! Tentu, BookVerse memiliki koleksi unggulan yang sangat direkomendasikan:',
      books: [
        { id: 'book-1', title: 'Clean Code', cover: '/covers/clean-code.svg' },
        { id: 'book-2', title: 'React & PWA', cover: '/covers/react-deep-dive.svg' },
        { id: 'book-3', title: 'Atomic Habits', cover: '/covers/atomic-habits.svg' },
      ],
    },
    {
      id: 3,
      sender: 'user',
      text: 'Apakah aplikasi BookVerse ini bisa berjalan secara offline?',
    },
    {
      id: 4,
      sender: 'assistant',
      text: 'Ya, tentu saja! BookVerse dibangun dengan teknologi Progressive Web App (PWA) dan Service Worker Cache API. Anda bisa menginstal aplikasi ini ke layar utama dan membaca data kapan saja tanpa koneksi internet.',
    },
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (e) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userText = input.trim()
    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
    }

    setMessages((prev) => [...prev, newMsg])
    setInput('')

    // Generate intelligent assistant reply
    setTimeout(() => {
      let replyText = 'Saya siap membantu mencari informasi buku dan fitur PWA BookVerse.'
      let replyBooks = null

      const q = userText.toLowerCase()
      if (q.includes('rekomendasi') || q.includes('buku') || q.includes('populer') || q.includes('coding')) {
        replyText = 'Berikut adalah 3 buku dengan rating tertinggi di katalog kami saat ini:'
        replyBooks = INITIAL_BOOKS.slice(0, 3).map((b) => ({
          id: b.id,
          title: b.title.split(':')[0],
          cover: b.cover,
        }))
      } else if (q.includes('offline') || q.includes('pwa') || q.includes('install') || q.includes('instal')) {
        replyText =
          'Fungsionalitas PWA telah aktif! Buka menu browser atau tombol "Instal PWA" di bawah untuk memasang aplikasi ke smartphone Anda. Cache Service Worker akan menyimpan seluruh halaman untuk akses offline.'
      } else if (q.includes('profil') || q.includes('nim') || q.includes('kelompok') || q.includes('praktikan')) {
        replyText = `Data Praktikan resmi: Nama: ${profile.name}, NIM: ${profile.nim}, Kelompok: ${profile.kelompok || 'Kelompok 29'}. Data ini tersimpan di halaman Profil.`
      } else {
        replyText =
          'Pesan diterima! Anda dapat menggunakan bilah pencarian di bagian atas atau memfilter kategori untuk menjelajahi seluruh koleksi buku.'
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: replyText,
          books: replyBooks,
        },
      ])
    }, 450)
  }

  const handleQuickQuestion = (q) => {
    setInput(q)
    setTimeout(() => {
      handleSend()
    }, 50)
  }

  return (
    <aside className="clay-chat-panel">
      {/* Chat Top Header */}
      <div className="chat-panel__header">
        <div className="chat-panel__title-wrap">
          <div className="chat-status-dot" />
          <h3 className="chat-panel__title">Chat Asisten Pustaka</h3>
        </div>
        {onClose && (
          <button
            type="button"
            className="chat-close-btn"
            onClick={onClose}
            title="Tutup Panel Chat"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Privacy and Support Banner */}
      <div className="chat-support-banner">
        <div className="support-banner-texts">
          <strong>Bantuan Praktikum PPB</strong>
          <span>Responsi Modul 5 PWA II</span>
        </div>
        <div className="support-banner-arrow">
          <ChevronRight size={16} />
        </div>
      </div>

      {/* Messages Stream */}
      <div className="chat-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble-row ${msg.sender === 'user' ? 'chat-bubble-row--user' : 'chat-bubble-row--assistant'}`}
          >
            <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'}`}>
              <p className="chat-bubble-text">{msg.text}</p>

              {/* Mini Book Recommendations Cards */}
              {msg.books && msg.books.length > 0 && (
                <div className="chat-mini-books-grid">
                  {msg.books.map((b) => (
                    <div
                      key={b.id}
                      className="chat-mini-book-card"
                      onClick={() => onSelectBook && onSelectBook(b)}
                      title={`Klik untuk melihat detail ${b.title}`}
                    >
                      <img src={b.cover} alt={b.title} className="chat-mini-book-cover" />
                      <span className="chat-mini-book-title">{b.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="chat-quick-chips">
        <button
          type="button"
          className="quick-chip"
          onClick={() => handleQuickQuestion('Rekomendasi buku teknologi terbaik?')}
        >
          Rekomendasi Buku
        </button>
        <button
          type="button"
          className="quick-chip"
          onClick={() => handleQuickQuestion('Bagaimana cara kerja PWA offline?')}
        >
          Fitur Offline PWA
        </button>
      </div>

      {/* Bottom Input Field */}
      <form onSubmit={handleSend} className="chat-input-bar">
        <button type="button" className="chat-attach-btn" title="Lampiran">
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          placeholder="Tulis pesan ke asisten..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-text-input"
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!input.trim()}
          title="Kirim Pesan"
        >
          <Send size={16} />
        </button>
      </form>
    </aside>
  )
}
