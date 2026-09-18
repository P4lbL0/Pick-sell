import { createAdminCrud } from '@/lib/admin-crud'

export const { GET, POST, PUT, DELETE } = createAdminCrud('service_quotes', {
  columns: ['title', 'universe', 'service_type', 'items', 'note'],
  filters: ['universe', 'service_type'],
  hasUpdatedAt: true,
})
