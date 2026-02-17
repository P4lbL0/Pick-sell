'use client'

import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  universe: 'horlogerie' | 'informatique'
  columns?: 1 | 2 | 3 | 4
}

export function ProductGrid({
  products,
  universe,
  columns = 3,
}: ProductGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">Aucun produit disponible</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          universe={universe}
        />
      ))}
    </div>
  )
}
