'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface StatsData {
  range_days: number
  overview: {
    page_views: number
    product_views: number
    vinted_clicks: number
    service_clicks: number
    unique_sessions: number
  }
  byUniverse: Record<string, { page_views: number; product_views: number; vinted_clicks: number; service_clicks: number }>
  topProducts: Array<{
    id: string
    title: string
    universe: string
    category: string
    price: number
    image_url: string | null
    stock: number
    sold_at: string | null
    views: number
    vinted_clicks: number
    service_clicks: number
  }>
  sales: {
    count: number
    revenue: number
    byUniverse: {
      horlogerie: { count: number; revenue: number }
      informatique: { count: number; revenue: number }
    }
    recent: Array<{
      id: string
      title: string
      universe: string
      sold_at: string | null
      sold_price: number | null
      sold_channel: string | null
      image_url: string | null
    }>
  }
  timeline: Array<{ date: string; views: number; clicks: number }>
  recentEvents: Array<{
    id: string
    event_type: string
    universe: string | null
    path: string | null
    product: string | null
    product_id: string | null
    created_at: string
  }>
}

const RANGES = [
  { v: 7, label: '7 jours' },
  { v: 30, label: '30 jours' },
  { v: 90, label: '90 jours' },
  { v: 365, label: '1 an' },
]

const EVENT_LABELS: Record<string, { label: string; color: string }> = {
  view_page: { label: 'Visite page', color: '#60a5fa' },
  view_product: { label: 'Fiche produit', color: '#a78bfa' },
  click_vinted: { label: 'Clic Vinted', color: '#10b981' },
  click_service: { label: 'Clic service', color: '#f59e0b' },
  click_cta: { label: 'Clic CTA', color: '#6b7280' },
}

