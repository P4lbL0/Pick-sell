import { createAdminCrud } from '@/lib/admin-crud'

export const { GET, POST, PUT, DELETE } = createAdminCrud('services', {
  columns: ['title', 'slug', 'description', 'type', 'universe', 'contact_url'],
  filters: ['universe'],
})
