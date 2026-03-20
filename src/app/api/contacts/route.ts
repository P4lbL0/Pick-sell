import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ contacts: [] })

    const supabase = createClient(url, key)
    const { data } = await supabase.from('contacts').select('*').order('platform')
    return NextResponse.json({ contacts: data || [] })
  } catch {
    return NextResponse.json({ contacts: [] })
  }
}
