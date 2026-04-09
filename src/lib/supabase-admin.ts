import { createClient } from '@supabase/supabase-js'

/**
 * Get Supabase client with admin (service role) credentials
 * Used for server-side API routes that need elevated permissions
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase admin credentials. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in environment variables.'
    )
  }

  return createClient(url, key)
}
