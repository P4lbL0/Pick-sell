/**
 * Helper functions for products and colors
 */

import { ProductColor } from '@/lib/types'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function getProductColors(
  productId: string
): Promise<ProductColor[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('product_colors')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch (error) {
    console.error('Error fetching product colors:', error)
    return []
  }
}

/**
 * Get a category label from its slug
 */
export const getCategoryLabel = (category: string): string => {
  const labels: { [key: string]: string } = {
    'seiko-mod': 'Seiko MOD',
    'diverse': 'Montres Diverses',
    'accessories': 'Accessoires',
    'computer': 'Ordinateurs',
    'computer-accessories': 'Accessoires Ordinateurs',
  }
  return labels[category] || category
}
