'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin panel error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md p-8">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-red-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18zm0 0a3 3 0 00-3 3m6 0a3 3 0 00-3-3m6 0a3 3 0 013 3v2m0 0a3 3 0 01-3 3m0 0a3 3 0 01-3-3m6 0a3 3 0 01-3 3"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Oops! Une erreur
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Quelque chose a mal viré dans le panneau d'administration.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-xs font-mono text-gray-500 break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200 text-center block"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  )
}
