import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase service-role env')
  return createClient(url, key)
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const params = url.searchParams
    const universe = params.get('universe')
    const service_type = params.get('service_type')
    const status = params.get('status')

    const supabase = getSupabase()
    let query = supabase.from('quote_requests').select('*')
    if (universe && universe !== 'all') query = query.eq('universe', universe)
    if (service_type && service_type !== 'all') query = query.eq('service_type', service_type)
    if (status && status !== 'all') query = query.eq('status', status)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err: unknown) {
    console.error('[admin/quote-requests] GET error', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, notes } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const supabase = getSupabase()
    const payload: Record<string, unknown> = {}
    if (status) payload.status = status
    if (typeof notes !== 'undefined') payload.notes = notes
    const { error } = await supabase.from('quote_requests').update(payload).eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[admin/quote-requests] PATCH error', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
