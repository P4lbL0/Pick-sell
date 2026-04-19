import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

type EventType = 'view_page' | 'view_product' | 'click_vinted' | 'click_service' | 'click_cta'
const ALLOWED: EventType[] = ['view_page', 'view_product', 'click_vinted', 'click_service', 'click_cta']
const ALLOWED_UNIVERSE = new Set(['horlogerie', 'informatique', 'global'])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      event_type,
      product_id,
      universe,
      path,
      session_id,
      metadata,
    } = body as {
      event_type?: string
      product_id?: string | null
      universe?: string
      path?: string
      session_id?: string
      metadata?: Record<string, unknown>
    }

    if (!event_type || !ALLOWED.includes(event_type as EventType)) {
      return NextResponse.json({ error: 'event_type invalide' }, { status: 400 })
    }

    const row = {
      event_type,
      product_id: product_id || null,
      universe: universe && ALLOWED_UNIVERSE.has(universe) ? universe : null,
      path: typeof path === 'string' ? path.slice(0, 500) : null,
      referrer: request.headers.get('referer')?.slice(0, 500) || null,
      session_id: typeof session_id === 'string' ? session_id.slice(0, 64) : null,
      user_agent: request.headers.get('user-agent')?.slice(0, 500) || null,
      metadata: metadata && typeof metadata === 'object' ? metadata : null,
    }

    const { error } = await getSupabaseAdmin().from('product_events').insert([row])
    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[track] POST error:', msg)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
