import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')

    let query = getSupabaseAdmin().from('product_colors').select('*')

    if (product_id) {
      query = query.eq('product_id', product_id)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[colors] GET error:', msg)
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
      .from('product_colors')
      .insert([body])
      .select()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[colors] POST error:', msg)
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
      .from('product_colors')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : 'Erreur serveur'
    console.error('[colors] DELETE error:', msg)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
