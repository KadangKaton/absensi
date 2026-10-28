import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // Check env vars first — give a clear error if missing
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables.')
    return NextResponse.json(
      { error: 'Konfigurasi server belum lengkap. Hubungi admin.' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nama tidak boleh kosong.' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('attendances')
      .insert([{ name: name.trim() }])

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error))
      return NextResponse.json(
        { error: `Gagal menyimpan data. (${error.code ?? error.message})` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('POST /api/attend unexpected error:', message)
    return NextResponse.json(
      { error: `Terjadi kesalahan: ${message}` },
      { status: 500 }
    )
  }
}

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Konfigurasi server belum lengkap.' },
      { status: 503 }
    )
  }

  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('attendances')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase select error:', JSON.stringify(error))
      return NextResponse.json(
        { error: `Gagal mengambil data. (${error.code ?? error.message})` },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('GET /api/attend unexpected error:', message)
    return NextResponse.json(
      { error: `Terjadi kesalahan: ${message}` },
      { status: 500 }
    )
  }
}
