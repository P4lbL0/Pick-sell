'use client'

import { ProductColor } from '@/lib/types'
import { useState } from 'react'
import Image from 'next/image'

interface ProductColorsProps {
  productId: string
  colors: ProductColor[]
}

export function ProductColors({ productId, colors }: ProductColorsProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    colors.length > 0 ? colors[0].id : null
  )

  if (!colors || colors.length === 0) {
    return null
  }

  const selectedColor = colors.find(c => c.id === selectedColorId)

  return (
    <section className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Variantes Coloris</h3>

      {/* Color Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {colors.map(color => (
          <button
            key={color.id}
            onClick={() => setSelectedColorId(color.id)}
            className={`text-center p-3 rounded-lg transition ${
              selectedColorId === color.id
                ? 'ring-2 ring-offset-2 ring-blue-500'
                : 'hover:bg-gray-200'
            }`}
          >
            {/* Color Preview Square */}
            <div
              className="w-16 h-16 mx-auto rounded-lg border-2 border-gray-300 mb-2"
              style={{ backgroundColor: color.hex_color }}
              title={color.hex_color}
            />
            <p className="text-sm font-medium truncate">{color.name}</p>
            <p className="text-xs text-gray-600">
              Stock: {color.stock > 0 ? color.stock : 'Rupture'}
            </p>
          </button>
        ))}
      </div>

      {/* Selected Color Details */}
      {selectedColor && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Couleur sélectionnée :</strong> {selectedColor.name}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Stock disponible :</strong>{' '}
            {selectedColor.stock > 0 ? (
              <span className="text-green-600 font-semibold">
                {selectedColor.stock} unité(s)
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Rupture de stock</span>
            )}
          </p>

          {selectedColor.image_url && (
            <div className="relative w-full h-64 mt-4 rounded-lg overflow-hidden">
              <Image
                src={selectedColor.image_url}
                alt={selectedColor.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
