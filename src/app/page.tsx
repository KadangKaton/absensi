'use client'

import { useState, useRef, useEffect } from 'react'
import { Playfair_Display } from 'next/font/google';

const elegantFont = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '600', '700']
});

function Toast({
  message,
  visible,
  onDone,
}: {
  message: string
  visible: boolean
  onDone: () => void
}) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!visible) return
    setExiting(false)
    const exitTimer = setTimeout(() => setExiting(true), 3000)
    const doneTimer = setTimeout(() => onDone(), 3400)
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [visible, onDone])

  if (!visible) return null

  return (
    <div
      className={`fixed top-6 right-4 sm:right-6 z-50 max-w-xs w-full ${
        exiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3 shadow-xl">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 flex items-center justify-center text-white text-lg shadow-md">
          🌸
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#3d2535] leading-snug">
            Terima kasih!
          </p>
          <p className="text-xs text-[#9b6b82] mt-0.5 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

const petals = [
  { emoji: '🌸', style: { top: '8%', left: '5%', animationDelay: '0s', animationDuration: '5s', opacity: 0.55, fontSize: '1.6rem' } },
  { emoji: '🌺', style: { top: '15%', right: '8%', animationDelay: '1.2s', animationDuration: '4.5s', opacity: 0.45, fontSize: '1.2rem' } },
  { emoji: '🌷', style: { bottom: '20%', left: '3%', animationDelay: '0.8s', animationDuration: '6s', opacity: 0.5, fontSize: '1.4rem' } },
  { emoji: '🌸', style: { bottom: '10%', right: '5%', animationDelay: '2s', animationDuration: '5.5s', opacity: 0.4, fontSize: '1.8rem' } },
  { emoji: '✿', style: { top: '45%', left: '1%', animationDelay: '1.5s', animationDuration: '4s', opacity: 0.35, fontSize: '1.1rem', color: '#d4547a' } },
  { emoji: '🌸', style: { top: '70%', right: '2%', animationDelay: '0.3s', animationDuration: '5.2s', opacity: 0.45, fontSize: '1.3rem' } },
]

export default function GuestbookPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || loading) return

    setLoading(true)
    try {
      const res = await fetch('/api/attend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })

      const json = await res.json()

      if (res.ok) {
        setName('')
        setToastMessage(`Sudah mampir di Nana Bouquet! ✨`)
        setToastVisible(true)
        inputRef.current?.focus()
      } else {
        alert(json.error ?? `Gagal menyimpan (HTTP ${res.status}). Coba lagi.`)
      }
    } catch (err) {
      alert(`Tidak dapat terhubung ke server.\n\n${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 20% 10%, rgba(249,232,238,0.95) 0%, rgba(253,246,249,0.8) 40%, rgba(255,255,255,0.9) 100%)',
        }}
      />
      <div
        className="fixed -z-10 rounded-full blur-3xl opacity-40"
        style={{
          width: 420,
          height: 420,
          background: 'radial-gradient(circle, #f4c2d4 0%, transparent 70%)',
          top: '-10%',
          right: '-8%',
        }}
      />
      <div
        className="fixed -z-10 rounded-full blur-3xl opacity-30"
        style={{
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, #e8a0bc 0%, transparent 70%)',
          bottom: '-8%',
          left: '-6%',
        }}
      />

      {petals.map((p, i) => (
        <div
          key={i}
          className="fixed pointer-events-none select-none animate-float"
          style={{ ...p.style, zIndex: 0 }}
        >
          {p.emoji}
        </div>
      ))}

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onDone={() => setToastVisible(false)}
      />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md lg:max-w-5xl mx-auto animate-fade-in-up">

          <div className="text-center mb-10 lg:mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 lg:w-32 lg:h-32 rounded-full mb-5 lg:mb-8 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #f9e8ee 0%, #f4c2d4 50%, #e8a0bc 100%)',
                boxShadow: '0 8px 32px rgba(212, 84, 122, 0.25), inset 0 1px 0 rgba(255,255,255,0.7)',
              }}
            >
              <span className="text-4xl lg:text-7xl">🌸</span>
            </div>

            <h1
              className="font-serif-elegant text-5xl sm:text-6xl lg:text-8xl font-bold leading-none tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #c4627e 0%, #d4547a 50%, #e8a0bc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Nana Bouquet
            </h1>

            <p className="mt-3 lg:mt-6 text-[#9b6b82] text-base lg:text-3xl font-light tracking-wide">
              ✦ &nbsp;Bouquet of Happiness&nbsp; ✦
            </p>
          </div>

          <div className="glass-card rounded-3xl p-7 sm:p-9 lg:p-16">
            <div className="text-center mb-7 lg:mb-12">
              <h2
                className="font-serif-elegant text-xl lg:text-4xl font-semibold text-[#3d2535]"
              >
                Daftar Hadir
              </h2>
              <p className="mt-2 lg:mt-4 text-sm lg:text-2xl text-[#9b6b82] leading-relaxed">
                Hai! Senang sekali Kamu mampir 💕<br />
                Tulis nama kamu dan tekan <span className="font-medium text-[#d4547a]">Hadir</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-12">
              <div className="relative">
                <input
                 ref={inputRef}
                 type="text"
                 value={name}
                 onChange={e => setName(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Ketik nama kamu..."
                 maxLength={150}
                 autoFocus
                 disabled={loading}
                 className={`${elegantFont.className} w-full text-center text-pink-800 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 shadow-none transition-all placeholder:text-pink-200 placeholder:font-light`}
                 style={{
                   fontSize: '4.5rem', // Ukuran font raksasa yang langsung tembus tanpa tergantung Tailwind
                   lineHeight: '1.2',
                   paddingTop: '2.5rem',
                   paddingBottom: '2.5rem',
                 }}
                />
                <span className="absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 text-[#d4547a] opacity-50 pointer-events-none text-lg lg:text-5xl">
                  🌷
                </span>
              </div>

              <button
                type="submit"
                disabled={!name.trim() || loading}
                className="btn-floral w-full rounded-2xl py-4 lg:py-8 text-white font-semibold text-base lg:text-3xl tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2 lg:gap-4">
                    <svg className="animate-spin w-4 h-4 lg:w-8 lg:h-8" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menyimpan...
                  </span>
                ) : (
                  '🌸  Hadir'
                )}
              </button>
            </form>

            <p className="mt-5 lg:mt-10 text-center text-xs lg:text-xl text-[#c49aad]">
              Tekan Enter atau klik tombol untuk konfirmasi kehadiran
            </p>
          </div>

          <p className="text-center mt-8 lg:mt-16 text-xs lg:text-xl text-[#c49aad] tracking-wider">
            Nana Bouquet &copy; 2026 &nbsp;·&nbsp; Made with Love🌸
          </p>
        </div>
      </main>
    </>
  )
}