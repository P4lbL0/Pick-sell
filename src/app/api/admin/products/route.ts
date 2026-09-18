import { createAdminCrud } from '@/lib/admin-crud'

export const { GET, POST, PUT, DELETE } = createAdminCrud('products', {
  columns: ['title', 'price', 'category', 'universe', 'stock', 'short_description', 'long_description', 'image_url', 'vinted_url'],
  filters: ['universe'],
})
