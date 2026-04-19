import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_CHANNELS = new Set(['vinted', 'direct', 'autre'])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { id, sold_price, sold_channel, sold_at } = body as {
      id?: string | number
      sold_price?: number | string
      sold_channel?: string
      sold_at?: string
    }

    if (!id) {
      return NextResponse.json({ error: 'id requis' }, { status: 400 })
    }

    const channel = sold_channel && ALLOWED_CHANNELS.has(sold_channel) ? sold_channel : 'vinted'
    const price = sold_price !== undefined && sold_price !== null && sold_price !== ''
      ? Number(sold_price)
      : null

    let soldAtIso = new Date().toISOString()
    if (typeof sold_at === 'string' && sold_at.trim()) {
      const d = new Date(sold_at)
      if (!Number.isNaN(d.getTime())) soldAtIso = d.toISOString()
    }

    const { data, error } = await getSupabaseAdmin()
      .from('products')
      .update({
        sold_at: soldAtIso,
        sold_price: Number.isFinite(price) ? price : null,
        sold_channel: channel,
        stock: 0,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, product: data })
  } catch (error: any) {
    console.error('[products/sell] POST error:', error)
    const msg = error?.message || error?.hint || error?.details || error?.code || 'Erreur serveur'
    return NextResponse.json({ error: msg, raw: error }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

    const { error } = await getSupabaseAdmin()
      .from('products')
      .update({
        sold_at: null,
        sold_price: null,
        sold_channel: null,
      })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[products/sell] DELETE error:', msg)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
