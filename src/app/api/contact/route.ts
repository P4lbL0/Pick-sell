import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Nom, email et message sont requis' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { error } = await supabase.from('contact_messages').insert([{
      name: name.trim().slice(0, 200),
      email: email.trim().toLowerCase().slice(0, 200),
      subject: subject?.trim().slice(0, 200) || null,
      message: message.trim().slice(0, 5000),
    }])

    if (error) throw error
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur serveur'
    console.error('[contact] POST error:', message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
