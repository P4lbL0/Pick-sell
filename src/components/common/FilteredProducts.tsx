'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

const LABELS: Record<string, string> = {
  'seiko-mod': 'Seiko MOD',
  'diverse': 'Montres Diverses',
  'accessories': 'Accessoires Horlogerie',
  'computer': 'Ordinateurs',
  'computer-accessories': 'Accessoires Informatique',
}

interface FilteredProductsProps {
  products: Product[]
  universe: 'horlogerie' | 'informatique'
}

const PAGE_SIZE = 6

export function FilteredProducts({ products, universe }: FilteredProductsProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category))].filter(Boolean),
    [products]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return products.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.short_description || '').toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [products, activeCategory, search])

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE)
  const hasMore = !showAll && filtered.length > PAGE_SIZE

  const isHorl = universe === 'horlogerie'
  const activeTabClass = isHorl
    ? 'bg-amber-600 text-white border-transparent'
    : 'bg-blue-600 text-white border-transparent'
  const inactiveTabClass = isHorl
    ? 'bg-white text-gray-600 border-gray-200 hover:bg-amber-50 hover:text-amber-700'
    : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-700'
  const ringClass = isHorl ? 'focus:ring-amber-400' : 'focus:ring-blue-400'
  const btnClass = isHorl
    ? 'border-amber-500 text-amber-700 hover:bg-amber-50'
    : 'border-blue-500 text-blue-700 hover:bg-blue-50'

  return (
    <div>
      {/* Barre de recherche */}
      <div className="mb-5">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setShowAll(false)
            }}
            placeholder="Rechercher un produit..."
            className={`w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 ${ringClass} bg-white text-gray-900 shadow-sm text-base`}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Onglets par collection */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => { setActiveCategory('all'); setShowAll(false) }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition border ${
              activeCategory === 'all' ? activeTabClass : inactiveTabClass
            }`}
          >
            Tous ({products.length})
          </button>
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowAll(false) }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition border ${
                  activeCategory === cat ? activeTabClass : inactiveTabClass
                }`}
              >
                {LABELS[cat] || cat} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Compteur résultats */}
      {(search || activeCategory !== 'all') && (
        <p className="text-sm text-gray-500 mb-4">
          {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' && ` dans "${LABELS[activeCategory] || activeCategory}"`}
          {search && ` pour "${search}"`}
        </p>
      )}

      {/* Grille */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all') }}
            className="mt-3 text-sm text-gray-400 underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map(p => (
              <ProductCard key={p.id} product={p} universe={universe} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className={`px-8 py-3.5 bg-white border-2 font-bold rounded-xl transition shadow-sm text-base ${btnClass}`}
              >
                Voir tout — {filtered.length} articles
              </button>
            </div>
          )}

          {showAll && filtered.length > PAGE_SIZE && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition"
              >
                ↑ Réduire
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
