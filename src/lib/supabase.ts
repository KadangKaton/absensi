import { createClient, SupabaseClient } from '@supabase/supabase-js'

export type Attendance = {
  id: number
  name: string
  created_at: string
}

let _client: SupabaseClient | null = null

/**
 * Returns a Supabase client, creating it lazily on first call.
 * This avoids errors during Next.js build when env vars aren't set.
 */
export function getSupabase(): SupabaseClient {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase environment variables are not set. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }

  _client = createClient(url, key)
  return _client
}

// Also export a direct singleton for convenience (safe at runtime)
export const supabase = {
  from: (table: string) => getSupabase().from(table),
}
