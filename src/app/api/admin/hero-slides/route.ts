import { createAdminCrud } from '@/lib/admin-crud'

export const { GET, POST, PUT, DELETE } = createAdminCrud('hero_slides', {
  columns: ['title', 'subtitle', 'image_url', 'video_url', 'universe_type', 'cta_text', 'cta_link', 'order_index'],
  filters: ['universe_type'],
  orderBy: 'order_index',
  ascending: true,
})
