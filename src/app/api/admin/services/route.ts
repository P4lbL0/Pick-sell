import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const universe = searchParams.get('universe')

    let query = getSupabaseAdmin().from('services').select('*')

    if (universe) {
      query = query.eq('universe', universe)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[services] GET error:', msg)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await getSupabaseAdmin()
      .from('services')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
      }])
      .select()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[services] POST error:', msg)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const { data, error } = await getSupabaseAdmin()
      .from('services')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[services] PUT error:', msg)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      )
    }

    const { error } = await getSupabaseAdmin()
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[services] DELETE error:', msg)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