function fmtEur(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)
  const [err, setErr] = useState<string | null>(null)

  const fetchStats = useCallback(async (d: number) => {
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch(`/api/admin/stats?days=${d}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const json = await res.json()
      setData(json)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats(days)
  }, [days, fetchStats])

  const maxTimeline = useMemo(() => {
    if (!data) return 1
    return Math.max(1, ...data.timeline.map(d => d.views + d.clicks))
  }, [data])

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>📊 Tableau de bord — Statistiques & Ventes</h1>
          <p>Suivi des visites, clics et ventes sur la boutique</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {RANGES.map(r => (
            <button
              key={r.v}
              onClick={() => setDays(r.v)}
              className={`btn ${days === r.v ? 'btn-primary' : 'btn-secondary'}`}
            >
              {r.label}
            </button>
          ))}
          <button className="btn btn-secondary" onClick={() => fetchStats(days)} disabled={loading}>
            {loading ? '⏳' : '🔄'} Actualiser
          </button>
        </div>
      </div>

      {err && <div className="info-box" style={{ background: '#fee', borderColor: '#fcc' }}>{err}</div>}

      {loading && !data ? (
        <div className="loading">Chargement des statistiques...</div>
      ) : !data ? (
        <div className="info-box">Aucune donnée</div>
      ) : (
        <>
          {/* ─── Overview ───────────────────────────────────── */}
          <section style={{ marginTop: 24 }}>
            <h2 style={{ marginBottom: 12 }}>Vue d&apos;ensemble ({data.range_days}j)</h2>
            <div className="stats-grid">
              <StatCard icon="👀" label="Pages vues" value={data.overview.page_views} sub="Landing + univers" />
              <StatCard icon="🛍️" label="Fiches produit" value={data.overview.product_views} sub="Clics depuis catalogue" />
              <StatCard icon="🚀" label="Clics Vinted" value={data.overview.vinted_clicks} sub="Redirections d'achat" />
              <StatCard icon="🔧" label="Clics services" value={data.overview.service_clicks} sub="Devis initiés" />
              <StatCard icon="👥" label="Visiteurs uniques" value={data.overview.unique_sessions} sub="Par session" />
            </div>
          </section>

          {/* ─── Ventes ─────────────────────────────────────── */}
          <section style={{ marginTop: 32 }}>
            <h2 style={{ marginBottom: 12 }}>💰 Suivi des ventes</h2>
            <div className="stats-grid">
              <StatCard icon="🏆" label="Ventes totales" value={data.sales.count} sub={fmtEur(data.sales.revenue)} />
              <StatCard icon="⌚" label="Horlogerie" value={data.sales.byUniverse.horlogerie.count} sub={fmtEur(data.sales.byUniverse.horlogerie.revenue)} />
              <StatCard icon="💻" label="Informatique" value={data.sales.byUniverse.informatique.count} sub={fmtEur(data.sales.byUniverse.informatique.revenue)} />
            </div>

            <div style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 8 }}>Ventes récentes</h3>
              {data.sales.recent.length === 0 ? (
                <div className="info-box">Aucune vente enregistrée. Marquez un produit comme vendu depuis <Link href="/admin/products">Produits</Link>.</div>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Univers</th>
                        <th>Canal</th>
                        <th>Prix</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sales.recent.map(s => (
                        <tr key={s.id}>
                          <td className="product-title">{s.title}</td>
                          <td>
                            <span className={`badge badge-${s.universe}`}>
                              {s.universe === 'horlogerie' ? '⌚' : '💻'} {s.universe}
                            </span>
                          </td>
                          <td>{s.sold_channel ?? '—'}</td>
                          <td className="price">{s.sold_price != null ? fmtEur(Number(s.sold_price)) : '—'}</td>
                          <td>{fmtDate(s.sold_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* ─── Timeline ───────────────────────────────────── */}
          <section style={{ marginTop: 32 }}>
            <h2 style={{ marginBottom: 12 }}>📈 Activité sur {data.range_days} jours</h2>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 160, overflowX: 'auto' }}>
                {data.timeline.map(d => {
                  const totalH = ((d.views + d.clicks) / maxTimeline) * 100
                  const viewsH = (d.views / Math.max(1, d.views + d.clicks)) * totalH
                  const clicksH = totalH - viewsH
                  return (
                    <div
                      key={d.date}
                      title={`${d.date} — ${d.views} vues, ${d.clicks} clics`}
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: 18, minWidth: 18, height: '100%' }}
                    >
                      <div style={{ height: `${clicksH}%`, background: '#10b981', borderRadius: '2px 2px 0 0' }} />
                      <div style={{ height: `${viewsH}%`, background: '#60a5fa' }} />
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: '#6b7280' }}>
                <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#60a5fa', borderRadius: 2, marginRight: 6 }} />Vues</span>
                <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#10b981', borderRadius: 2, marginRight: 6 }} />Clics (Vinted + services)</span>
              </div>
            </div>
          </section>

          {/* ─── Top Produits ────────────────────────────────── */}
          <section style={{ marginTop: 32 }}>
            <h2 style={{ marginBottom: 12 }}>🏆 Top produits consultés</h2>
            {data.topProducts.length === 0 ? (
              <div className="info-box">Aucun produit consulté sur cette période.</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Univers</th>
                      <th>Vues fiche</th>
                      <th>Clics Vinted</th>
                      <th>Clics service</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map(p => (
                      <tr key={p.id}>
                        <td className="product-title">{p.title}</td>
                        <td>
                          <span className={`badge badge-${p.universe}`}>
                            {p.universe === 'horlogerie' ? '⌚' : '💻'} {p.universe}
                          </span>
                        </td>
                        <td>{p.views}</td>
                        <td>{p.vinted_clicks}</td>
                        <td>{p.service_clicks}</td>
                        <td>
                          {p.sold_at ? (
                            <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Vendu</span>
                          ) : p.stock > 0 ? (
                            <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>En stock ({p.stock})</span>
                          ) : (
                            <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Rupture</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ─── Split par univers ───────────────────────────── */}
          <section style={{ marginTop: 32 }}>
            <h2 style={{ marginBottom: 12 }}>Répartition par univers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {(['horlogerie', 'informatique'] as const).map(u => {
                const b = data.byUniverse[u]
                return (
                  <div key={u} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
                    <h3 style={{ margin: 0, marginBottom: 10 }}>
                      {u === 'horlogerie' ? '⌚ Horlogerie' : '💻 Informatique'}
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                      <li>👀 Pages vues : <strong>{b.page_views}</strong></li>
                      <li>🛍️ Fiches produit : <strong>{b.product_views}</strong></li>
                      <li>🚀 Clics Vinted : <strong>{b.vinted_clicks}</strong></li>
                      <li>🔧 Clics service : <strong>{b.service_clicks}</strong></li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ─── Events récents ─────────────────────────────── */}
          <section style={{ marginTop: 32, marginBottom: 32 }}>
            <h2 style={{ marginBottom: 12 }}>🕓 Derniers événements</h2>
            {data.recentEvents.length === 0 ? (
              <div className="info-box">Aucun événement pour le moment.</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Quand</th>
                      <th>Type</th>
                      <th>Univers</th>
                      <th>Produit</th>
                      <th>Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentEvents.map(e => {
                      const label = EVENT_LABELS[e.event_type] ?? { label: e.event_type, color: '#6b7280' }
                      return (
                        <tr key={e.id}>
                          <td>{fmtDate(e.created_at)}</td>
                          <td>
                            <span className="badge" style={{ background: `${label.color}22`, color: label.color }}>
                              {label.label}
                            </span>
                          </td>
                          <td>{e.universe ?? '—'}</td>
                          <td>{e.product ?? '—'}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{e.path ?? '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: number | string; sub?: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{label}</h3>
        <p className="stat-number">{value}</p>
        {sub && <p className="stat-label">{sub}</p>}
      </div>
    </div>
  )
}
