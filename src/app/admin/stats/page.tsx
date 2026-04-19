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

interface ProductLite {
  id: string | number
  title: string
  price: number
  universe: string
  category: string
  sold_at: string | null
}

const RANGES = [
  { v: 7, label: '7 j' },
  { v: 30, label: '30 j' },
  { v: 90, label: '90 j' },
  { v: 365, label: '1 an' },
]

const EVENT_LABELS: Record<string, { label: string; color: string }> = {
  view_page: { label: 'Visite', color: '#60a5fa' },
  view_product: { label: 'Fiche', color: '#a78bfa' },
  click_vinted: { label: 'Vinted', color: '#10b981' },
  click_service: { label: 'Service', color: '#f59e0b' },
  click_cta: { label: 'CTA', color: '#6b7280' },
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

  // ── Modal "Ajouter une vente" ────────────────────────────
  const [addOpen, setAddOpen] = useState(false)
  const [products, setProducts] = useState<ProductLite[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [soldDate, setSoldDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [soldPrice, setSoldPrice] = useState('')
  const [soldChannel, setSoldChannel] = useState<'vinted' | 'direct' | 'autre'>('vinted')
  const [productFilter, setProductFilter] = useState('')
  const [busy, setBusy] = useState(false)

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

  const openAddSale = async () => {
    setAddOpen(true)
    if (products.length === 0) {
      setProductsLoading(true)
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' })
        const list = await res.json()
        if (Array.isArray(list)) setProducts(list)
      } catch (e) {
        console.error(e)
      } finally {
        setProductsLoading(false)
      }
    }
  }

  const submitSale = async () => {
    if (!selectedId) { alert('Sélectionne un produit'); return }
    setBusy(true)
    try {
      const soldAtIso = soldDate ? new Date(soldDate + 'T12:00:00').toISOString() : undefined
      const res = await fetch('/api/admin/products/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedId,
          sold_price: soldPrice,
          sold_channel: soldChannel,
          sold_at: soldAtIso,
        }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody?.error || `HTTP ${res.status}`)
      }
      setAddOpen(false)
      setSelectedId('')
      setSoldPrice('')
      setProductFilter('')
      fetchStats(days)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue'
      alert('Impossible d\'enregistrer la vente\n\n' + msg)
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  const filteredProducts = useMemo(() => {
    const q = productFilter.trim().toLowerCase()
    if (!q) return products
    return products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }, [products, productFilter])

  const selectedProduct = products.find(p => String(p.id) === String(selectedId))

  useEffect(() => {
    if (selectedProduct && !soldPrice) {
      setSoldPrice(String(selectedProduct.price ?? ''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const maxTimeline = useMemo(() => {
    if (!data) return 1
    return Math.max(1, ...data.timeline.map(d => d.views + d.clicks))
  }, [data])

  return (
    <div className="admin-page stats-page">
      <div className="page-header stats-header">
        <div>
          <h1>📊 Statistiques & Ventes</h1>
          <p>Suivi des visites, clics et ventes</p>
        </div>
        <div className="stats-header-actions">
          <div className="stats-range">
            {RANGES.map(r => (
              <button
                key={r.v}
                onClick={() => setDays(r.v)}
                className={`btn-range ${days === r.v ? 'btn-range-active' : ''}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button className="btn btn-secondary btn-compact" onClick={() => fetchStats(days)} disabled={loading}>
            {loading ? '⏳' : '🔄'}
          </button>
          <button className="btn btn-primary btn-compact" onClick={openAddSale}>
            + Vente
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
          <section className="stats-section">
            <h2>Vue d&apos;ensemble ({data.range_days}j)</h2>
            <div className="stats-grid">
              <StatCard icon="👀" label="Pages vues" value={data.overview.page_views} sub="Landing + univers" />
              <StatCard icon="🛍️" label="Fiches produit" value={data.overview.product_views} sub="Clics catalogue" />
              <StatCard icon="🚀" label="Clics Vinted" value={data.overview.vinted_clicks} sub="Redirections" />
              <StatCard icon="🔧" label="Clics services" value={data.overview.service_clicks} sub="Devis initiés" />
              <StatCard icon="👥" label="Visiteurs" value={data.overview.unique_sessions} sub="Sessions uniques" />
            </div>
          </section>

          {/* ─── Ventes ─────────────────────────────────────── */}
          <section className="stats-section">
            <div className="stats-section-head">
              <h2>💰 Suivi des ventes</h2>
              <button className="btn btn-primary btn-compact" onClick={openAddSale}>
                + Ajouter une vente
              </button>
            </div>
            <div className="stats-grid">
              <StatCard icon="🏆" label="Ventes totales" value={data.sales.count} sub={fmtEur(data.sales.revenue)} />
              <StatCard icon="⌚" label="Horlogerie" value={data.sales.byUniverse.horlogerie.count} sub={fmtEur(data.sales.byUniverse.horlogerie.revenue)} />
              <StatCard icon="💻" label="Informatique" value={data.sales.byUniverse.informatique.count} sub={fmtEur(data.sales.byUniverse.informatique.revenue)} />
            </div>

            <div style={{ marginTop: 16 }}>
              <h3 className="stats-subtitle">Ventes récentes</h3>
              {data.sales.recent.length === 0 ? (
                <div className="info-box">
                  Aucune vente enregistrée. Utilise <strong>+ Ajouter une vente</strong> ci-dessus, ou marque un produit comme vendu depuis <Link href="/admin/products">Produits</Link>.
                </div>
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
          <section className="stats-section">
            <h2>📈 Activité sur {data.range_days} jours</h2>
            <div className="timeline-card">
              <div className="timeline-bars">
                {data.timeline.map(d => {
                  const totalH = ((d.views + d.clicks) / maxTimeline) * 100
                  const viewsH = (d.views / Math.max(1, d.views + d.clicks)) * totalH
                  const clicksH = totalH - viewsH
                  return (
                    <div
                      key={d.date}
                      title={`${d.date} — ${d.views} vues, ${d.clicks} clics`}
                      className="timeline-bar"
                    >
                      <div style={{ height: `${clicksH}%`, background: '#10b981', borderRadius: '2px 2px 0 0' }} />
                      <div style={{ height: `${viewsH}%`, background: '#60a5fa' }} />
                    </div>
                  )
                })}
              </div>
              <div className="timeline-legend">
                <span><span className="timeline-dot" style={{ background: '#60a5fa' }} />Vues</span>
                <span><span className="timeline-dot" style={{ background: '#10b981' }} />Clics</span>
              </div>
            </div>
          </section>

          {/* ─── Top Produits ────────────────────────────────── */}
          <section className="stats-section">
            <h2>🏆 Top produits consultés</h2>
            {data.topProducts.length === 0 ? (
              <div className="info-box">Aucun produit consulté sur cette période.</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Univers</th>
                      <th>Vues</th>
                      <th>Vinted</th>
                      <th>Service</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map(p => (
                      <tr key={p.id}>
                        <td className="product-title">{p.title}</td>
                        <td>
                          <span className={`badge badge-${p.universe}`}>
                            {p.universe === 'horlogerie' ? '⌚' : '💻'}
                          </span>
                        </td>
                        <td>{p.views}</td>
                        <td>{p.vinted_clicks}</td>
                        <td>{p.service_clicks}</td>
                        <td>
                          {p.sold_at ? (
                            <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Vendu</span>
                          ) : p.stock > 0 ? (
                            <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>Stock ({p.stock})</span>
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
          <section className="stats-section">
            <h2>Répartition par univers</h2>
            <div className="universe-grid">
              {(['horlogerie', 'informatique'] as const).map(u => {
                const b = data.byUniverse[u]
                return (
                  <div key={u} className="universe-card">
                    <h3>{u === 'horlogerie' ? '⌚ Horlogerie' : '💻 Informatique'}</h3>
                    <ul>
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
          <section className="stats-section">
            <h2>🕓 Derniers événements</h2>
            {data.recentEvents.length === 0 ? (
              <div className="info-box">Aucun événement.</div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Quand</th>
                      <th>Type</th>
                      <th>Univers</th>
                      <th>Produit</th>
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

      {/* ─── Modal Ajouter une vente ───────────────────────── */}
      {addOpen && (
        <div
          onClick={() => !busy && setAddOpen(false)}
          className="stats-modal-overlay"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="stats-modal"
          >
            <h3>💸 Ajouter une vente</h3>
            <p className="stats-modal-hint">
              Sélectionne un produit en base, choisis la date (même ancienne) et le prix réel de vente.
            </p>

            <label className="stats-modal-label">
              Rechercher un produit
              <input
                type="text"
                value={productFilter}
                onChange={e => setProductFilter(e.target.value)}
                placeholder="Nom ou catégorie..."
                className="stats-modal-input"
              />
            </label>

            <label className="stats-modal-label">
              Produit
              {productsLoading ? (
                <div style={{ padding: 10, color: '#6b7280' }}>Chargement des produits...</div>
              ) : (
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="stats-modal-input"
                  size={Math.min(6, Math.max(3, filteredProducts.length))}
                >
                  <option value="">— Choisir un produit —</option>
                  {filteredProducts.map(p => (
                    <option key={p.id} value={String(p.id)}>
                      {p.universe === 'horlogerie' ? '⌚' : '💻'} {p.title} — {fmtEur(Number(p.price))}
                      {p.sold_at ? ' (déjà vendu)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <div className="stats-modal-row">
              <label className="stats-modal-label">
                Date de vente
                <input
                  type="date"
                  value={soldDate}
                  onChange={e => setSoldDate(e.target.value)}
                  className="stats-modal-input"
                  max={new Date().toISOString().slice(0, 10)}
                />
              </label>

              <label className="stats-modal-label">
                Prix vendu (€)
                <input
                  type="number"
                  step="0.01"
                  value={soldPrice}
                  onChange={e => setSoldPrice(e.target.value)}
                  placeholder={selectedProduct ? String(selectedProduct.price) : 'Prix'}
                  className="stats-modal-input"
                />
              </label>
            </div>

            <label className="stats-modal-label">
              Canal
              <select
                value={soldChannel}
                onChange={e => setSoldChannel(e.target.value as 'vinted' | 'direct' | 'autre')}
                className="stats-modal-input"
              >
                <option value="vinted">Vinted</option>
                <option value="direct">Vente directe</option>
                <option value="autre">Autre</option>
              </select>
            </label>

            <div className="stats-modal-actions">
              <button className="btn btn-secondary" onClick={() => setAddOpen(false)} disabled={busy}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={submitSale} disabled={busy || !selectedId}>
                {busy ? 'Enregistrement...' : 'Enregistrer la vente'}
              </button>
            </div>
          </div>
        </div>
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
