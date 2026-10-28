'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Attendance } from '@/lib/supabase'

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  const date = d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return { date, time }
}

function exportToCSV(data: Attendance[]) {
  const BOM = '\uFEFF'
  const header = ['No', 'Nama', 'Tanggal', 'Waktu']
  const rows = data.map((row, i) => {
    const d = new Date(row.created_at)
    const date = d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const time = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const safeName = `"${row.name.replace(/"/g, '""')}"`
    return [i + 1, safeName, `"${date}"`, `"${time}"`].join(',')
  })

  const csvContent = BOM + [header.join(','), ...rows].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const today = new Date().toISOString().slice(0, 10)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `daftar-hadir-nana-bouquet-${today}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AdminPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [exporting, setExporting] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/attend')
      if (!res.ok) throw new Error('Gagal mengambil data dari server.')
      const json = await res.json()
      setAttendances(json.data || [])
      setLastRefresh(new Date())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      exportToCSV(filtered)
      setExporting(false)
    }, 300)
  }

  const filtered = attendances.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 80% 10%, rgba(249,232,238,0.9) 0%, rgba(253,246,249,0.85) 40%, rgba(255,255,255,0.95) 100%)',
        }}
      />
      <div
        className="fixed -z-10 rounded-full blur-3xl opacity-30"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, #f4c2d4 0%, transparent 70%)',
          top: '-15%',
          left: '-10%',
        }}
      />

      <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">🌸</span>
              <h1 className="font-serif-elegant text-3xl sm:text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #c4627e 0%, #d4547a 60%, #e8a0bc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Nana Bouquet
              </h1>
            </div>
            <p className="text-[#9b6b82] text-sm ml-12">Dashboard Admin · Daftar Hadir</p>
          </div>

          {/* Stats card + actions */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Stats */}
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#d4547a] font-serif-elegant">
                    {loading ? '—' : attendances.length}
                  </div>
                  <div className="text-xs text-[#9b6b82] mt-0.5">Total Tamu</div>
                </div>
                <div className="w-px h-10 bg-pink-200" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#d4547a] font-serif-elegant">
                    {loading ? '—' : filtered.length}
                  </div>
                  <div className="text-xs text-[#9b6b82] mt-0.5">Ditampilkan</div>
                </div>
                {lastRefresh && (
                  <>
                    <div className="w-px h-10 bg-pink-200 hidden sm:block" />
                    <div className="hidden sm:block text-center">
                      <div className="text-xs font-medium text-[#9b6b82]">
                        {lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-[#c49aad] mt-0.5">Diperbarui</div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-pink-200 bg-white/70 text-[#d4547a] text-sm font-medium hover:bg-pink-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <svg 
                    className={`flex-shrink-0 ${loading ? 'animate-spin' : ''}`} 
                    style={{ width: '16px', height: '16px' }} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  disabled={loading || filtered.length === 0 || exporting}
                  className="btn-floral flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer"
                >
                  {exporting ? (
                    <>
                      <svg className="animate-spin flex-shrink-0" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Mengekspor...</span>
                    </>
                  ) : (
                    <>
                      <svg className="flex-shrink-0" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download CSV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="glass-card rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
            <svg className="text-[#c49aad] flex-shrink-0" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama tamu..."
              className="flex-1 bg-transparent text-sm text-[#3d2535] placeholder-[#c49aad] outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#c49aad] hover:text-[#d4547a] transition-colors flex items-center cursor-pointer">
                <svg className="flex-shrink-0" style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="glass-card rounded-3xl overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 rounded-full border-3 border-pink-200 border-t-pink-400 animate-spin" style={{ borderWidth: 3 }} />
                <p className="text-sm text-[#9b6b82]">Memuat data...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="text-4xl">😥</span>
                <p className="text-sm text-[#9b6b82] text-center">{error}</p>
                <button onClick={fetchData} className="text-sm text-[#d4547a] hover:underline font-medium cursor-pointer">Coba lagi</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <span className="text-4xl">🌷</span>
                <p className="text-sm text-[#9b6b82] mt-1">
                  {search ? 'Tidak ada nama yang cocok.' : 'Belum ada tamu yang hadir.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-pink-100">
                      <th className="text-left text-xs font-semibold text-[#9b6b82] uppercase tracking-wider px-6 py-4 w-14">
                        No
                      </th>
                      <th className="text-left text-xs font-semibold text-[#9b6b82] uppercase tracking-wider px-4 py-4">
                        Nama
                      </th>
                      <th className="text-left text-xs font-semibold text-[#9b6b82] uppercase tracking-wider px-4 py-4 hidden sm:table-cell">
                        Tanggal
                      </th>
                      <th className="text-left text-xs font-semibold text-[#9b6b82] uppercase tracking-wider px-4 py-4 pr-6">
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, idx) => {
                      const { date, time } = formatDate(row.created_at)
                      return (
                        <tr
                          key={row.id}
                          className="border-b border-pink-50 last:border-0 hover:bg-pink-50/40 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-[#c49aad] font-medium tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {/* Avatar diganti ikon bunga agar bersih dari huruf ganda */}
                              <div
                                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm select-none"
                                style={{
                                  background: `linear-gradient(135deg, #f9e8ee, #f4c2d4)`,
                                }}
                              >
                                🌸
                              </div>
                              <span className="text-sm font-medium text-[#3d2535]">
                                {row.name}
                              </span>
                            </div>
                            <p className="text-xs text-[#c49aad] mt-1 sm:hidden ml-11">{date}</p>
                          </td>
                          <td className="px-4 py-4 text-sm text-[#6b3a52] hidden sm:table-cell">
                            {date}
                          </td>
                          <td className="px-4 py-4 pr-6">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100/80 text-[#d4547a]">
                              {time}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center mt-6 text-xs text-[#c49aad]">
            Nana Bouquet Admin &copy; 2024
          </p>
        </div>
      </main>
    </>
  )
}