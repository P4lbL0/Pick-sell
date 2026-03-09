import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { universe, service_type, fields } = body

    const { error } = await getSupabase()
      .from('quote_form_configs')
      .upsert(
        [{ universe, service_type, fields, updated_at: new Date().toISOString() }],
        { onConflict: 'universe,service_type' }
      )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
