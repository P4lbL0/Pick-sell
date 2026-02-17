'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateProductPages(universe: string) {
  // Revalidate all product-related pages
  revalidatePath(`/${universe}`)
  revalidatePath(`/${universe}/products`)
  revalidatePath('/horlogerie', 'page')
  revalidatePath('/informatique', 'page')
}

export async function revalidateHeroSlides(universe: string) {
  revalidatePath(`/${universe}`, 'page')
}
