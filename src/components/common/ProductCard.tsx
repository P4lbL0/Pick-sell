'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { formatPrice } from '@/utils/constants'

interface ProductCardProps {
  product: Product
  universe: 'horlogerie' | 'informatique'
}

export function ProductCard({ product, universe }: ProductCardProps) {
  const imageUrl = product.image_url && product.image_url.trim() ? product.image_url : '/placeholder.jpg'

  return (
    <Link href={`/${universe}/products/${product.id}`}>
      <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            {product.stock > 0 ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Stock: {product.stock}
              </span>
            ) : (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Rupture
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
            {product.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.short_description}
          </p>

          {/* Price and Category */}
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          {/* CTA */}
          <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded-md font-medium hover:bg-gray-800 transition">
            Voir Détails
          </button>
        </div>
      </div>
    </Link>
  )
}
