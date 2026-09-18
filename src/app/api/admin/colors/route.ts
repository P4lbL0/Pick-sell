import { createAdminCrud } from '@/lib/admin-crud'

export const { GET, POST, PUT, DELETE } = createAdminCrud('product_colors', {
  columns: ['product_id', 'name', 'hex_color', 'image_url', 'stock'],
  filters: ['product_id'],
  select: '*, product:products(id, title, universe)',
})
