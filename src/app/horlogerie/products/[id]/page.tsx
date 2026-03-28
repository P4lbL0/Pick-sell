import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/utils/constants'
import { CATEGORIES } from '@/utils/constants'

export const revalidate = 60

async function getProduct(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('universe', 'horlogerie')
      .single()
    if (error || !data) return null
    return data
  } catch { return null }
}

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.horlogerie.map(c => [c.id, c.label])
)

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const imageUrl = product.image_url?.trim() || '/placeholder.svg'
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/horlogerie" className="hover:text-amber-700 transition">Horlogerie</Link>
            <span>/</span>
            <span className="text-amber-700 font-medium">{categoryLabel}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                priority
                unoptimized={imageUrl.endsWith('.svg')}
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                  <span className="bg-white text-gray-900 font-bold px-6 py-3 rounded-xl text-lg">Rupture de stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                {categoryLabel}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{product.title}</h1>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <p className="text-4xl font-black text-gray-900">{formatPrice(product.price)}</p>
            </div>

            {/* Short Description */}
            <div className="mb-8">
              <p className="text-gray-600 text-lg leading-relaxed">{product.short_description}</p>
            </div>

            {/* CTA */}
            <div className="space-y-3 mt-auto">
              {product.stock > 0 && product.vinted_url ? (
                <a
                  href={product.vinted_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl font-bold text-lg transition bg-teal-600 text-white hover:bg-teal-500 text-center flex items-center justify-center gap-3 shadow-lg shadow-teal-900/20"
                >
                  <span>Acheter</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <button disabled className="w-full py-4 rounded-xl font-bold text-lg bg-gray-200 text-gray-400 cursor-not-allowed">
                  Indisponible
                </button>
              )}

              <Link href="/horlogerie/services/repair" className="w-full py-3 px-6 rounded-xl font-semibold text-base transition bg-amber-50 text-amber-800 hover:bg-amber-100 text-center flex items-center justify-center gap-2 border border-amber-200">
                🔧 Besoin d'une réparation ?
              </Link>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6">
              Des questions ? <a href="/contact" className="text-amber-600 hover:underline font-medium">Contactez-nous</a>
            </p>
          </div>
        </div>

        {/* Full Description */}
        {product.long_description && (
          <div className="mt-16 pt-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description détaillée</h2>
            <div
              className="prose prose-gray max-w-4xl text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />
          </div>
        )}

        {/* Back */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/horlogerie" className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-700 transition font-medium">
            ← Retour à la collection
          </Link>
        </div>
      </div>
    </main>
  )
}
