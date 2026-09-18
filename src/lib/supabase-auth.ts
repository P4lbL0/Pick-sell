import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

/**
 * Un compte est admin uniquement si son app_metadata.role vaut 'admin'.
 * app_metadata n'est modifiable qu'avec la clé service (script scripts/create-admin.mjs),
 * donc une inscription publique ne donne jamais accès à l'admin.
 */
export function isAdminUser(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === 'admin'
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Appelé depuis un contexte en lecture seule : le proxy rafraîchit la session.
          }
        },
      },
    }
  )
}

/**
 * À appeler en tête de chaque route /api/admin/* :
 *   const denied = await requireAdmin(); if (denied) return denied
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })
  if (!isAdminUser(user)) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  return null
}
