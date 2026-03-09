import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Use service_role key if available (bypasses RLS cleanly), fallback to anon key
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key)
}

const UNIVERSES = ['horlogerie', 'informatique'] as const
const SERVICE_TYPES = ['repair', 'custom', 'buyback'] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { universe, service_type, name, email, phone, ...rest } = body

    // Server-side validation
    if (!universe || !SERVICE_TYPES.includes(service_type) || !UNIVERSES.includes(universe)) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Nom et email requis' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { error } = await supabase.from('quote_requests').insert([{
      universe,
      service_type,
      name: name.trim().slice(0, 200),
      email: email.trim().toLowerCase().slice(0, 200),
      phone: phone?.trim().slice(0, 50) || null,
      data: rest,
    }])

    if (error) throw error
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    console.error('[quote-requests] POST error:', message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
