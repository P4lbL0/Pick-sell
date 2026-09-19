import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { CATALOGUE_DEMO } from '@/lib/configurateur/catalogue'
import { codeValide, decoder, formaterPrix, prix, recapitulatifTexte } from '@/lib/configurateur/regles'

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

    let data: Record<string, unknown> = rest
    if (rest.source === 'configurateur') {
      // Configurateur 3D : prix et récapitulatif recalculés ici à partir du code de la montre
      if (universe !== 'horlogerie' || service_type !== 'custom' || !codeValide(rest.configuration)) {
        return NextResponse.json({ error: 'Configuration invalide' }, { status: 400 })
      }
      const config = decoder(rest.configuration)
      const texte = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
      data = {
        source: 'configurateur',
        configuration: rest.configuration,
        recapitulatif: recapitulatifTexte(config),
        prix_indicatif: formaterPrix(prix(config)) + (CATALOGUE_DEMO ? " (prix d'exemple, démo)" : ''),
        tour_de_poignet: texte(rest.tour_de_poignet, 20),
        message: texte(rest.message, 2000),
      }
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('quote_requests').insert([{
      universe,
      service_type,
      name: name.trim().slice(0, 200),
      email: email.trim().toLowerCase().slice(0, 200),
      phone: phone?.trim().slice(0, 50) || null,
      data,
    }])

    if (error) throw error
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    console.error('[quote-requests] POST error:', message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
