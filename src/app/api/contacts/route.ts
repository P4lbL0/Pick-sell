import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('platform')
    if (error) throw error
    return NextResponse.json({ contacts: data || [] })
  } catch {
    return NextResponse.json({ contacts: [] })
  }
}
