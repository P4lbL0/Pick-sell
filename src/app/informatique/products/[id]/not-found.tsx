import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Produit non trouvé
        </h2>
        <p className="text-gray-600 mb-8">
          Désolé, le produit que vous recherchez n'existe pas ou a été supprimé.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Retour à l'accueil
          </Link>
          <p className="text-sm text-gray-500">
            Besoin d'aide?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
