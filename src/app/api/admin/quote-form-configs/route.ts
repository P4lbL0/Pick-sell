import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { universe, service_type, fields } = body

    const { error } = await getSupabaseAdmin()
      .from('quote_form_configs')
      .upsert(
        [{ universe, service_type, fields, updated_at: new Date().toISOString() }],
        { onConflict: 'universe,service_type' }
      )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('[quote-form-configs] PUT error:', message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
