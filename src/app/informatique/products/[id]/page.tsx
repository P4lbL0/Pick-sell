import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice, CATEGORIES } from '@/utils/constants'
import { getProductColors } from '@/lib/product-helpers'
import { ProductColors } from '@/components/common/ProductColors'
import { TrackPageView } from '@/components/common/TrackPageView'
import { VintedButton } from '@/components/common/VintedButton'
import { ServiceLink } from '@/components/common/ServiceLink'

export const revalidate = 60

async function getProduct(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('universe', 'informatique')
      .single()
    if (error || !data) return null
    return data
  } catch { return null }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  // Fetch product colors
  const colors = await getProductColors(id)

  const imageUrl = product.image_url?.trim() || '/images/placeholder.jpg'
  const categoryLabel = CATEGORIES.informatique.find(c => c.id === product.category)?.label || product.category

  return (
    <main className="min-h-screen bg-white">
      <TrackPageView universe="informatique" productId={id} event="view_product" />
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/informatique" className="hover:text-slate-700 transition">Informatique</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{categoryLabel}</span>
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
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
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

            {/* Product Colors */}
            {colors && colors.length > 0 && <ProductColors productId={id} colors={colors} />}

            {/* Short Description */}
            <div className="mb-8">
              <p className="text-gray-600 text-lg leading-relaxed">{product.short_description}</p>
            </div>

            {/* CTA */}
            <div className="space-y-3 mt-auto">
              {product.stock > 0 && product.vinted_url ? (
                <VintedButton href={product.vinted_url} productId={id} universe="informatique" title={product.title} />
              ) : (
                <button disabled className="w-full py-4 rounded-xl font-bold text-lg bg-gray-200 text-gray-400 cursor-not-allowed">
                  Indisponible
                </button>
              )}

              <ServiceLink
                href="/informatique/services/repair"
                universe="informatique"
                serviceType="repair"
                productId={id}
                className="w-full py-3 px-6 rounded-xl font-semibold text-base transition bg-blue-50 text-blue-800 hover:bg-blue-100 text-center flex items-center justify-center gap-2 border border-blue-200"
              >
                🔧 Besoin d&apos;une réparation ?
              </ServiceLink>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6">
              Des questions ? <a href="/contact" className="text-blue-600 hover:underline font-medium">Contactez-nous</a>
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
          <Link href="/informatique" className="inline-flex items-center gap-2 text-gray-500 hover:text-slate-700 transition font-medium">
            ← Retour à la collection
          </Link>
        </div>
      </div>
    </main>
  )
}
