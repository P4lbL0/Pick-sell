import { createBrowserClient } from '@supabase/ssr'

/** Client navigateur qui stocke la session dans des cookies (lus par le proxy et les routes API). */
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
