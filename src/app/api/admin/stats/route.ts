import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

interface EventRow {
  id: string
  event_type: string
  product_id: string | null
  universe: string | null
  path: string | null
  session_id: string | null
  created_at: string
  metadata: Record<string, unknown> | null
}

interface ProductRow {
  id: string
  title: string
  price: number
  universe: string
  category: string
  image_url: string | null
  stock: number
  vinted_url: string | null
  sold_at: string | null
  sold_price: number | null
  sold_channel: string | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(365, Math.max(1, Number(searchParams.get('days')) || 30))
    const since = new Date(Date.now() - days * 86400_000).toISOString()

    const admin = getSupabaseAdmin()

    const [eventsRes, productsRes] = await Promise.all([
      admin
        .from('product_events')
        .select('id,event_type,product_id,universe,path,session_id,created_at,metadata')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5000),
      admin
        .from('products')
        .select('id,title,price,universe,category,image_url,stock,vinted_url,sold_at,sold_price,sold_channel')
        .order('created_at', { ascending: false }),
    ])

    if (eventsRes.error) throw eventsRes.error
    if (productsRes.error) throw productsRes.error

    const events = (eventsRes.data ?? []) as EventRow[]
    const products = (productsRes.data ?? []) as ProductRow[]

    // ── Overview totaux ──────────────────────────────────────
    const overview = {
      page_views: 0,
      product_views: 0,
      vinted_clicks: 0,
      service_clicks: 0,
      unique_sessions: 0,
    }
    const sessions = new Set<string>()
    for (const e of events) {
      if (e.session_id) sessions.add(e.session_id)
      if (e.event_type === 'view_page') overview.page_views++
      else if (e.event_type === 'view_product') overview.product_views++
      else if (e.event_type === 'click_vinted') overview.vinted_clicks++
      else if (e.event_type === 'click_service') overview.service_clicks++
    }
    overview.unique_sessions = sessions.size

    // ── Split par univers ────────────────────────────────────
    const mkUniv = () => ({ page_views: 0, product_views: 0, vinted_clicks: 0, service_clicks: 0 })
    const byUniverse: Record<string, ReturnType<typeof mkUniv>> = {
      horlogerie: mkUniv(),
      informatique: mkUniv(),
      global: mkUniv(),
    }
    for (const e of events) {
      const bucket = byUniverse[e.universe ?? 'global'] ?? byUniverse.global
      if (e.event_type === 'view_page') bucket.page_views++
      else if (e.event_type === 'view_product') bucket.product_views++
      else if (e.event_type === 'click_vinted') bucket.vinted_clicks++
      else if (e.event_type === 'click_service') bucket.service_clicks++
    }

    // ── Top produits ─────────────────────────────────────────
    const productStats = new Map<string, { views: number; vinted: number; services: number }>()
    for (const e of events) {
      if (!e.product_id) continue
      const s = productStats.get(e.product_id) ?? { views: 0, vinted: 0, services: 0 }
      if (e.event_type === 'view_product') s.views++
      else if (e.event_type === 'click_vinted') s.vinted++
      else if (e.event_type === 'click_service') s.services++
      productStats.set(e.product_id, s)
    }
    const productMap = new Map(products.map(p => [p.id, p]))
    const topProducts = [...productStats.entries()]
      .map(([id, s]) => {
        const p = productMap.get(id)
        return p
          ? {
              id,
              title: p.title,
              universe: p.universe,
              category: p.category,
              price: p.price,
              image_url: p.image_url,
              stock: p.stock,
              sold_at: p.sold_at,
              views: s.views,
              vinted_clicks: s.vinted,
              service_clicks: s.services,
            }
          : null
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.views + b.vinted_clicks * 3 - (a.views + a.vinted_clicks * 3))
      .slice(0, 20)

    // ── Ventes ───────────────────────────────────────────────
    const soldProducts = products.filter(p => p.sold_at !== null)
    const sales = {
      count: soldProducts.length,
      revenue: soldProducts.reduce((sum, p) => sum + Number(p.sold_price ?? p.price ?? 0), 0),
      byUniverse: {
        horlogerie: {
          count: soldProducts.filter(p => p.universe === 'horlogerie').length,
          revenue: soldProducts
            .filter(p => p.universe === 'horlogerie')
            .reduce((s, p) => s + Number(p.sold_price ?? p.price ?? 0), 0),
        },
        informatique: {
          count: soldProducts.filter(p => p.universe === 'informatique').length,
          revenue: soldProducts
            .filter(p => p.universe === 'informatique')
            .reduce((s, p) => s + Number(p.sold_price ?? p.price ?? 0), 0),
        },
      },
      recent: soldProducts
        .sort((a, b) => (b.sold_at ?? '').localeCompare(a.sold_at ?? ''))
        .slice(0, 15)
        .map(p => ({
          id: p.id,
          title: p.title,
          universe: p.universe,
          sold_at: p.sold_at,
          sold_price: p.sold_price ?? p.price,
          sold_channel: p.sold_channel,
          image_url: p.image_url,
        })),
    }

    // ── Timeline (par jour) ──────────────────────────────────
    const dayKey = (d: string) => d.slice(0, 10)
    const timelineMap = new Map<string, { views: number; clicks: number }>()
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10)
      timelineMap.set(d, { views: 0, clicks: 0 })
    }
    for (const e of events) {
      const k = dayKey(e.created_at)
      const row = timelineMap.get(k)
      if (!row) continue
      if (e.event_type === 'view_page' || e.event_type === 'view_product') row.views++
      else if (e.event_type === 'click_vinted' || e.event_type === 'click_service') row.clicks++
    }
    const timeline = [...timelineMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v }))

    // ── Événements récents ───────────────────────────────────
    const recentEvents = events.slice(0, 50).map(e => ({
      id: e.id,
      event_type: e.event_type,
      universe: e.universe,
      path: e.path,
      product: e.product_id ? productMap.get(e.product_id)?.title ?? null : null,
      product_id: e.product_id,
      created_at: e.created_at,
    }))

    return NextResponse.json({
      range_days: days,
      overview,
      byUniverse,
      topProducts,
      sales,
      timeline,
      recentEvents,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[admin/stats] GET error:', msg)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
