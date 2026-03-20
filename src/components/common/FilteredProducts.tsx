'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

const SECTIONS = {
  horlogerie: [
    { id: 'seiko-mod',    label: 'Seiko MOD',           emoji: '⌚', desc: 'Modifications exclusives de montres Seiko — chaque pièce est unique',    badge: 'Collection phare', accent: 'text-amber-600' },
    { id: 'diverse',      label: 'Montres Diverses',     emoji: '🕰️', desc: 'Montres vintage et reconditionnées sélectionnées avec soin',            badge: 'Collection',       accent: 'text-gray-600'  },
    { id: 'accessories',  label: 'Accessoires Horlogers', emoji: '🧰', desc: 'Bracelets, outils et accessoires pour passionnés',                      badge: 'Accessoires',      accent: 'text-gray-500'  },
  ],
  informatique: [
    { id: 'computer',            label: 'Ordinateurs',             emoji: '💻', desc: 'Portables et tours reconditionnés, tous testés et garantis', badge: 'Collection',  accent: 'text-blue-600' },
    { id: 'computer-accessories', label: 'Accessoires Informatique', emoji: '🖱️', desc: 'Claviers, souris, câbles et périphériques',                badge: 'Accessoires', accent: 'text-gray-600' },
  ],
}

const PAGE_SIZE = 3

function SectionProducts({
  products,
  universe,
  isSearching,
}: {
  products: Product[]
  universe: 'horlogerie' | 'informatique'
  isSearching: boolean
}) {
  const [showAll, setShowAll] = useState(false)
  const visible = isSearching || showAll ? products : products.slice(0, PAGE_SIZE)
  const remaining = products.length - PAGE_SIZE
  const isHorl = universe === 'horlogerie'

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map(p => (
          <ProductCard key={p.id} product={p} universe={universe} />
        ))}
      </div>

      {!isSearching && !showAll && remaining > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className={`px-6 py-2.5 bg-white border-2 font-semibold rounded-xl transition shadow-sm text-sm ${
              isHorl
                ? 'border-amber-500 text-amber-700 hover:bg-amber-50'
                : 'border-blue-500 text-blue-700 hover:bg-blue-50'
            }`}
          >
            Voir plus ({remaining} autre{remaining > 1 ? 's' : ''})
          </button>
        </div>
      )}

      {!isSearching && showAll && products.length > PAGE_SIZE && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            ↑ Réduire
          </button>
        </div>
      )}
    </div>
  )
}

interface FilteredProductsProps {
  products: Product[]
  universe: 'horlogerie' | 'informatique'
}

export function FilteredProducts({ products, universe }: FilteredProductsProps) {
  const [search, setSearch] = useState('')
  const sections = SECTIONS[universe]
  const isSearching = search.trim().length > 0
  const isHorl = universe === 'horlogerie'
  const ringClass = isHorl ? 'focus:ring-amber-400' : 'focus:ring-blue-400'

  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim()
    return sections
      .map(s => ({
        ...s,
        items: products.filter(p => {
          const matchCat = p.category === s.id
          const matchSearch =
            !q ||
            p.title.toLowerCase().includes(q) ||
            (p.short_description || '').toLowerCase().includes(q)
          return matchCat && matchSearch
        }),
      }))
      .filter(s => s.items.length > 0)
  }, [products, search, sections])

  const totalFiltered = filteredSections.reduce((n, s) => n + s.items.length, 0)

  return (
    <div>
      {/* Recherche globale */}
      <div className="mb-12">
        <div className="relative max-w-lg">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Recherche dans tous les produits..."
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
        {isSearching && (
          <p className="text-sm text-gray-500 mt-2">
            {totalFiltered} résultat{totalFiltered !== 1 ? 's' : ''} pour &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {/* Sections */}
      {filteredSections.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 font-medium">
            Aucun produit trouvé pour &ldquo;{search}&rdquo;
          </p>
          <button
            onClick={() => setSearch('')}
            className="mt-3 text-sm text-gray-400 underline"
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className="space-y-20">
          {filteredSections.map(section => (
            <div key={section.id}>
              <div className="mb-8">
                <p className={`text-sm font-semibold uppercase tracking-widest mb-1 ${section.accent}`}>
                  {section.badge}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                  {section.emoji} {section.label}
                </h3>
                {!isSearching && (
                  <p className="text-gray-500 mt-1 text-sm max-w-lg">{section.desc}</p>
                )}
              </div>
              <SectionProducts
                products={section.items}
                universe={universe}
                isSearching={isSearching}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
