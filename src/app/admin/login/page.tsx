'use client'

import React, { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = getSupabaseBrowser()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }
    if (data.user?.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut()
      setError("Ce compte n'a pas accès à l'administration.")
      setLoading(false)
      return
    }

    const next = searchParams.get('next')
    router.replace(next && next.startsWith('/admin') ? next : '/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-login-brand">
        <h1>PICK SELL</h1>
        <p>Administration</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary admin-login-submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="form-container admin-login-card">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
