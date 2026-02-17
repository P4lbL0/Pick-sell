import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('universe', 'horlogerie')
      .single()

    if (error || !product) {
      return null
    }
    return product
  } catch (error) {
    return null
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  const imageUrl = product.image_url || '/placeholder.jpg'

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link href="/horlogerie" className="text-blue-600 hover:text-blue-800 underline">
          ← Retour à la collection
        </Link>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <Image
              src={imageUrl}
              alt={product.title}
              width={500}
              height={500}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* Price & Stock */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-3xl font-bold text-gray-900 mb-3">
                {product.price.toFixed(2)}€
              </p>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
                </span>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Short Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Résumé</h2>
              <p className="text-gray-700 text-lg">{product.short_description}</p>
            </div>

            {/* Features */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Univers</h2>
              <p className="text-gray-700">
                <span className="font-semibold">Catégorie:</span> {product.category}
              </p>
              <p className="text-gray-700 mt-2">
                <span className="font-semibold">Univers:</span> {product.universe === 'horlogerie' ? '⌚ Horlogerie' : '💻 Informatique'}
              </p>
            </div>

            {/* CTA Button */}
            <button 
              className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                product.stock > 0
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
            </button>

            {/* Contact */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Des questions? <a href="/contact" className="text-blue-600 hover:underline">Contactez-nous</a>
            </p>
          </div>
        </div>

        {/* Full Description */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description détaillée</h2>
          <div className="prose max-w-4xl text-lg text-gray-700 leading-relaxed">
            {product.long_description}
          </div>
        </div>
      </div>
    </main>
  )
}
