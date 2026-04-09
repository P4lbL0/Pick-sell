/**
 * Helper functions for products and colors
 */

import { ProductColor } from '@/lib/types'

export async function getProductColors(
  productId: string
): Promise<ProductColor[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/admin/colors?product_id=${productId}`)
    if (!res.ok) return []
    return await res.json()
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
