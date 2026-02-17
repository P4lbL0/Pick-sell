import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'L\'image doit faire moins de 5MB' },
        { status: 400 }
      )
    }

    // Créer un nom de fichier unique
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`
    const filePath = `products/${fileName}`

    // Uploader vers Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Erreur upload Supabase:', uploadError)
      return NextResponse.json(
        { error: `Erreur lors de l'upload: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error('Erreur API upload:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    )
  }
}
