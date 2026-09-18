import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

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

    const supabase = getSupabaseAdmin()
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
