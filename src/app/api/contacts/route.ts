import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('platform')
    if (error) throw error
    return NextResponse.json({ contacts: data || [] })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[contacts GET] error:', msg)
    return NextResponse.json({ contacts: [] })
  }
}
