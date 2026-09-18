import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/supabase-auth'

interface CrudOptions {
  /** Colonnes modifiables depuis l'admin — tout autre champ envoyé est ignoré. */
  columns: readonly string[]
  /** Paramètres d'URL acceptés comme filtre sur le GET (ex: universe). */
  filters?: readonly string[]
  select?: string
  orderBy?: string
  ascending?: boolean
  /** La table a une colonne updated_at à tenir à jour. */
  hasUpdatedAt?: boolean
}

function pickColumns(body: Record<string, unknown>, columns: readonly string[]) {
  const row: Record<string, unknown> = {}
  for (const col of columns) {
    if (col in body) row[col] = body[col]
  }
  return row
}

function serverError(table: string, method: string, error: unknown) {
  const e = error as { message?: string; details?: string; hint?: string }
  console.error(`[admin/${table}] ${method} error:`, e?.message ?? error)
  // Message lisible pour l'admin (route protégée), sans détails internes superflus
  return NextResponse.json({ error: e?.message || 'Erreur serveur' }, { status: 500 })
}

/** Les pages publiques sont en ISR : on vide le cache après chaque écriture admin. */
function revalidateSite() {
  revalidatePath('/', 'layout')
}

/**
 * Génère les handlers GET / POST / PUT / DELETE d'une table admin.
 * Convention : POST {…}, PUT {id, …}, DELETE ?id=…
 */
export function createAdminCrud(table: string, options: CrudOptions) {
  const { columns, filters = [], select = '*', orderBy = 'created_at', ascending = false, hasUpdatedAt = false } = options

  async function GET(request: NextRequest) {
    const denied = await requireAdmin()
    if (denied) return denied
    try {
      const { searchParams } = new URL(request.url)
      let query = getSupabaseAdmin().from(table).select(select)
      for (const f of filters) {
        const value = searchParams.get(f)
        if (value && value !== 'all') query = query.eq(f, value)
      }
      const { data, error } = await query.order(orderBy, { ascending })
      if (error) throw error
      return NextResponse.json(data ?? [])
    } catch (error) {
      return serverError(table, 'GET', error)
    }
  }

  async function POST(request: NextRequest) {
    const denied = await requireAdmin()
    if (denied) return denied
    try {
      const row = pickColumns(await request.json(), columns)
      const { data, error } = await getSupabaseAdmin().from(table).insert([row]).select().single()
      if (error) throw error
      revalidateSite()
      return NextResponse.json(data, { status: 201 })
    } catch (error) {
      return serverError(table, 'POST', error)
    }
  }

  async function PUT(request: NextRequest) {
    const denied = await requireAdmin()
    if (denied) return denied
    try {
      const body = await request.json()
      if (!body?.id) return NextResponse.json({ error: 'id requis' }, { status: 400 })
      const row = pickColumns(body, columns)
      if (hasUpdatedAt) row.updated_at = new Date().toISOString()
      const { data, error } = await getSupabaseAdmin().from(table).update(row).eq('id', body.id).select()
      if (error) throw error
      if (!data?.length) return NextResponse.json({ error: 'Élément introuvable' }, { status: 404 })
      revalidateSite()
      return NextResponse.json(data[0])
    } catch (error) {
      return serverError(table, 'PUT', error)
    }
  }

  async function DELETE(request: NextRequest) {
    const denied = await requireAdmin()
    if (denied) return denied
    try {
      const id = new URL(request.url).searchParams.get('id')
      if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })
      const { data, error } = await getSupabaseAdmin().from(table).delete().eq('id', id).select('id')
      if (error) throw error
      if (!data?.length) return NextResponse.json({ error: 'Élément introuvable' }, { status: 404 })
      revalidateSite()
      return NextResponse.json({ success: true })
    } catch (error) {
      return serverError(table, 'DELETE', error)
    }
  }

  return { GET, POST, PUT, DELETE }
}
